import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1525] text-white">
      <div className="flex items-center gap-3 text-lg font-medium" role="status" aria-live="polite">
        <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
        Cargando SmarterOS Hub...
      </div>
    </div>
  )
}
