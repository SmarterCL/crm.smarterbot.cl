import { NextRequest } from 'next/server'

function base() {
  const url = process.env.CHATWOOT_API_URL
  if (!url) throw new Error('CHATWOOT_API_URL no está definido')
  return url.replace(/\/$/, '')
}

function account() {
  const id = process.env.CHATWOOT_ACCOUNT_ID
  if (!id) throw new Error('CHATWOOT_ACCOUNT_ID no está definido')
  return id
}

function headers() {
  const token = process.env.CHATWOOT_ACCESS_TOKEN
  if (!token) throw new Error('CHATWOOT_ACCESS_TOKEN no está definido')
  return { 'api_access_token': token, 'Content-Type': 'application/json' }
}

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  const subpath = params.path?.join('/') ?? ''
  const search = req.nextUrl.search ? req.nextUrl.search : ''
  const url = `${base()}/api/v1/accounts/${account()}/${subpath}${search}`
  const res = await fetch(url, { headers: headers(), cache: 'no-store' })
  const text = await res.text()
  return new Response(text, { status: res.status, headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' } })
}

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  const subpath = params.path?.join('/') ?? ''
  const url = `${base()}/api/v1/accounts/${account()}/${subpath}`
  const body = await req.text()
  const res = await fetch(url, { method: 'POST', headers: headers(), body })
  const text = await res.text()
  return new Response(text, { status: res.status, headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' } })
}
