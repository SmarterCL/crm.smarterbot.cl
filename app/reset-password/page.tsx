"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { createClientSupabaseClient } from "@/lib/supabase"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [supabase, setSupabase] = useState<ReturnType<typeof createClientSupabaseClient>>(null)
  const router = useRouter()

  useEffect(() => {
    // Inicializar supabase solo en el cliente
    const client = createClientSupabaseClient()
    setSupabase(client)

    // Verificar si hay un hash en la URL (necesario para el flujo de restablecimiento de contraseña)
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    if (!hashParams.get("access_token")) {
      setError("Enlace de restablecimiento de contraseña inválido o expirado.")
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    try {
      if (!supabase) {
        setError("Error de inicialización. Por favor, recarga la página.")
        return
      }

      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        setError(error.message)
        return
      }

      setSuccess("Tu contraseña ha sido actualizada correctamente. Serás redirigido al inicio de sesión.")

      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (err) {
      setError("Ocurrió un error inesperado. Por favor, intenta de nuevo.")
      console.error("Password update error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-[#0a1525] p-4">
      {/* Background with overlay and blur */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/app-login-bg.png')" }}
      />
      <div className="absolute inset-0 bg-[#0a1525]/70 backdrop-blur-sm" />

      <Card className="w-full max-w-md bg-[#1e2a3b]/50 backdrop-blur-xl border-[#2a3a4b] shadow-2xl relative z-10">
        <CardHeader className="space-y-2 items-center text-center">
          <div className="w-20 h-20 mb-2">
            <Image src="/images/logo.png" alt="SmarterOS Logo" width={80} height={80} priority />
          </div>
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Restablecer Contraseña
          </CardTitle>
          <CardDescription className="text-gray-400">Ingresa tu nueva contraseña</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <Alert className="bg-red-500/20 text-red-400 border-red-500/50">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-500/20 text-green-400 border-green-500/50">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" name="password-label" className="text-gray-300">Nueva contraseña</Label>
              <Input
                id="password"
                name="password-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#0a1525]/50 border-[#2a3a4b] focus:ring-blue-500/50 transition-all text-white"
                disabled={!!success}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" name="confirm-password-label" className="text-gray-300">Confirmar nueva contraseña</Label>
              <Input
                id="confirmPassword"
                name="confirm-password-input"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-[#0a1525]/50 border-[#2a3a4b] focus:ring-blue-500/50 transition-all text-white"
                disabled={!!success}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-6">
            <Button
              type="submit"
              name="reset-password-button"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoading || !!success || (!!error && !password)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                "Actualizar Contraseña"
              )}
            </Button>

            <div className="text-center text-sm text-gray-400 pt-4">
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                Volver a Iniciar Sesión
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
