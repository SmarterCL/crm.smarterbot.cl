import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

import { specLoader } from '../core/schema-loader.js';
import { odoo_create_lead, CreateLeadRequest } from '../handlers/lead-handler.js';

// Mapping de handlers reales
const TOOL_HANDLERS = {
  'odoo_create_lead': odoo_create_lead,
  // TODO: Agregar más handlers según se implementen
};

class SmarterBOTMCPServer {
  private server: Server;
  
  constructor() {
    this.server = new Server(
      {
        name: 'smarterbot-crm',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );
    
    this.setupToolHandlers();
  }
  
  private setupToolHandlers() {
    // List tools - carga dinámica desde specs
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      try {
        const tools = await specLoader.loadTools();
        
        return {
          tools: tools.map((tool: { name: string; handler?: string; description: string; parameters: any }) => ({
            name: tool.name,
            description: tool.description,
            inputSchema: tool.parameters
          }))
        };
      } catch (error) {
        console.error('❌ Error loading tools:', error);
        throw new McpError(
          ErrorCode.InternalError,
          'Failed to load tools from specifications'
        );
      }
    });
    
    // Call tool - ejecución con validaciones
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      try {
        console.log(`🔧 Tool called: ${name}`, args);
        
        // 1. Validar que la tool exista en specs
        const tool = await specLoader.loadTool(name);
        if (!tool) {
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Tool ${name} not found in specifications`
          );
        }
        
        // 2. Validar parámetros contra el schema
        // TODO: Implementar validación JSON schema real
        // Por ahora validación básica
        if (name === 'crm.create_lead') {
          return await this.handleCreateLead(args);
        }
        
        // 3. Buscar handler real
        const handlerName = tool.handler;
        const handler = TOOL_HANDLERS[handlerName as keyof typeof TOOL_HANDLERS];
        
        if (!handler) {
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Handler ${handlerName} not implemented yet`
          );
        }
        
        // 4. Ejecutar handler con contexto
        // TODO: Extraer contexto del request (tenant, role, user)
        const context = {
          tenant_id: args.tenant_id || 'default-tenant',
          role: 'sales_assistant', // TODO: Determinar del auth
          user_id: 'system' // TODO: Determinar del auth
        };
        
        const result = await handler(args, context);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                data: result,
                tool: name,
                timestamp: new Date().toISOString()
              }, null, 2)
            }
          ]
        };
        
      } catch (error) {
        console.error(`❌ Error in tool ${name}:`, error);
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const isValidationError = errorMessage.includes('Validación') || errorMessage.includes('inválido');
        const isDuplicateError = errorMessage.includes('duplicado') || errorMessage.includes('Ya existe');
        
        const errorCode = isValidationError ? ErrorCode.InvalidParams :
                         isDuplicateError ? ErrorCode.InvalidParams :
                         ErrorCode.InternalError;
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                error: errorMessage,
                tool: name,
                timestamp: new Date().toISOString(),
                code: errorCode
              }, null, 2)
            }
          ],
          isError: true
        };
      }
    });
  }
  
  // Handler específico para crear lead con validación personalizada
  private async handleCreateLead(args: any) {
    // Validar datos requeridos
    if (!args.name || !args.email) {
      throw new McpError(
        ErrorCode.InvalidParams,
        'Los campos "name" y "email" son requeridos para crear un lead'
      );
    }
    
    // Preparar datos para el handler
    const leadData: CreateLeadRequest = {
      name: args.name.trim(),
      email: args.email.trim().toLowerCase(),
      phone: args.phone?.trim() || undefined,
      source: args.source || 'manual',
      notes: args.notes?.trim() || undefined,
      assigned_to: args.assigned_to || undefined,
      tenant_id: args.tenant_id || 'default-tenant'
    };
    
    // Ejecutar handler real
    const result = await odoo_create_lead(leadData, {
      tenant_id: leadData.tenant_id,
      role: 'sales_assistant', // TODO: Determinar dinámicamente
      user_id: 'mcp-server'
    });
    
    // Formatear respuesta amigable
    return {
      content: [
        {
          type: 'text',
          text: `✅ Lead creado exitosamente:\n\n` +
                `📋 ID: ${result.id}\n` +
                `👤 Nombre: ${result.name}\n` +
                `📧 Email: ${result.email}\n` +
                `📱 Teléfono: ${result.phone || 'No especificado'}\n` +
                `🔗 Fuente: ${result.source}\n` +
                `⭐ Lead Score: ${result.lead_score}/100\n` +
                `📊 Estado: ${result.status}\n` +
                `🏢 Tenant: ${result.tenant_id}\n` +
                `📅 Creado: ${new Date(result.created_at).toLocaleString('es-CL')}`
        }
      ]
    };
  }
  
  // Método para iniciar el servidor
  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('🚀 SmarterBOT MCP Server running on stdio');
  }
}

// Iniciar servidor si este archivo se ejecuta directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new SmarterBOTMCPServer();
  server.run().catch(console.error);
}

export default SmarterBOTMCPServer;