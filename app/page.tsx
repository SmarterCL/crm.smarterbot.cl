import Image from "next/image"
import Link from "next/link"
import {
  Bell,
  MessageSquare,
  Plus,
  Search,
  BarChart3,
  Users,
  Calendar,
  Settings,
  Home,
  ArrowRight,
  Database,
  PanelLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { UserProfileMenu } from "@/components/UserProfileMenu"

export default function Dashboard() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
        <Sidebar className="border-r border-gray-200 dark:border-gray-700 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
          <SidebarHeader className="flex items-center justify-center p-4">
            <div className="flex flex-col items-center">
              <Image
                src="/images/logo.png"
                alt="SmarterOS Logo"
                width={80}
                height={80}
                className="mb-2 img-optimized animate-hover-grow"
                priority
                unoptimized={true}
              />
              <h1 className="text-xl font-bold text-gradient">SmarterOS</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Dashboard" asChild isActive className="animate-hover-grow">
                  <Link href="/" className="flex items-center gap-3">
                    <Home className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Estadísticas" asChild className="animate-hover-grow">
                  <Link href="/estadisticas" className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5" />
                    <span>Estadísticas</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Clientes" asChild className="animate-hover-grow">
                  <Link href="/clientes" className="flex items-center gap-3">
                    <Users className="h-5 w-5" />
                    <span>Clientes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Calendario" asChild className="animate-hover-grow">
                  <Link href="/calendario" className="flex items-center gap-3">
                    <Calendar className="h-5 w-5" />
                    <span>Calendario</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Configuración" asChild className="animate-hover-grow">
                  <Link href="/configuracion" className="flex items-center gap-3">
                    <Settings className="h-5 w-5" />
                    <span>Configuración</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 animate-hover-grow border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"
              asChild
            >
              <Link href="/chat" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Iniciar chat</span>
              </Link>
            </Button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <div className="flex h-16 items-center justify-between px-4 md:px-6 py-2 md:py-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden text-gray-700 dark:text-gray-300" />
                <h1 className="text-lg md:text-xl font-bold text-gradient">Dashboard</h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative hidden md:block">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Buscar..."
                    className="w-64 rounded-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 pl-8 md:w-80 text-gray-900 dark:text-white"
                  />
                </div>
                <Button variant="outline" size="icon" className="relative border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    3
                  </span>
                </Button>
                <UserProfileMenu />
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tarjeta de bienvenida mejorada */}
              <Card className="col-span-1 md:col-span-2 card-enhanced animate-hover-grow bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 border-0">
                <CardHeader>
                  <CardTitle className="text-2xl text-gradient">¡Bienvenido a SmarterOS Hub!</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Tu asistente inteligente está listo para ayudarte
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 text-lg">
                    SmarterBOT ya puede ayudarte con tus tareas diarias, responder mensajes y automatizar procesos desde un solo lugar.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button className="btn-primary">Comenzar ahora</Button>
                    <Button variant="outline" className="border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400">
                      Ver tutorial
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Tarjeta de WhatsApp mejorada */}
              <Card className="card-enhanced animate-hover-grow bg-white dark:bg-gray-800">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg text-gradient">Mensajes de WhatsApp</CardTitle>
                    <Badge className="bg-green-500">Conectado</Badge>
                  </div>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Últimos mensajes recibidos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Cliente #1</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Hace 5 min</span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">"Hola, ¿podemos agendar una reunión para mañana?"</p>
                      <div className="flex justify-end mt-3">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Responder
                        </Button>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Cliente #2</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Hace 30 min</span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                        "Necesito información sobre los precios del servicio"
                      </p>
                      <div className="flex justify-end mt-3">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Responder
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400" asChild>
                    <Link href="/chat">Ver todos los mensajes</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Tarjeta de Estadísticas mejorada */}
              <Card className="card-enhanced animate-hover-grow bg-white dark:bg-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-gradient">Estadísticas</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Resumen de actividad</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Mensajes respondidos</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">24</p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <MessageSquare className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Tareas automatizadas</p>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">12</p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Settings className="h-6 w-6 text-purple-500 dark:text-purple-400" />
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Horas ahorradas</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">3.5</p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <BarChart3 className="h-6 w-6 text-green-500 dark:text-green-400" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400" asChild>
                    <Link href="/estadisticas">Ver reporte completo</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Tarjeta de Acciones Rápidas mejorada */}
              <Card className="col-span-1 md:col-span-2 card-enhanced animate-hover-grow bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg text-gradient">Acciones Rápidas</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Selecciona una acción para comenzar</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <Button
                      variant="outline"
                      className="h-auto py-8 flex flex-col items-center bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 hover:border-blue-500/50 transition-all group"
                      asChild
                    >
                      <Link href="/chat" className="flex flex-col items-center gap-2">
                        <MessageSquare className="h-8 w-8 mb-1 text-blue-400 group-hover:scale-110 transition-all" />
                        <span className="text-gray-300 group-hover:text-white transition-colors">Responder mensajes</span>
                      </Link>
                    </Button>

                    <Button variant="outline" className="h-auto py-8 flex flex-col items-center bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 hover:border-purple-500/50 transition-all group">
                      <Plus className="h-8 w-8 mb-2 text-purple-400 group-hover:scale-110 transition-all" />
                      <span className="text-gray-300 group-hover:text-white transition-colors">Crear tarea</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-auto py-8 flex flex-col items-center bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 hover:border-green-500/50 transition-all group"
                      asChild
                    >
                      <Link href="/calendario" className="flex flex-col items-center gap-2">
                        <Calendar className="h-8 w-8 mb-1 text-green-400 group-hover:scale-110 transition-all" />
                        <span className="text-gray-300 group-hover:text-white transition-colors">Agendar reunión</span>
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto py-8 flex flex-col items-center bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 hover:border-blue-500/50 transition-all group"
                      asChild
                    >
                      <Link href="/estadisticas" className="flex flex-col items-center gap-2">
                        <BarChart3 className="h-8 w-8 mb-1 text-blue-400 group-hover:scale-110 transition-all" />
                        <span className="text-gray-300 group-hover:text-white transition-colors">Ver estadísticas</span>
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto py-8 flex flex-col items-center bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 hover:border-orange-500/50 transition-all group"
                      asChild
                    >
                      <Link href="/seed-database" className="flex flex-col items-center gap-2">
                        <Database className="h-8 w-8 mb-1 text-orange-400 group-hover:scale-110 transition-all" />
                        <span className="text-gray-300 group-hover:text-white transition-colors">Poblar Base de Datos</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Tarjeta de Planes mejorada */}
              <Card className="col-span-1 md:col-span-2 card-enhanced animate-hover-grow bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg text-gradient">Planes disponibles</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Mejora tu experiencia con SmarterOS</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 border border-blue-200 dark:border-gray-700 animate-hover-grow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-gradient">Plan Básico</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">Para comenzar</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                          $19<span className="text-lg font-normal text-gray-600 dark:text-gray-400">/mes</span>
                        </p>
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">Respuestas automáticas</span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">1 canal de WhatsApp</span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">Soporte básico</span>
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full btn-secondary">Ver detalles</Button>
                      </CardFooter>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-800 dark:to-gray-900 border-2 border-purple-500 dark:border-purple-400 relative animate-hover-grow transform -translate-y-2 shadow-lg">
                      <div className="absolute -top-3 right-4 bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-1 rounded-full text-xs font-bold text-white shadow-md">
                        ¡Popular!
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-gradient">Plan Pro</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">Para negocios</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-4">
                          $49<span className="text-lg font-normal text-gray-600 dark:text-gray-400">/mes</span>
                        </p>
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 mr-2 text-purple-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">Todo lo del plan Básico</span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 mr-2 text-purple-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">3 canales de WhatsApp</span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 mr-2 text-purple-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">Automatizaciones avanzadas</span>
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">Ver detalles</Button>
                      </CardFooter>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-900 border border-green-200 dark:border-gray-700 animate-hover-grow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-gradient">Plan Enterprise</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">Para grandes empresas</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
                          $99<span className="text-lg font-normal text-gray-600 dark:text-gray-400">/mes</span>
                        </p>
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">Todo lo del plan Pro</span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">Canales ilimitados</span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">API personalizada</span>
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full btn-secondary">Ver detalles</Button>
                      </CardFooter>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
