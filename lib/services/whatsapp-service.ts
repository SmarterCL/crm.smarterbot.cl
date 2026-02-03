import { createServerSupabaseClient } from "@/lib/supabase"

export type WhatsAppMessage = {
  id: string
  client_id: string
  direction: "incoming" | "outgoing"
  content: string
  status: string
  read: boolean
  created_at: string
}

export type WhatsAppMessageWithClient = WhatsAppMessage & {
  clients: { name: string } | null
}

export async function getWhatsAppMessages(limit = 10): Promise<WhatsAppMessageWithClient[]> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("whatsapp_messages")
    .select("*, clients(name)")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    if (error.code === "PGRST204" || error.code === "PGRST205") {
      console.warn(`Table 'whatsapp_messages' might be missing. Error: ${error.message}`)
      return []
    }
    console.error("Error fetching WhatsApp messages:", error)
    return []
  }

  return data || []
}

export async function getClientMessages(clientId: string): Promise<WhatsAppMessage[]> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("whatsapp_messages")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: true })

  if (error) {
    if (error.code === "PGRST204" || error.code === "PGRST205") {
      console.warn(`Table 'whatsapp_messages' might be missing. Error: ${error.message}`)
      return []
    }
    console.error(`Error fetching messages for client ${clientId}:`, error)
    return []
  }

  return data || []
}

export async function sendWhatsAppMessage(
  message: Omit<WhatsAppMessage, "id" | "created_at">,
): Promise<WhatsAppMessage> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("whatsapp_messages").insert([message]).select().single()

  if (error) {
    console.error("Error sending WhatsApp message:", error)
    throw error
  }

  return data
}

export async function markMessageAsRead(id: string): Promise<void> {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("whatsapp_messages").update({ read: true }).eq("id", id)

  if (error) {
    console.error(`Error marking message ${id} as read:`, error)
    throw error
  }
}
