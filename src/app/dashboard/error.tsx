"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#070B14] p-8 flex items-center justify-center text-white font-sans w-full">
      <div className="max-w-md w-full bg-white/[0.04] p-8 rounded-[24px] border border-white/10 backdrop-blur-xl text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-red-500/10 rounded-full">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
          <p className="text-neutral-400 text-sm">
            We encountered an unexpected error while loading the dashboard. Our team has been notified.
          </p>
        </div>
        <button
          onClick={reset}
          aria-label="Try again"
          className="w-full px-6 py-3 bg-[#22D3EE]/10 text-[#22D3EE] hover:bg-[#22D3EE]/20 rounded-xl transition-colors font-medium border border-[#22D3EE]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070B14]"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
