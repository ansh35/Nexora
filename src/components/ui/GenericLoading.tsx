import { Loader2 } from "lucide-react"

export function GenericLoading() {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
      <div className="w-16 h-16 rounded-full bg-white/[0.04] flex items-center justify-center mb-4 border border-white/10 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
        <Loader2 className="w-8 h-8 text-[#22D3EE] animate-spin" />
      </div>
      <p className="text-neutral-400 font-medium">Loading content...</p>
    </div>
  )
}
