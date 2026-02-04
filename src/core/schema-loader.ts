import { z } from "zod";

// 1. Tipos basados en el diseño de SmarterBOT
export const ToolDefinitionSchema = z.object({
  handler: z.string().optional(),
  description: z.string(),
  parameters: z.any() // JSON Schema para validación
});

export const ResourceDefinitionSchema = z.object({
  description: z.string(),
  content_type: z.string(),
  handler: z.string().optional()
});

export const RoleDefinitionSchema = z.object({
  description: z.string(),
  system_prompt: z.string(),
  allowed_tools: z.array(z.string()),
  restricted_resources: z.array(z.string()),
  rate_limit: z.object({
    requests_per_minute: z.number()
  }),
  handler: z.string().optional(),
  audit_required: z.boolean().optional()
});

export type ToolDefinition = z.infer<typeof ToolDefinitionSchema>;
export type ResourceDefinition = z.infer<typeof ResourceDefinitionSchema>;
export type RoleDefinition = z.infer<typeof RoleDefinitionSchema>;

// 2. El Cargador Maestro - Soporta local y GitHub
export class SmarterSpecLoader {
  private baseUrl: string;
  private useLocal: boolean;

  constructor(options?: { baseUrl?: string; useLocal?: boolean }) {
    this.useLocal = options?.useLocal ?? true; // Por defecto usar local
    this.baseUrl = options?.baseUrl ?? "https://raw.githubusercontent.com/SmarterCL/smarteros-specs/main/core";
  }

