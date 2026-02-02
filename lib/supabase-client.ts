"use client"

import { createBrowserClient } from "@supabase/ssr"

// Cliente para el lado del cliente (browser)
let clientSupabaseClient: ReturnType<typeof createBrowserClient> | null = null

export const createClientSupabaseClient = () => {
  // Durante SSR, retornar null en lugar de lanzar error
  // Esto permite que el módulo se importe de forma segura
  if (typeof window === "undefined") {
    return null as any
  }

  if (clientSupabaseClient) return clientSupabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Faltan las variables de entorno de Supabase para el cliente")
  }

  clientSupabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey)

  return clientSupabaseClient
}
