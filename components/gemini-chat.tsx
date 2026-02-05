"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, MessageCircle, Zap, AlertCircle } from 'lucide-react'

interface GeminiResponse {
  success: boolean
  data?: {
    text: string
    tool_calls?: Array<{
      tool_name: string
      parameters: any
    }>
    metadata: {
      model: string
      timestamp: string
      processing_time_ms: number
    }
  }
  error?: string
  message?: string
}

interface HealthResponse {
  service_status: string
  model: string
  mcp_connected: boolean
}

export function GeminiChat() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState<GeminiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [checkingHealth, setCheckingHealth] = useState(false)

  const checkHealth = async () => {
    setCheckingHealth(true)
    try {
      const res = await fetch('/api/ai/gemini', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await res.json()
      setHealth(data)
    } catch (error) {
      console.error('Health check failed:', error)
      setHealth({
        service_status: 'unhealthy',
        model: 'unknown',
        mcp_connected: false
      })
    } finally {
      setCheckingHealth(false)
    }
  }

  const sendMessage = async () => {
    if (!prompt.trim()) return

    setLoading(true)
    setResponse(null)

    try {
      const res = await fetch('/api/ai/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          context: {
            role: 'sales_assistant', // Simular rol
            tenant_id: 'demo-tenant'
          },
          tools: ['crm.create_lead', 'crm.get_customer'] // Habilitar tools
        })
      })

      const data = await res.json()
      setResponse(data)

      if (!res.ok) {
        console.error('API Error:', data)
      }

    } catch (error) {
      console.error('Request failed:', error)
      setResponse({
        success: false,
        error: 'Error de conexión con el servidor'
      })
    } finally {
      setLoading(false)
    }
  }

  // Health check al montar
  useState(() => {
    checkHealth()
  })

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Zap className="h-8 w-8 text-yellow-500" />
          SmarterBOT AI Demo
        </h1>
        <p className="text-muted-foreground">
          Integración Gemini + MCP Server + Antigravity Engine
        </p>

        {/* Health Status */}
        <div className="flex justify-center">
          <Card className="w-auto">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={checkHealth}
                  disabled={checkingHealth}
                >
                  {checkingHealth ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Check Health'
                  )}
                </Button>
                
                {health && (
                  <div className="flex items-center gap-2">
                    <Badge variant={health.service_status === 'healthy' ? 'default' : 'destructive'}>
                      {health.service_status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {health.model}
                    </span>
                    <Badge variant={health.mcp_connected ? 'default' : 'secondary'}>
                      MCP: {health.mcp_connected ? 'Connected' : 'Disconnected'}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Chat con IA
            </CardTitle>
            <CardDescription>
              Envía mensajes a SmarterBOT con acceso a tools CRM
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Ej: 'Crea un nuevo lead para Juan Pérez con email juan@ejemplo.cl'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] resize-none"
              disabled={loading}
            />
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {prompt.length}/2000 caracteres
              </div>
              
              <Button 
                onClick={sendMessage} 
                disabled={loading || !prompt.trim()}
                className="min-w-[100px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Response */}
        <Card>
          <CardHeader>
            <CardTitle>Respuesta</CardTitle>
            <CardDescription>
              Resultado del procesamiento + metadata
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Procesando...</span>
              </div>
            )}

            {!loading && !response && (
              <div className="text-center py-8 text-muted-foreground">
                Envía un mensaje para ver la respuesta
              </div>
            )}

            {!loading && response && (
              <div className="space-y-4">
                {/* Status */}
                <div className="flex items-center gap-2">
                  <Badge variant={response.success ? 'default' : 'destructive'}>
                    {response.success ? 'Success' : 'Error'}
                  </Badge>
                  {response.data?.metadata && (
                    <span className="text-xs text-muted-foreground">
                      {response.data.metadata.processing_time_ms}ms
                    </span>
                  )}
                </div>

                {/* Text Response */}
                {response.data?.text && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">
                      {response.data.text}
                    </p>
                  </div>
                )}

                {/* Tool Calls */}
                {response.data?.tool_calls && response.data.tool_calls.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Tools Ejecutadas:</h4>
                    <div className="space-y-2">
                      {response.data.tool_calls.map((call, index) => (
                        <div key={index} className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded border">
                          <div className="font-mono text-sm text-blue-700 dark:text-blue-300">
                            {call.tool_name}
                          </div>
                          <pre className="text-xs mt-1 text-muted-foreground overflow-x-auto">
                            {JSON.stringify(call.parameters, null, 2)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Error */}
                {response.error && (
                  <div className="flex items-start gap-2 text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4 mt-0.5" />
                    <div>
                      <div className="font-semibold">Error</div>
                      <div className="text-sm">{response.error}</div>
                    </div>
                  </div>
                )}

                {/* Metadata */}
                {response.data?.metadata && (
                  <details className="text-xs">
                    <summary className="cursor-pointer font-mono">Metadata</summary>
                    <pre className="mt-2 bg-muted/30 p-2 rounded overflow-x-auto">
                      {JSON.stringify(response.data.metadata, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Ejemplos de prompts para testear la integración
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              'Crea un lead para María González con email maria@empresa.cl',
              'Busca información del cliente con email test@demo.cl',
              'Envía un mensaje de seguimiento al último lead creado',
              '¿Cuántos leads nuevos tenemos esta semana?'
            ].map((example, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setPrompt(example)}
                disabled={loading}
                className="text-left justify-start h-auto p-3"
              >
                {example}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}