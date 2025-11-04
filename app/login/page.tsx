import type { Metadata } from "next"

import { LoginForm } from "./login-form"

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Accede a SmarterOS Hub con tu cuenta",
}

export default function LoginPage() {
  return <LoginForm />
}
