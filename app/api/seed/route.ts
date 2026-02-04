import { type NextRequest, NextResponse } from "next/server"
import { seedDatabase } from "@/lib/seed-data"
import { validateInternalToken, isProduction, checkRateLimit } from "@/lib/security"
import { z } from "zod"

// Rate limit: 5 requests per minute per IP
const SEED_RATE_LIMIT = 5

// Schema for query parameters (if needed)
const seedQuerySchema = z.object({
  force: z.coerce.boolean().optional().default(false),
  token: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    // Extract client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ip = forwarded?.split(',')[0]?.trim() || 
               realIp?.trim() || 
               'unknown'
    
    // Rate limiting check
    const rateLimit = checkRateLimit(`seed:${ip}`, SEED_RATE_LIMIT)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { message: "Too many requests" },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.resetTime! - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': SEED_RATE_LIMIT.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetTime!.toString(),
          }
        }
      )
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url)
    const queryResult = seedQuerySchema.safeParse(Object.fromEntries(searchParams))
    if (!queryResult.success) {
      return NextResponse.json(
        { message: "Invalid query parameters", errors: queryResult.error.issues },
        { status: 400 }
      )
    }

    const { token, force } = queryResult.data

    // Production environment restrictions
    if (isProduction() && !force) {
      return NextResponse.json(
        { message: "Seed endpoint is disabled in production. Use ?force=true with proper authentication." },
        { status: 403 }
      )
    }

    // Authentication check
    const authHeader = request.headers.get('authorization')
    const providedToken = authHeader?.replace('Bearer ', '') || token

    if (!validateInternalToken(providedToken || '')) {
      return NextResponse.json(
        { message: "Unauthorized. Valid token required." },
        { 
          status: 401,
          headers: {
            'WWW-Authenticate': 'Bearer realm="Seed API"'
          }
        }
      )
    }

    // Execute seed operation
    const result = await seedDatabase()

    // Success response with security headers
    const headers = {
      'X-RateLimit-Limit': SEED_RATE_LIMIT.toString(),
      'X-RateLimit-Remaining': rateLimit.remaining!.toString(),
      'X-RateLimit-Reset': rateLimit.resetTime!.toString(),
      'X-Content-Type-Options': 'nosniff',
    }

    if (result.success) {
      return NextResponse.json(
        { 
          message: result.message,
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV
        }, 
        { status: 200, headers }
      )
    } else {
      return NextResponse.json(
        { 
          message: result.message, 
          error: result.error,
          timestamp: new Date().toISOString()
        }, 
        { status: 500, headers }
      )
    }
  } catch (error) {
    console.error("Error en seed endpoint:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    })
    
    return NextResponse.json(
      { 
        message: "Internal server error", 
        timestamp: new Date().toISOString()
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

// Bloquear otros métodos HTTP con headers de seguridad
export async function POST() {
  return NextResponse.json(
    { message: "Method not allowed", allowed_methods: ["GET"] }, 
    { 
      status: 405,
      headers: {
        'Allow': 'GET',
        'X-Content-Type-Options': 'nosniff'
      }
    }
  )
}

export async function PUT() {
  return NextResponse.json(
    { message: "Method not allowed", allowed_methods: ["GET"] }, 
    { 
      status: 405,
      headers: {
        'Allow': 'GET',
        'X-Content-Type-Options': 'nosniff'
      }
    }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { message: "Method not allowed", allowed_methods: ["GET"] }, 
    { 
      status: 405,
      headers: {
        'Allow': 'GET',
        'X-Content-Type-Options': 'nosniff'
      }
    }
  )
}

export async function PATCH() {
  return NextResponse.json(
    { message: "Method not allowed", allowed_methods: ["GET"] }, 
    { 
      status: 405,
      headers: {
        'Allow': 'GET',
        'X-Content-Type-Options': 'nosniff'
      }
    }
  )
}

export async function HEAD() {
  return new Response(null, { 
    status: 405,
    headers: {
      'Allow': 'GET'
    }
  })
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Allow': 'GET',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    }
  })
}
