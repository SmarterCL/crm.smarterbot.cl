import { z } from 'zod'

// Environment validation schema
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().min(1),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // Chatwoot
  CHATWOOT_API_URL: z.string().url().min(1),
  CHATWOOT_ACCOUNT_ID: z.string().min(1),
  CHATWOOT_ACCESS_TOKEN: z.string().min(1),

  // Internal auth tokens
  SEED_API_TOKEN: z.string().min(1).optional(),

  // Rate limiting
  RATE_LIMIT_REQUESTS_PER_MINUTE: z.string().default('60').transform(Number),
})

export function validateEnv() {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    console.error('❌ Environment validation failed:', error)
    throw new Error('Missing or invalid environment variables')
  }
}

export const env = validateEnv()

// Production checks
export function isProduction() {
  return env.NODE_ENV === 'production'
}

export function isDevelopment() {
  return env.NODE_ENV === 'development'
}

// Internal token validation
export function validateInternalToken(token: string): boolean {
  if (!env.SEED_API_TOKEN) {
    return isDevelopment() // Allow in dev without token
  }

  return token === env.SEED_API_TOKEN
}

// Rate limiting store (in-memory for production, use Redis in real apps)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string,
  maxRequests: number = parseInt(env.RATE_LIMIT_REQUESTS_PER_MINUTE.toString())
): { allowed: boolean; resetTime?: number; remaining?: number } {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const key = identifier

  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs
    })
    return { allowed: true, remaining: maxRequests - 1 }
  }

  if (record.count >= maxRequests) {
    return {
      allowed: false,
      resetTime: record.resetTime,
      remaining: 0
    }
  }

  record.count++
  return {
    allowed: true,
    remaining: maxRequests - record.count
  }
}

// Clean up old rate limit records periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000) // Cleanup every 5 minutes