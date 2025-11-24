"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bell,
  MessageSquare,
  Search,
  BarChart3,
  Users,
  Calendar,
  Settings,
  Home,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { UserProfile } from "@/components/user-profile"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(path)
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#0a1525] text-white">
        <Sidebar className="border-r border-[#1e2a3b]">
          <SidebarHeader className="flex items-center justify-center p-4">
            <div className="flex flex-col items-center">
              <Image src="/images/logo.png" alt="SmarterOS Logo" width={80} height={80} className="mb-2" priority />
              <h1 className="text-xl font-bold">SmarterOS</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Dashboard" asChild isActive={isActive("/")}>
                  <Link href="/">
                    <Home className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Estadísticas" asChild isActive={isActive("/estadisticas")}>
                  <Link href="/estadisticas">
                    <BarChart3 className="h-5 w-5" />
                    <span>Estadísticas</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Clientes" asChild isActive={isActive("/clientes")}>
                  <Link href="/clientes">
                    <Users className="h-5 w-5" />
                    <span>Clientes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Calendario" asChild isActive={isActive("/calendario")}>
                  <Link href="/calendario">
                    <Calendar className="h-5 w-5" />
                    <span>Calendario</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Configuración" asChild isActive={isActive("/configuracion")}>
                  <Link href="/configuracion">
                    <Settings className="h-5 w-5" />
                    <span>Configuración</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2" asChild>
              <Link href="/chat">
                <MessageSquare className="h-4 w-4" />
                <span>Iniciar chat</span>
              </Link>
            </Button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 border-b border-[#1e2a3b] bg-[#0a1525]/95 backdrop-blur">
            <div className="flex h-16 items-center justify-between px-6 py-4">
              <h1 className="text-xl font-bold">
                {pathname === "/" && "Dashboard"}
                {pathname.startsWith("/estadisticas") && "Estadísticas"}
                {pathname.startsWith("/clientes") && "Clientes"}
                {pathname.startsWith("/calendario") && "Calendario"}
                {pathname.startsWith("/configuracion") && "Configuración"}
                {pathname.startsWith("/chat") && "Chat"}
              </h1>
              <div className="flex items-center gap-4">
                <div className="relative hidden md:block">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Buscar..."
                    className="w-64 rounded-full bg-[#1e2a3b] border-[#1e2a3b] pl-8 md:w-80 text-white"
                  />
                </div>
                <Button variant="outline" size="icon" className="relative border-[#1e2a3b] bg-[#1e2a3b]">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">
                    3
                  </span>
                </Button>
                <UserProfile />
              </div>
            </div>
          </header>

          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
