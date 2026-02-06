import { z } from 'zod'

// Allowlist of permitted Chatwoot API endpoints
const CHATWOOT_ALLOWED_ENDPOINTS = [
  // Conversations
  'conversations',
  'conversations/messages', 
  'conversations/:id/messages',
  
  // Inboxes  
  'inboxes',
  
  // Contacts (read-only)
  'contacts',
  'contacts/:id',
  
  // Reports (read-only)
  'reports/summary',
  'reports/agents',
  'reports/conversations',
  'reports/inboxes',
  
  // Labels (read-only)
  'labels',
  
  // Teams (read-only)
  'teams',
  
  // Available languages (read-only)
  'canned_responses',
  'canned_responses/:id',
  
  // Account settings (read-only)
  'account',
] as const

// Allowed HTTP methods per endpoint
const ALLOWED_METHODS: Record<string, string[]> = {
  'conversations': ['GET', 'POST'],
  'conversations/messages': ['GET'],
  'conversations/:id/messages': ['GET', 'POST'],
  'inboxes': ['GET'],
  'contacts': ['GET'],
  'contacts/:id': ['GET'],
  'reports/summary': ['GET'],
  'reports/agents': ['GET'], 
  'reports/conversations': ['GET'],
  'reports/inboxes': ['GET'],
  'labels': ['GET'],
  'teams': ['GET'],
  'canned_responses': ['GET'],
  'canned_responses/:id': ['GET'],
  'account': ['GET'],
}

// Sanitization patterns
const DANGEROUS_PATTERNS = [
  /\.\./,           // Directory traversal
  /\/\//,           // Double slashes
  /[<>]/,           // HTML tags
  /javascript:/i,   // JavaScript protocol
  /data:/i,         // Data protocol
  /file:/i,         // File protocol
  /ftp:/i,          // FTP protocol
]

// Schema for path validation
const pathSchema = z.string().min(1).max(500)

export class ChatwootSecurityValidator {
  /**
   * Validates if a path is allowed and returns the cleaned path
   */
  static validateAndCleanPath(rawPath: string[]): { 
    allowed: boolean; 
    cleanedPath?: string; 
    reason?: string;
    method?: string[];
  } {
    if (!rawPath || rawPath.length === 0) {
      return { allowed: false, reason: 'Empty path not allowed' }
    }

    const pathString = rawPath.join('/')
    
    // Basic path validation
    const pathResult = pathSchema.safeParse(pathString)
    if (!pathResult.success) {
      return { allowed: false, reason: 'Invalid path format' }
    }

    // Check for dangerous patterns
    for (const pattern of DANGEROUS_PATTERNS) {
      if (pattern.test(pathString)) {
        return { allowed: false, reason: 'Dangerous pattern detected' }
      }
    }

    // Normalize path (remove trailing slashes, etc.)
    const normalizedPath = pathString.replace(/\/+$/, '').toLowerCase()

    // Check against allowlist with pattern matching
    for (const allowedEndpoint of CHATWOOT_ALLOWED_ENDPOINTS) {
      const pattern = allowedEndpoint
        .replace(':id', '\\d+')
        .replace('*', '[^/]+')
      
      const regex = new RegExp(`^${pattern}$`)
      if (regex.test(normalizedPath)) {
        return { 
          allowed: true, 
          cleanedPath: normalizedPath,
          method: ALLOWED_METHODS[allowedEndpoint] || ['GET']
        }
      }
    }

    return { allowed: false, reason: 'Path not in allowlist' }
  }

  /**
   * Validates HTTP method for the given path
   */
  static validateMethod(path: string, method: string): boolean {
    for (const allowedEndpoint of CHATWOOT_ALLOWED_ENDPOINTS) {
      const pattern = allowedEndpoint
        .replace(':id', '\\d+')
        .replace('*', '[^/]+')
      
      const regex = new RegExp(`^${pattern}$`)
      if (regex.test(path.toLowerCase())) {
        const allowedMethods = ALLOWED_METHODS[allowedEndpoint] || ['GET']
        return allowedMethods.includes(method.toUpperCase())
      }
    }
    return false
  }

  /**
   * Sanitizes query parameters
   */
  static sanitizeQueryParams(searchParams: URLSearchParams): Record<string, string> {
    const sanitized: Record<string, string> = {}
    
    // Allow only specific query parameters
    const allowedParams = [
      'status', 'inbox_id', 'page', 'limit', 
      'assignee_id', 'label_ids', 'sort_by', 
      'order', 'since', 'until'
    ]

    for (const [key, value] of searchParams.entries()) {
      if (allowedParams.includes(key) && value && typeof value === 'string') {
        // Additional sanitization
        const cleanValue = value
          .replace(/[<>]/g, '')
          .replace(/javascript:/gi, '')
          .replace(/data:/gi, '')
          .substring(0, 100) // Limit length
        
        sanitized[key] = cleanValue
      }
    }

    return sanitized
  }

  /**
   * Validates request headers to prevent header injection
   */
  static sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
    const sanitized: Record<string, string> = {}
    const allowedHeaders = [
      'content-type', 'accept', 'user-agent', 'api_access_token'
    ]

    for (const [key, value] of Object.entries(headers)) {
      const lowerKey = key.toLowerCase()
      if (allowedHeaders.includes(lowerKey) && value && typeof value === 'string') {
        // Clean header values
        const cleanValue = value
          .replace(/[\r\n]/g, '') // Remove newlines
          .substring(0, 1000) // Reasonable length limit
        
        sanitized[key] = cleanValue
      }
    }

    return sanitized
  }

  /**
   * Rate limiting for specific paths
   */
  static getPathRateLimit(path: string): number {
    // More restrictive limits for sensitive operations
    if (path.includes('conversations') && path.includes('messages')) {
      return 30 // messages per minute
    }
    return 60 // default requests per minute
  }

  /**
   * Get all allowed endpoints for debugging
   */
  static getAllowedEndpoints(): string[] {
    return [...CHATWOOT_ALLOWED_ENDPOINTS]
  }
}