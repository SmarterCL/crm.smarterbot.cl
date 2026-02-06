import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { checkRateLimit, isProduction } from "./lib/security"

// Rate limiting configurations
const API_RATE_LIMITS = {
  'default': 100,        // requests per minute
  'auth': 30,           // auth endpoints (login, register)
  'seed': 5,            // seed endpoint
  'chatwoot': 60,       // chatwoot proxy
}

// Security headers for API routes
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}

function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const ip = forwarded?.split(',')[0]?.trim() || realIp?.trim() || 'unknown'

  // Create a unique identifier using IP + User-Agent hash
  return `${ip}:${userAgent.slice(0, 50)}`
}

function getRateLimitCategory(pathname: string): string {
  if (pathname.includes('/api/auth')) return 'auth'
  if (pathname.includes('/api/seed')) return 'seed'
  if (pathname.includes('/api/chatwoot')) return 'chatwoot'
  if (pathname.startsWith('/api/')) return 'default'
  return 'none' // No rate limiting for non-API routes
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Add HSTS in production
  if (isProduction()) {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
  }

  return response
}

function detectSuspiciousPatterns(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent') || ''
  const url = request.url.toLowerCase()

  // Block suspicious user agents
  const suspiciousAgents = [
    /bot/i, /crawler/i, /scraper/i, /spider/i,
    /curl/i, /wget/i, /python/i, /java/i,
    /go-http-client/i, /node-fetch/i
  ]

  // Allow legitimate bots only on specific routes
  const isBotRoute = url.includes('/api/') || url.includes('/login') || url.includes('/register')
  if (isBotRoute && suspiciousAgents.some(agent => agent.test(userAgent))) {
    return true
  }

  // Block suspicious URL patterns
  const suspiciousPatterns = [
    /\.\./,          // Directory traversal
    /<script/i,      // XSS attempts
    /javascript:/i,  // JavaScript protocol
    /data:/i,        // Data protocol
    /file:/i,        // File protocol
  ]

  return suspiciousPatterns.some(pattern => pattern.test(url))
}

export async function middleware(request: NextRequest) {
  // Detect suspicious patterns first
  if (detectSuspiciousPatterns(request)) {
    console.warn('Suspicious request blocked:', {
      url: request.url,
      userAgent: request.headers.get('user-agent'),
      ip: getClientIdentifier(request),
      timestamp: new Date().toISOString()
    })

    return new Response('Forbidden', {
      status: 403,
      headers: SECURITY_HEADERS
    })
  }

  // Initialize response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Rate limiting for API routes
  const rateLimitCategory = getRateLimitCategory(request.nextUrl.pathname)
  if (rateLimitCategory !== 'none') {
    const clientId = getClientIdentifier(request)
    const maxRequests = API_RATE_LIMITS[rateLimitCategory as keyof typeof API_RATE_LIMITS]

    const rateLimitResult = checkRateLimit(`${rateLimitCategory}:${clientId}`, maxRequests)
    if (!rateLimitResult.allowed) {
      const errorResponse = NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: `Too many requests for ${rateLimitCategory} endpoint`,
          retry_after: Math.ceil((rateLimitResult.resetTime! - Date.now()) / 1000),
          category: rateLimitCategory,
          limit: maxRequests
        },
        { status: 429 }
      )

      // Add rate limit headers
      errorResponse.headers.set('Retry-After', Math.ceil((rateLimitResult.resetTime! - Date.now()) / 1000).toString())
      errorResponse.headers.set('X-RateLimit-Limit', maxRequests.toString())
      errorResponse.headers.set('X-RateLimit-Remaining', '0')
      errorResponse.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime!.toString())

      return addSecurityHeaders(errorResponse)
    }

    // Add rate limit info headers to successful responses
    response.headers.set('X-RateLimit-Limit', maxRequests.toString())
    response.headers.set('X-RateLimit-Remaining', (rateLimitResult.remaining || 0).toString())
    response.headers.set('X-RateLimit-Reset', (rateLimitResult.resetTime || 0).toString())
  }

  // Supabase authentication middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Define public routes
  const publicRoutes = [
    "/login",
    "/register",
    "/reset-password",
    "/forgot-password",
    "/seed-database",
    "/api/auth/login",
    "/api/auth/register",
    "/api/seed", // Protected by token, but public route
  ]
  const isPublicRoute = publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // Authentication check for protected routes
  if (!session && !isPublicRoute && !request.nextUrl.pathname.startsWith('/api/')) {
    const redirectUrl = new URL("/login", request.url)
    redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname)
    const redirectResponse = NextResponse.redirect(redirectUrl)
    return addSecurityHeaders(redirectResponse)
  }

  // Redirect authenticated users away from auth pages
  if (session && isPublicRoute && !request.nextUrl.pathname.startsWith('/api/')) {
    const redirectResponse = NextResponse.redirect(new URL("/", request.url))
    return addSecurityHeaders(redirectResponse)
  }

  // Add security headers to all responses
  return addSecurityHeaders(response)
}

// Exportar función principal del proxy
export async function proxy() {
  // El proxy está implementado dentro de la lógica anterior
}

// Configurar las rutas que deben ser manejadas por el proxy
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
}
