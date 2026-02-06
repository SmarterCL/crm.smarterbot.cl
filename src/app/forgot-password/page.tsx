"use client"

import { useState } from "react"
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
import { Loader2, ArrowLeft } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

const formSchema = z.object({
  email: z.string().email("Por favor, ingresa un correo electrónico válido"),
})

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { resetPassword } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    try {
      const { error } = await resetPassword(values.email)

      if (error) {
        setError(error.message)
        return
      }

      setSuccess("Te hemos enviado un enlace para restablecer tu contraseña. Por favor, revisa tu correo electrónico.")
    } catch (err) {
      setError("Ocurrió un error inesperado. Por favor, intenta de nuevo.")
      console.error("Password reset error:", err)
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
          <h2 className="text-4xl font-bold text-white mb-4">Recupera tu Acceso</h2>
          <p className="text-xl text-gray-300">SmarterOS Hub - Gestión Inteligente</p>
        </div>
      </div>

      {/* Right side: Forgot Password Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 background-animate bg-gradient-to-br from-[#0a1525] via-[#112240] to-[#0a1525]">
        <Card className="w-full max-w-md bg-[#1e2a3b]/50 backdrop-blur-xl border-[#2a3a4b] shadow-2xl">
          <CardHeader className="space-y-2 items-center text-center">
            <div className="lg:hidden w-20 h-20 mb-2">
              <Image src="/images/logo.png" alt="SmarterOS Logo" width={80} height={80} priority />
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Recuperar Contraseña
            </CardTitle>
            <CardDescription className="text-gray-400">
              Ingresa tu correo electrónico para recibir un enlace de recuperación
            </CardDescription>
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
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-300 text-base">Correo electrónico</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="tu@ejemplo.com"
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
                  disabled={isLoading || !!success}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar Enlace de Recuperación"
                  )}
                </Button>

                <Button variant="ghost" className="w-full text-gray-400 hover:text-white hover:bg-[#2a3a4b]/50 transition-all py-6 h-auto" asChild>
                  <Link href="/login" className="flex items-center justify-center">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver a Iniciar Sesión
                  </Link>
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  )
}
