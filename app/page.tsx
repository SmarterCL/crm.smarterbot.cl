import { Users, Building2, DollarSign, TrendingUp } from 'lucide-react'

export default function CRM() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">SmarterCRM</h1>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <Users className="w-8 h-8 text-blue-600 mb-2" />
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-gray-600">Contactos</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <Building2 className="w-8 h-8 text-green-600 mb-2" />
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-gray-600">Empresas</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <DollarSign className="w-8 h-8 text-emerald-600 mb-2" />
            <div className="text-2xl font-bold">$0</div>
            <div className="text-sm text-gray-600">Ventas</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <TrendingUp className="w-8 h-8 text-amber-600 mb-2" />
            <div className="text-2xl font-bold">0%</div>
            <div className="text-sm text-gray-600">Conversión</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">CRM SmarterOS v0.9 Beta</h2>
          <p className="text-gray-600">
            Sistema de gestión de relaciones con clientes integrado con Odoo ERP.
          </p>
          <div className="mt-4 p-4 bg-emerald-50 rounded-lg">
            <p className="text-sm text-emerald-800">
              ✅ Conectado a Odoo Backend<br />
              ✅ SSO Clerk Activo<br />
              ✅ Supabase Sync Ready
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
