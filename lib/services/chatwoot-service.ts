type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: any
}

export type ChatwootInbox = {
  id: number
  name: string
  channel_type: string
}

export type ChatwootConversation = {
  id: number
  inbox_id: number
  status: 'open' | 'resolved' | 'snoozed' | 'pending'
  meta?: Record<string, any>
}

export type ChatwootMessage = {
  id: number
  content: string
  message_type: 'incoming' | 'outgoing'
  created_at: number
}

function getBase(): string {
  const base = process.env.CHATWOOT_API_URL
  if (!base) throw new Error('CHATWOOT_API_URL no está definido')
  return base.replace(/\/$/, '')
}

function getAccountId(): string {
  const id = process.env.CHATWOOT_ACCOUNT_ID
  if (!id) throw new Error('CHATWOOT_ACCOUNT_ID no está definido')
  return id
}

function authHeaders() {
  const token = process.env.CHATWOOT_ACCESS_TOKEN
  if (!token) throw new Error('CHATWOOT_ACCESS_TOKEN no está definido')
  return { 'api_access_token': token }
}

async function doFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const url = `${getBase()}/api/v1/accounts/${getAccountId()}${path}`
  const res = await fetch(url, {
    method: opts.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(opts.headers || {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    // Next.js: asegurar ejecución en server y no cachear conversaciones
    cache: 'no-store',
  } as RequestInit)

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Chatwoot API ${res.status}: ${text}`)
  }
  // Chatwoot suele responder { payload: ... } o { data: ... }
  const json = (await res.json()) as any
  return (json?.payload ?? json?.data ?? json) as T
}

export const ChatwootService = {
  async getInboxes(): Promise<ChatwootInbox[]> {
    return doFetch<ChatwootInbox[]>(`/inboxes`)
  },

  async getConversations(params?: { status?: string; inboxId?: number; page?: number }) {
    const qs = new URLSearchParams()
    if (params?.status) qs.set('status', params.status)
    if (params?.inboxId) qs.set('inbox_id', String(params.inboxId))
    if (params?.page) qs.set('page', String(params.page))
    const suffix = qs.toString() ? `?${qs.toString()}` : ''
    return doFetch<{ conversations: ChatwootConversation[] }>(`/conversations${suffix}`)
  },

  async getMessages(conversationId: number) {
    return doFetch<{ messages: ChatwootMessage[] }>(`/conversations/${conversationId}/messages`)
  },

  async sendMessage(conversationId: number, content: string) {
    return doFetch<ChatwootMessage>(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: { content, message_type: 'outgoing' },
    })
  },
}
