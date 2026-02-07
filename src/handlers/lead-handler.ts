import { z } from 'zod';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { validateEnv } from '../lib/security';

// Schema para validación de creación de lead
const CreateLeadSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'Nombre demasiado largo'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  source: z.enum(['web', 'whatsapp', 'manual', 'api'], {
    errorMap: () => ({ message: 'Fuente debe ser: web, whatsapp, manual o api' })
  }).default('manual'),
  notes: z.string().max(500, 'Notas demasiado largas').optional(),
  assigned_to: z.string().uuid('ID de agente inválido').optional(),
  tenant_id: z.string().uuid('ID de tenant inválido').optional()
});

export type CreateLeadRequest = z.infer<typeof CreateLeadSchema>;

// Schema para respuesta
const LeadResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  source: z.string(),
  notes: z.string().nullable(),
  lead_score: z.number(),
  status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost']),
  assigned_to: z.string().nullable(),
  tenant_id: z.string().uuid(),
  created_at: z.string(),
  updated_at: z.string()
});

export type LeadResponse = z.infer<typeof LeadResponseSchema>;

// Configuración de scoring basada en spec
function calculateLeadScore(data: CreateLeadRequest): number {
  let score = 0;

  // Puntos por fuente (basado en spec)
  const sourcePoints: Record<string, number> = {
    web: 30,
    whatsapp: 50,
    manual: 70,
    api: 40
  };
  score += sourcePoints[data.source] || 0;

  // Bonus por email corporativo
  const corporateDomains = ['gmail.com', 'outlook.com', 'yahoo.com'];
  if (data.email && !corporateDomains.some(domain => data.email.includes(domain))) {
    score += 20;
  }

  // Bonus por teléfono
  if (data.phone && data.phone.trim().length >= 8) {
    score += 10;
  }

  return Math.min(score, 100); // Máximo 100
}

// Validación de duplicados
async function checkDuplicateLead(email: string, tenant_id: string): Promise<boolean> {
  const supabase = createServerSupabaseClient();

  const { data: existing, error } = await supabase
    .from('customers')
    .select('id')
    .eq('email', email)
    .eq('tenant_id', tenant_id)
    .eq('status', 'new') // Solo duplicados en estado new
    .maybeSingle();

  if (error) {
    console.error('Error checking duplicate lead:', error);
    throw new Error(`Database error checking duplicates: ${error.message}`);
  }

  return !!existing;
}

// Handler principal para crear lead
export async function odoo_create_lead(request: CreateLeadRequest, context?: {
  user_id?: string;
  tenant_id?: string;
  role?: string;
}): Promise<LeadResponse> {
  try {
    // 1. Validar input
    const validated = CreateLeadSchema.parse(request);

    // 2. Agregar tenant_id del contexto si no viene en request
    const tenant_id = validated.tenant_id || context?.tenant_id;
    if (!tenant_id) {
      throw new Error('tenant_id es requerido para crear un lead');
    }

    // 3. Verificar duplicados
    const isDuplicate = await checkDuplicateLead(validated.email, tenant_id);
    if (isDuplicate) {
      throw new Error(`Ya existe un lead con email ${validated.email} en este tenant`);
    }

    // 4. Calcular lead score
    const lead_score = calculateLeadScore(validated);

    // 5. Asignar automáticamente si hay threshold
    let assigned_to = validated.assigned_to;
    if (!assigned_to && lead_score >= 60) {
      // TODO: Implementar lógica de asignación automática
      // Por ahora se queda sin asignar
      assigned_to = undefined;
    }

    // 6. Insertar en base de datos
    const supabase = createServerSupabaseClient();

    const newLead = {
      name: validated.name,
      email: validated.email,
      phone: validated.phone || null,
      source: validated.source,
      notes: validated.notes || null,
      lead_score,
      status: 'new' as const,
      assigned_to: assigned_to || undefined,
      tenant_id,
      created_by: context?.user_id || null,
      metadata: {
        created_via: 'mcp_tool',
        role_context: context?.role,
        created_at: new Date().toISOString()
      }
    };

    const { data, error } = await supabase
      .from('customers')
      .insert(newLead)
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating lead in database:', error);
      throw new Error(`Error en base de datos: ${error.message}`);
    }

    // 7. Validar respuesta y retornar
    const response = LeadResponseSchema.parse({
      ...data,
      created_at: data.created_at,
      updated_at: data.updated_at
    });

    console.log(`✅ Lead creado exitosamente: ${response.id} (score: ${lead_score})`);
    return response;

  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(e => e.message).join(', ');
      throw new Error(`Validación fallida: ${errorMessage}`);
    }

    console.error('❌ Error in odoo_create_lead:', error);
    throw error instanceof Error ? error : new Error('Error desconocido creando lead');
  }
}

// Handler simplificado para pruebas sin contexto
export async function create_simple_lead(data: {
  name: string;
  email: string;
  phone?: string;
  source?: string;
  notes?: string;
}): Promise<LeadResponse> {
  return odoo_create_lead(data as CreateLeadRequest, {
    tenant_id: 'default-tenant' // TODO: Obtener del auth context
  });
}

// Exportar para uso en MCP server
export default {
  odoo_create_lead,
  create_simple_lead
};