  // Método genérico para cargar JSON
  private async loadJson<T>(path: string, schema: z.ZodType<T>): Promise<T> {
    try {
      const url = this.useLocal ? 
        `${process.cwd()}/mcp/${path}` : 
        `${this.baseUrl}/${path}`;
      
      console.log(`📋 Loading spec from: ${url}`);
      
      const response = this.useLocal ? 
        await fetch(`file://${url}`) : 
        await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to load ${path}: ${response.statusText}`);
      }
      
      const json = await response.json();
      return schema.parse(json);
    } catch (error) {
      console.error(`❌ Error loading ${path}:`, error);
      throw error;
    }
  }

  // Cargar todas las tools (transforma objeto a array para MCP)
  async loadTools(): Promise<Array<{ name: string; handler?: string; description: string; parameters: any }>> {
    const toolsObject = await this.loadJson<Record<string, ToolDefinition>>('core/tools.json', z.record(ToolDefinitionSchema));
    
    return Object.entries(toolsObject).map(([name, definition]) => ({
      name,
      handler: definition.handler || name, // Si no hay handler, usa el nombre
      description: definition.description,
      parameters: definition.parameters
    }));
  }

  // Cargar un tool específico
  async loadTool(toolName: string): Promise<{ name: string; handler?: string; description: string; parameters: any }> {
    const tools = await this.loadTools();
    const tool = tools.find(t => t.name === toolName);
    
    if (!tool) {
      throw new Error(`Tool ${toolName} no encontrado en las especificaciones`);
    }
    
    return tool;
  }

  // Cargar todos los resources
  async loadResources(): Promise<Array<{ name: string; handler?: string; description: string; content_type: string }>> {
    const resourcesObject = await this.loadJson<Record<string, ResourceDefinition>>('core/resources.json', z.record(ResourceDefinitionSchema));
    
    return Object.entries(resourcesObject).map(([name, definition]) => ({
      name,
      handler: definition.handler || name,
      description: definition.description,
      content_type: definition.content_type
    }));
  }

  // Cargar un role específico
  async loadRole(roleName: string): Promise<RoleDefinition> {
    const rolesObject = await this.loadJson<Record<string, RoleDefinition>>('core/prompts.json', z.record(RoleDefinitionSchema));
    const role = rolesObject[roleName];
    
    if (!role) {
      throw new Error(`Rol ${roleName} no definido en las especificaciones`);
    }
    
    return role;
  }

  // Cargar configuración de tenant
  async loadTenantConfig(tenantId: string = 'default'): Promise<any> {
    return this.loadJson(`tenants/${tenantId}/config.json`, z.any());
  }

  // Validar que una tool esté permitida para un role
  async validateToolForRole(toolName: string, roleName: string): Promise<boolean> {
    try {
      const role = await this.loadRole(roleName);
      return role.allowed_tools.includes('*') || role.allowed_tools.includes(toolName);
    } catch (error) {
      console.error(`❌ Error validando tool ${toolName} para role ${roleName}:`, error);
      return false;
    }
  }

  // Validar acceso a recursos para un role
  async validateResourceAccess(resourcePattern: string, roleName: string): Promise<boolean> {
    try {
      const role = await this.loadRole(roleName);
      
      // Si el rol tiene acceso a todo, permitir
      if (role.restricted_resources.length === 0) {
        return true;
      }
      
      // Verificar que el recurso no esté en la lista de restringidos
      return !role.restricted_resources.some(restricted => {
        // Soporta wildcards como "payments::*"
        const pattern = restricted.replace('*', '.*');
        const regex = new RegExp(`^${pattern}$`);
        return regex.test(resourcePattern);
      });
    } catch (error) {
      console.error(`❌ Error validando recurso ${resourcePattern} para role ${roleName}:`, error);
      return false;
    }
  }

  // Obtener límite de rate limit para un role
  async getRateLimitForRole(roleName: string): Promise<number> {
    try {
      const role = await this.loadRole(roleName);
      return role.rate_limit.requests_per_minute;
    } catch (error) {
      console.error(`❌ Error obteniendo rate limit para role ${roleName}:`, error);
      return 10; // Default conservador
    }
  }
}

// 3. Cache Layer para evitar requests repetidos
class SpecCache {
  private cache = new Map<string, { data: any; expiry: number }>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutos

  set(key: string, data: any, ttl: number = this.defaultTTL) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry || Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  clear() {
    this.cache.clear();
  }

  // Limpiar cache expirado periódicamente
  startCleanup() {
    setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.cache.entries()) {
        if (now > entry.expiry) {
          this.cache.delete(key);
        }
      }
    }, 60 * 1000); // Limpiar cada minuto
  }
}

// 4. Loader con Cache integrado
export class CachedSmarterSpecLoader extends SmarterSpecLoader {
  private cache = new SpecCache();

  constructor(options?: { baseUrl?: string; useLocal?: boolean }) {
    super(options);
    this.cache.startCleanup();
  }

  async loadTools() {
    const cacheKey = 'tools';
    let result = this.cache.get(cacheKey);
    
    if (!result) {
      result = await super.loadTools();
      this.cache.set(cacheKey, result);
    }
    
    return result;
  }

  async loadRole(roleName: string) {
    const cacheKey = `role:${roleName}`;
    let result = this.cache.get(cacheKey);
    
    if (!result) {
      result = await super.loadRole(roleName);
      this.cache.set(cacheKey, result);
    }
    
    return result;
  }

  async loadTenantConfig(tenantId: string = 'default') {
    const cacheKey = `tenant:${tenantId}`;
    let result = this.cache.get(cacheKey);
    
    if (!result) {
      result = await super.loadTenantConfig(tenantId);
      this.cache.set(cacheKey, result);
    }
    
    return result;
  }

  // Método para limpiar cache manualmente (útil durante desarrollo)
  clearCache() {
    this.cache.clear();
    console.log('🧹 SmarterBOT Spec cache cleared');
  }
}

// 5. Instancia global para uso en la aplicación
export const specLoader = new CachedSmarterSpecLoader({
  useLocal: true, // Cambiar a false cuando subas a GitHub
  // baseUrl: 'https://raw.githubusercontent.com/SmarterCL/smarteros-specs/main/core'
});

// 6. Utilidades de debugging
export async function debugSpecs() {
  console.log('🔍 Debugging SmarterBOT Specs...');
  
  try {
    const tools = await specLoader.loadTools();
    console.log(`📋 Tools loaded: ${tools.length}`);
    tools.forEach((tool: any) => console.log(`  - ${tool.name} → ${tool.handler}`));

    const role = await specLoader.loadRole('sales_assistant');
    console.log(`🤖 Sales Assistant tools: ${role.allowed_tools.join(', ')}`);
    console.log(`🚫 Restricted resources: ${role.restricted_resources.join(', ')}`);

    const config = await specLoader.loadTenantConfig();
    console.log(`⚙️ Tenant config validation rules loaded`);
    
    return { tools, role, config };
  } catch (error) {
    console.error('❌ Debug failed:', error);
    throw error;
  }
}