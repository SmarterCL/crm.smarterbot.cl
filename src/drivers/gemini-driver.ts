// @ts-ignore - TypeScript types not available yet
import { GoogleGenerativeAI } from '@google/generative-ai';
// @ts-ignore - MCP server no funcional durante build
// import SmarterBOTMCPServer from '../mcp/server.js';

// Mock temporal para build
class MockMCPServer {
  specLoader = {
    loadTool: async (name: string) => ({ name, handler: name }),
    validateToolForRole: async () => true
  };
}

// Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBmydkpeBixCCK9HTtVxRk_vEIYIPwZlGw';
const MODEL_NAME = 'gemini-1.5-flash'; // Balance velocidad/precisión

interface GeminiRequest {
  prompt: string;
  context?: {
    tenant_id?: string;
    user_id?: string;
    role?: string;
    conversation_id?: string;
  };
  tools?: string[]; // Tools específicas a usar
}

interface GeminiResponse {
  text: string;
  tool_calls?: Array<{
    tool_name: string;
    parameters: any;
  }>;
  metadata: {
    model: string;
    usage?: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
    timestamp: string;
    processing_time_ms?: number;
    intent_confidence?: number;
    error?: string;
  };
}

export class GeminiDriver {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private mcpServer: MockMCPServer;

  constructor() {
    this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: MODEL_NAME });
    this.mcpServer = new MockMCPServer();
  }

  /**
   * Convierte intención natural a llamada de tool MCP
   */
  private async detectIntent(prompt: string, context?: any): Promise<{
    intent: string;
    tool_name?: string;
    parameters?: any;
    confidence: number;
  }> {
    const systemPrompt = `
Eres el intérprete de intención de SmarterBOT CRM.

Analiza el siguiente mensaje del usuario y determina:
1. La intención principal
2. Qué tool MCP debe ejecutarse (si aplica)
3. Los parámetros necesarios

Tools MCP disponibles:
- crm.create_lead: Crear nuevo lead
- crm.get_customer: Obtener información de cliente  
- chat.send_message: Enviar mensaje
- payments.create_intent: Crear pago

Responde SOLO en formato JSON:
{
  "intent": "descripción corta de la intención",
  "tool_name": "nombre de la tool o null",
  "parameters": {objeto de parámetros o null},
  "confidence": 0.9
}

Contexto del usuario: ${JSON.stringify(context || {})}
`;

    try {
      const result = await this.model.generateContent({
        contents: [{
          parts: [{ text: `${systemPrompt}\n\nMensaje del usuario: "${prompt}"` }]
        }]
      });

      const response = await result.response.text();
      return JSON.parse(response);
    } catch (error) {
      console.error('❌ Error detecting intent:', error);
      return {
        intent: 'error_detecting_intent',
        confidence: 0
      };
    }
  }

  /**
   * Ejecuta tool MCP con validación
   */
  private async executeTool(toolName: string, parameters: any, context?: any): Promise<any> {
    try {
      console.log(`🔧 Executing tool: ${toolName}`, parameters);

      // Validar que la tool exista y esté permitida
      const tool = await (this.mcpServer as any).specLoader.loadTool(toolName);
      if (!tool) {
        throw new Error(`Tool ${toolName} no encontrada en MCP`);
      }

      // Validar permisos si hay rol
      if (context?.role) {
        const isAllowed = await (this.mcpServer as any).specLoader.validateToolForRole(
          toolName, 
          context.role
        );
        if (!isAllowed) {
          throw new Error(`Tool ${toolName} no permitida para rol ${context.role}`);
        }
      }

      // Ejecutar tool a través del MCP server
      // TODO: Implementar método handleToolCall en MCP server
      const result = { success: true, data: `Tool ${toolName} executed` };
      
      return {
        success: true,
        data: result,
        tool: toolName
      };

    } catch (error) {
      console.error(`❌ Error executing tool ${toolName}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
        tool: toolName
      };
    }
  }

  /**
   * Genera respuesta natural basada en resultados de tools
   */
  private async generateResponse(
    originalPrompt: string,
    toolResults: any[],
    context?: any
  ): Promise<string> {
    const systemPrompt = `
Eres SmarterBOT, un asistente de CRM profesional.

Analiza los resultados de las acciones ejecutadas y genera una respuesta amigable y útil para el usuario.

Reglas:
- Sé conversacional pero profesional
- Resume resultados importantes
- Si hay errores, explica qué pasó y sugiere soluciones
- Adapta el tono al rol del usuario (${context?.role || 'usuario'})

Resultados de las acciones:
${JSON.stringify(toolResults, null, 2)}

Prompt original del usuario: "${originalPrompt}"
`;

    try {
      const result = await this.model.generateContent({
        contents: [{
          parts: [{ text: systemPrompt }]
        }]
      });

      return result.response.text();
    } catch (error) {
      console.error('❌ Error generating response:', error);
      return 'Lo siento, tuve problemas procesando tu solicitud. Por favor intenta de nuevo.';
    }
  }

  /**
   * Procesa una solicitud completa del usuario
   */
  async process(request: GeminiRequest): Promise<GeminiResponse> {
    const startTime = Date.now();

    try {
      console.log(`🚀 Processing request:`, { prompt: request.prompt, context: request.context });

      // 1. Detectar intención
      const intent = await this.detectIntent(request.prompt, request.context);
      console.log(`🎯 Intent detected:`, intent);

      let toolResults: any[] = [];

      // 2. Ejecutar tool si aplica
      if (intent.tool_name && intent.confidence > 0.7) {
        const toolResult = await this.executeTool(
          intent.tool_name,
          intent.parameters || {},
          request.context
        );
        toolResults.push(toolResult);
      }

      // 3. Generar respuesta
      let responseText: string;
      
      if (toolResults.length > 0) {
        responseText = await this.generateResponse(request.prompt, toolResults, request.context);
      } else {
        // Respuesta directa sin ejecutar tools
        const result = await this.model.generateContent({
          contents: [{
            parts: [{ text: request.prompt }]
          }]
        });
        responseText = result.response.text();
      }

      // 4. Formatear respuesta
      return {
        text: responseText,
        tool_calls: intent.tool_name ? [{
          tool_name: intent.tool_name,
          parameters: intent.parameters
        }] : undefined,
        metadata: {
          model: MODEL_NAME,
          usage: {
            // TODO: Obtener usage real de Gemini
            prompt_tokens: 100,
            completion_tokens: 50,
            total_tokens: 150
          },
          timestamp: new Date().toISOString(),
          processing_time_ms: Date.now() - startTime,
          intent_confidence: intent.confidence
        }
      };

    } catch (error) {
      console.error('❌ Error in GeminiDriver.process:', error);
      
      return {
        text: 'Disculpa, tuve un error procesando tu solicitud. Por favor intenta de nuevo.',
        metadata: {
          model: MODEL_NAME,
          timestamp: new Date().toISOString(),
          processing_time_ms: Date.now() - startTime,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  /**
   * Método para streaming responses (opcional)
   */
  async *processStream(request: GeminiRequest): AsyncGenerator<string> {
    try {
      const response = await this.process(request);
      const words = response.text.split(' ');
      
      for (const word of words) {
        yield word + ' ';
        await new Promise(resolve => setTimeout(resolve, 50)); // Simular delay
      }
      
    } catch (error) {
      yield 'Error procesando solicitud...';
    }
  }

  /**
   * Health check del driver
   */
  async healthCheck(): Promise<{ status: string; model: string; mcp_connected: boolean; error?: string }> {
    try {
      // Test básico de Gemini
      const result = await this.model.generateContent({ contents: [{ parts: [{ text: 'test' }] }] });
      
      return {
        status: 'healthy',
        model: MODEL_NAME,
        mcp_connected: true // TODO: Verificar conexión real con MCP
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        model: MODEL_NAME,
        mcp_connected: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Exportar instancia singleton
export const geminiDriver = new GeminiDriver();

// Exportar para testing
export default GeminiDriver;