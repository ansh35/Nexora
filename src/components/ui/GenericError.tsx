"use client"

import { useEffect } from "react"
import { AlertCircle, RefreshCw } from "lucide-react"

export function GenericError({
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
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="bg-white/[0.05] border border-white/10 hover:border-white/20 hover:bg-white/[0.06] shadow-[0_0_40px_rgba(34,211,238,0.12)] p-8 rounded-[24px] backdrop-blur-xl text-center max-w-md w-full shadow-[0_0_40px_rgba(239,68,68,0.1)]">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
        <p className="text-neutral-400 text-sm mb-8">
          We encountered an error while loading this page. Please try again.
        </p>
        <button
          suppressHydrationWarning
          onClick={reset}
          className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors inline-flex items-center gap-2 font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  )
}
