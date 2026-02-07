"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { createClientSupabaseClient } from "@/lib/supabase-client"

const formSchema = z.object({
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  confirmPassword: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [supabase, setSupabase] = useState<ReturnType<typeof createClientSupabaseClient>>(null)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    try {
      if (!supabase) {
        setError("Error de inicialización. Por favor, recarga la página.")
        return
      }

      const { error } = await supabase.auth.updateUser({ password: values.password })

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
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0a1525]">
      {/* Left side: Background Image and Branding (Hidden on mobile) */}
      <div
        className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/app-login-bg.png')" }}
      >
        <div className="absolute inset-0 bg-[#0a1525]/60 backdrop-blur-sm" />
        <div className="relative z-10 text-center p-12">
          <Image src="/images/logo.png" alt="SmarterOS Logo" width={160} height={160} className="mx-auto mb-8 animate-pulse" priority />
          <h2 className="text-4xl font-bold text-white mb-4">Nueva Contraseña</h2>
          <p className="text-xl text-gray-300">Actualiza tus credenciales para continuar</p>
        </div>
      </div>

      {/* Right side: Reset Password Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 background-animate bg-gradient-to-br from-[#0a1525] via-[#112240] to-[#0a1525]">
        <Card className="w-full max-w-md bg-[#1e2a3b]/50 backdrop-blur-xl border-[#2a3a4b] shadow-2xl">
          <CardHeader className="space-y-2 items-center text-center">
            <div className="lg:hidden w-20 h-20 mb-2">
              <Image src="/images/logo.png" alt="SmarterOS Logo" width={80} height={80} priority />
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Restablecer Contraseña
            </CardTitle>
            <CardDescription className="text-gray-400">Ingresa tu nueva contraseña para SmarterOS</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-300 text-base">Nueva contraseña</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="bg-[#0a1525]/50 border-[#2a3a4b] focus:ring-blue-500/50 transition-all text-white h-12"
                          disabled={!!success || isLoading}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-300 text-base">Confirmar nueva contraseña</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="bg-[#0a1525]/50 border-[#2a3a4b] focus:ring-blue-500/50 transition-all text-white h-12"
                          disabled={!!success || isLoading}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-sm" />
                    </FormItem>
                  )}
                />
              </CardContent>

              <CardFooter className="flex flex-col space-y-4 pt-6">
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  disabled={isLoading || !!success || (!!error && !form.getValues("password"))}
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
          </Form>
        </Card>
      </div>
    </div>
  )
}
