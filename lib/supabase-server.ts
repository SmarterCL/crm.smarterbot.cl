import { createClient } from "@supabase/supabase-js"

// Cliente para el lado del servidor (API routes, Server Components)
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

  // During build time, use placeholder values to avoid build errors
  const url = supabaseUrl || "https://placeholder.supabase.co"
  const key = supabaseKey || "placeholder-key"

  return createClient(url, key, {
    auth: {
      persistSession: false,
    },
  })
}
