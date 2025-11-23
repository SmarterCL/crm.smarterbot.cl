"use client"

import { createClient } from "@supabase/supabase-js"

// Cliente para el lado del cliente (browser)
let clientSupabaseClient: ReturnType<typeof createClient> | null = null

export const createClientSupabaseClient = () => {
  if (typeof window === "undefined") {
    throw new Error("createClientSupabaseClient debe ser llamado solo en el cliente")
  }

  if (clientSupabaseClient) return clientSupabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Faltan las variables de entorno de Supabase para el cliente")
  }

  clientSupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      storageKey: "smarteros-auth",
    },
  })

  return clientSupabaseClient
}
