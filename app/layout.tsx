import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"

import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

export const metadata: Metadata = {
  title: {
    default: "SmarterOS Hub",
    template: "%s | SmarterOS Hub",
  },
  description: "Dashboard inteligente para SmarterOS",
  generator: "v0.dev",
  metadataBase: new URL(appUrl),
}

export const viewport: Viewport = {
  themeColor: "#0a1525",
  colorScheme: "dark",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning className={inter.variable}>
      <body className="bg-[#0a1525] text-white antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
