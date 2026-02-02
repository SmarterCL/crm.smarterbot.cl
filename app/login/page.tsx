"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const { signIn, signInWithGoogle } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || "/"

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { error } = await signIn(email, password)

      if (error) {
        setError(error.message)
        return
      }

      router.push(redirectTo)
    } catch (err) {
      setError("Ocurrió un error inesperado. Por favor, intenta de nuevo.")
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    setIsGoogleLoading(true)

    try {
      const { error } = await signInWithGoogle()

      if (error) {
        setError(error.message)
        setIsGoogleLoading(false)
      }
      // No need to redirect, OAuth will handle it
    } catch (err) {
      setError("Ocurrió un error al iniciar sesión con Google.")
      console.error("Google login error:", err)
      setIsGoogleLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#0a1525] p-4"
      style={{ backgroundImage: "url('/images/app-login-bg.png')", backgroundSize: "cover" }}
    >
      <Card className="w-full max-w-md bg-[#1e2a3b] border-[#2a3a4b]">
        <CardHeader className="space-y-2 items-center text-center">
          <div className="w-20 h-20 mb-2">
            <Image src="/images/logo.png" alt="SmarterOS Logo" width={80} height={80} priority />
          </div>
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription className="text-gray-400">Ingresa tus credenciales para acceder a SmarterOS</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert className="bg-red-500/20 text-red-400 border-red-500/50">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#0a1525] border-[#2a3a4b]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Contraseña</Label>
                <Link href="/forgot-password" className="text-sm text-blue-400 hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#0a1525] border-[#2a3a4b]"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#2a3a4b]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#1e2a3b] px-2 text-gray-400">O continúa con</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full border-[#2a3a4b] bg-white text-gray-900 hover:bg-gray-100"
              onClick={handleGoogleSignIn}
              disabled={isLoading || isGoogleLoading}
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Conectando con Google...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                  </svg>
                  Google
                </>
              )}
            </Button>

            <div className="text-center text-sm text-gray-400">
              ¿No tienes una cuenta?{" "}
              <Link href="/register" className="text-blue-400 hover:underline">
                Regístrate
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
