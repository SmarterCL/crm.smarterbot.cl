import { NextRequest, NextResponse } from 'next/server'
import { ChatwootSecurityValidator } from '@/lib/chatwoot-security'
import { checkRateLimit, env } from '@/lib/security'

// Secure environment access
function getBaseUrl(): string {
  const url = env.CHATWOOT_API_URL
  return url.replace(/\/$/, '')
}

function getAccountId(): string {
  return env.CHATWOOT_ACCOUNT_ID
}

function getSecureHeaders(): Record<string, string> {
  return ChatwootSecurityValidator.sanitizeHeaders({
    'api_access_token': env.CHATWOOT_ACCESS_TOKEN,
    'Content-Type': 'application/json',
    'User-Agent': 'SmarterBot-CRM/1.0'
  })
}

function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip') 
  const ip = forwarded?.split(',')[0]?.trim() || realIp?.trim() || 'unknown'
  return `chatwoot-proxy:${ip}`
}

async function handleRequest(
  request: NextRequest, 
  method: string, 
  { params }: { params: { path: string[] } }
) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request)
    const pathString = params.path?.join('/') || ''
    const rateLimitMax = ChatwootSecurityValidator.getPathRateLimit(pathString)
    
    const rateLimit = checkRateLimit(clientId, rateLimitMax)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded', 
          message: 'Too many requests',
          retry_after: Math.ceil((rateLimit.resetTime! - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.resetTime! - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': rateLimitMax.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetTime!.toString(),
          }
        }
      )
    }

    // Validate and sanitize path
    const pathValidation = ChatwootSecurityValidator.validateAndCleanPath(params.path || [])
    if (!pathValidation.allowed) {
      return NextResponse.json(
        { 
          error: 'Forbidden path', 
          message: pathValidation.reason,
          allowed_endpoints: ChatwootSecurityValidator.getAllowedEndpoints()
        },
        { status: 403 }
      )
    }

    const cleanedPath = pathValidation.cleanedPath!

    // Validate HTTP method for this path
    if (!ChatwootSecurityValidator.validateMethod(cleanedPath, method)) {
      return NextResponse.json(
        { 
          error: 'Method not allowed', 
          message: `Method ${method} not allowed for path ${cleanedPath}`,
          allowed_methods: pathValidation.method
        },
        { 
          status: 405,
          headers: { 'Allow': (pathValidation.method || []).join(', ') }
        }
      )
    }

    // Sanitize query parameters
    const sanitizedQuery = ChatwootSecurityValidator.sanitizeQueryParams(request.nextUrl.searchParams)
    const queryString = new URLSearchParams(sanitizedQuery).toString()
    const search = queryString ? `?${queryString}` : ''

    // Build secure URL
    const targetUrl = `${getBaseUrl()}/api/v1/accounts/${getAccountId()}/${cleanedPath}${search}`

    // Prepare secure headers
    const secureHeaders = getSecureHeaders()

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers: secureHeaders,
      cache: 'no-store',
      // Add security headers to prevent SSRF
      redirect: 'manual',
    }

    // Add body for POST/PUT requests
    if (method !== 'GET' && method !== 'HEAD') {
      const body = await request.text()
      
      // Validate body size (prevent large payloads)
      if (body.length > 1024 * 1024) { // 1MB limit
        return NextResponse.json(
          { error: 'Payload too large', message: 'Request body exceeds 1MB limit' },
          { status: 413 }
        )
      }

      // Basic body sanitization
      const sanitizedBody = body
        .replace(/[\r\n]/g, '') // Remove newlines
        .replace(/[<>]/g, '') // Remove HTML tags
      
      requestOptions.body = sanitizedBody
    }

    // Make the request with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    try {
      const response = await fetch(targetUrl, {
        ...requestOptions,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      // Get response body
      const responseText = await response.text()

      // Build secure response headers
      const responseHeaders: Record<string, string> = {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        'X-RateLimit-Limit': rateLimitMax.toString(),
        'X-RateLimit-Remaining': rateLimit.remaining!.toString(),
        'X-RateLimit-Reset': rateLimit.resetTime!.toString(),
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
      }

      // Copy safe headers from upstream response
      const allowedResponseHeaders = ['content-type', 'cache-control', 'etag', 'last-modified']
      for (const header of allowedResponseHeaders) {
        const value = response.headers.get(header)
        if (value) {
          responseHeaders[header] = value
        }
      }

      return new Response(responseText, {
        status: response.status,
        headers: responseHeaders
      })

    } catch (fetchError) {
      clearTimeout(timeoutId)
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Gateway timeout', message: 'Request timeout after 30 seconds' },
          { status: 504 }
        )
      }

      throw fetchError
    }

  } catch (error) {
    console.error('Chatwoot proxy error:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      path: params.path,
      method,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'An unexpected error occurred'
      },
      { 
        status: 500,
        headers: {
          'X-Content-Type-Options': 'nosniff'
        }
      }
    )
  }
}

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest(request, 'GET', { params })
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest(request, 'POST', { params })
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest(request, 'PUT', { params })
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest(request, 'DELETE', { params })
}

export async function PATCH(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest(request, 'PATCH', { params })
}

export async function HEAD(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest(request, 'HEAD', { params })
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Allow': 'GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    }
  })
}
