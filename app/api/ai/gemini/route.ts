import { NextRequest, NextResponse } from 'next/server';
import { geminiDriver } from '../../../../src/drivers/gemini-driver';
import { validateInternalToken, checkRateLimit } from '../../../../src/lib/security';
import { z } from 'zod';

// Schema para validación de requests
const GeminiRequestSchema = z.object({
  prompt: z.string().min(1, 'El prompt es requerido').max(2000, 'Prompt demasiado largo'),
  context: z.object({
    tenant_id: z.string().optional(),
    user_id: z.string().optional(), 
    role: z.enum(['sales_assistant', 'support_agent', 'admin_bot']).optional(),
    conversation_id: z.string().optional()
  }).optional(),
  stream: z.boolean().default(false),
  tools: z.array(z.string()).optional()
});

export type GeminiRequest = z.infer<typeof GeminiRequestSchema>;

// Rate limiting para API de IA
const GEMINI_RATE_LIMIT = 20; // requests por minuto

export async function POST(request: NextRequest) {
  try {
    // 1. Extraer IP para rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0]?.trim() || realIp?.trim() || 'unknown';
    
    // 2. Rate limiting
    const rateLimit = checkRateLimit(`gemini:${ip}`, GEMINI_RATE_LIMIT);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded', 
          message: 'Too many requests to AI API',
          retry_after: Math.ceil((rateLimit.resetTime! - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.resetTime! - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': GEMINI_RATE_LIMIT.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetTime!.toString(),
          }
        }
      );
    }

    // 3. Validar body
    const body = await request.json();
    const validation = GeminiRequestSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request format',
          details: validation.error.issues
        },
        { status: 400 }
      );
    }

    const geminiRequest = validation.data;

    // 4. Validar autenticación si se requieren tools específicas
    if (geminiRequest.tools && geminiRequest.tools.length > 0) {
      const authHeader = request.headers.get('authorization');
      const token = authHeader?.replace('Bearer ', '');
      
      if (!validateInternalToken(token || '')) {
        return NextResponse.json(
          { 
            error: 'Authentication required for tool execution',
            message: 'Valid token required to execute tools'
          },
          { status: 401 }
        );
      }
    }

    // 5. Procesar request con Gemini
    console.log(`🤖 Processing Gemini request:`, {
      prompt: geminiRequest.prompt.substring(0, 100) + '...',
      context: geminiRequest.context,
      hasTools: !!geminiRequest.tools?.length
    });

    const startTime = Date.now();
    
    let response;
    if (geminiRequest.stream) {
      // Streaming response (implementación futura)
      response = await geminiDriver.processStream(geminiRequest);
      
      // Por ahora retornamos respuesta normal
      let fullResponse = '';
      for await (const chunk of response) {
        fullResponse += chunk;
      }
      
      response = {
        text: fullResponse,
        streaming: true
      };
    } else {
      response = await geminiDriver.process(geminiRequest);
    }

    const processingTime = Date.now() - startTime;

    // 6. Formatear response
    const responseData = {
      success: true,
      data: {
        text: response.text,
        tool_calls: response.tool_calls,
        metadata: {
          ...response.metadata,
          processing_time_ms: processingTime
        }
      },
      rate_limit: {
        remaining: rateLimit.remaining,
        limit: GEMINI_RATE_LIMIT,
        reset_time: rateLimit.resetTime
      },
      timestamp: new Date().toISOString()
    };

    console.log(`✅ Gemini response completed in ${processingTime}ms`);

    return NextResponse.json(responseData, {
      headers: {
        'X-RateLimit-Limit': GEMINI_RATE_LIMIT.toString(),
        'X-RateLimit-Remaining': rateLimit.remaining!.toString(),
        'X-RateLimit-Reset': rateLimit.resetTime!.toString(),
        'X-Processing-Time': processingTime.toString(),
        'X-Content-Type-Options': 'nosniff'
      }
    });

  } catch (error) {
    console.error('❌ Error in Gemini API:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: 'Failed to process AI request',
        timestamp: new Date().toISOString()
      },
      { 
        status: 500,
        headers: {
          'X-Content-Type-Options': 'nosniff'
        }
      }
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    const health = await geminiDriver.healthCheck();
    
    return NextResponse.json({
      service_status: 'healthy',
      service: 'gemini-api',
      ...health,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        service: 'gemini-api', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    );
  }
}

// CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Allow': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    }
  });
}