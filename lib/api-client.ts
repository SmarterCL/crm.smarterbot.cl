// API Client para crm.smarterbot.cl
// Conecta con api.smarterbot.cl

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.smarterbot.cl'

/**
 * Fetch helper con autenticación
 */
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  }
  
  // TODO: Agregar token de Clerk cuando esté configurado
  // const session = await getSession()
  // if (session?.token) {
  //   headers['Authorization'] = `Bearer ${session.token}`
  // }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }
  
  return response.json()
}

/**
 * CRM API Client
 */
export const crmApi = {
  /**
   * Obtener lista de clientes
   */
  async getClientes(params?: {
    limit?: number
    offset?: number
    origen?: string
    busqueda?: string
  }) {
    const query = new URLSearchParams(params as any).toString()
    return apiRequest(`/crm/clientes${query ? `?${query}` : ''}`)
  },
  
  /**
   * Obtener estadísticas del CRM
   */
  async getEstadisticas() {
    return apiRequest('/crm/estadisticas')
  },
  
  /**
   * Obtener eventos del calendario
   */
  async getCalendario(params?: {
    fecha_inicio?: string
    fecha_fin?: string
    limit?: number
  }) {
    const query = new URLSearchParams(params as any).toString()
    return apiRequest(`/crm/calendario${query ? `?${query}` : ''}`)
  },
  
  /**
   * Obtener configuración del CRM
   */
  async getConfig() {
    return apiRequest('/crm/config')
  },
  
  /**
   * Sincronizar contacto en todos los sistemas
   */
  async syncContact(data: {
    nombre: string
    email?: string
    telefono?: string
    empresa?: string
    origen?: string
    notas?: string
  }) {
    return apiRequest('/crm/sync', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  
  /**
   * Health check del CRM
   */
  async health() {
    return apiRequest('/crm/health')
  },
}

/**
 * Ejemplo de uso en un componente Next.js:
 * 
 * ```tsx
 * 'use client'
 * 
 * import { useEffect, useState } from 'react'
 * import { crmApi } from '@/lib/api-client'
 * 
 * export default function ClientesPage() {
 *   const [clientes, setClientes] = useState([])
 *   const [loading, setLoading] = useState(true)
 * 
 *   useEffect(() => {
 *     async function fetchClientes() {
 *       try {
 *         const data = await crmApi.getClientes({ limit: 50 })
 *         setClientes(data.clientes)
 *       } catch (error) {
 *         console.error('Error fetching clientes:', error)
 *       } finally {
 *         setLoading(false)
 *       }
 *     }
 * 
 *     fetchClientes()
 *   }, [])
 * 
 *   if (loading) return <div>Cargando...</div>
 * 
 *   return (
 *     <div>
 *       <h1>Clientes ({clientes.length})</h1>
 *       <ul>
 *         {clientes.map((cliente) => (
 *           <li key={cliente.id}>
 *             {cliente.nombre} - {cliente.email}
 *           </li>
 *         ))}
 *       </ul>
 *     </div>
 *   )
 * }
 * ```
 * 
 * Para estadísticas:
 * 
 * ```tsx
 * const stats = await crmApi.getEstadisticas()
 * 
 * console.log('Total clientes:', stats.total_clientes)
 * console.log('Conversaciones abiertas:', stats.conversaciones_abiertas)
 * console.log('Ventas del mes:', stats.ventas_mes)
 * ```
 * 
 * Para calendario:
 * 
 * ```tsx
 * const eventos = await crmApi.getCalendario({
 *   fecha_inicio: '2025-11-01',
 *   fecha_fin: '2025-11-30'
 * })
 * 
 * console.log('Eventos:', eventos.eventos)
 * ```
 */
