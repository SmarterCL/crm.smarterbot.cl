"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

const formSchema = z.object({
  email: z.string().email("Por favor, ingresa un correo electrónico válido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
})

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const { signIn, signInWithGoogle } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || "/"

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(null)
    setIsLoading(true)

    try {
      const { error } = await signIn(values.email, values.password)

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
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0a1525]">
      {/* Left side: Background Image and Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/app-login-bg.png')" }}
      >
        <div className="absolute inset-0 bg-[#0a1525]/60 backdrop-blur-sm" />
        <div className="relative z-10 text-center p-12">
          <Image src="/images/logo.png" alt="SmarterOS Logo" width={160} height={160} className="mx-auto mb-8 animate-pulse" priority />
          <h2 className="text-4xl font-bold text-white mb-4">SmarterOS Hub</h2>
          <p className="text-xl text-gray-300 font-medium">Gestión Inteligente para tu Negocio</p>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 background-animate bg-gradient-to-br from-[#0a1525] via-[#112240] to-[#0a1525]">
        <Card className="w-full max-w-md bg-[#1e2a3b]/50 backdrop-blur-xl border-[#2a3a4b] shadow-2xl">
          <CardHeader className="space-y-1 items-center text-center">
            <div className="lg:hidden w-20 h-20 mb-2">
              <Image src="/images/logo.png" alt="SmarterOS Logo" width={80} height={80} priority />
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Bienvenido
            </CardTitle>
            <CardDescription className="text-gray-400">
              Ingresa tus credenciales para acceder a SmarterOS
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert className="bg-red-500/20 text-red-400 border-red-500/50">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-gray-300">Correo electrónico</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="tu@ejemplo.com"
                          {...field}
                          className="bg-[#0a1525]/50 border-[#2a3a4b] focus:ring-blue-500/50 transition-all h-11"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <div className="flex justify-between items-center">
                        <FormLabel className="text-gray-300">Contraseña</FormLabel>
                        <Link href="/forgot-password" size="sm" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                          ¿Olvidaste tu contraseña?
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="bg-[#0a1525]/50 border-[#2a3a4b] focus:ring-blue-500/50 transition-all h-11"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
              </CardContent>

              <CardFooter className="flex flex-col space-y-4 pt-6">
                <Button type="submit" name="login-button" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 transition-all transform hover:scale-[1.02] active:scale-[0.98]" disabled={isLoading || isGoogleLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </Button>

                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-[#2a3a4b]" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#1e2a3b] px-4 text-gray-500 font-medium">O continúa con</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-[#2a3a4b] bg-white hover:bg-gray-100 text-gray-900 font-medium py-6 transition-all"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading || isGoogleLoading}
                >
                  {isGoogleLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Conectando...
                    </>
                  ) : (
                    <>
                      <svg className="mr-2 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                      </svg>
                      Google
                    </>
                  )}
                </Button>

                <div className="text-center text-sm text-gray-400 pt-2">
                  ¿No tienes una cuenta?{" "}
                  <Link href="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                    Regístrate
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  )
}
