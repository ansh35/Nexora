"use client"

import { useState } from "react"
import { acceptInvitation } from "@/actions/team"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export function AcceptInviteButton({ token }: { token: string }) {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleAccept = async () => {
    setIsPending(true)
    setError("")
    
    const res = await acceptInvitation(token)
    
    if (res?.error) {
      setError(res.error)
      setIsPending(false)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
          {error}
        </div>
      )}
      <button
        onClick={handleAccept}
        disabled={isPending}
        className="w-full flex justify-center items-center gap-2 bg-[#22D3EE] hover:bg-[#06B6D4] text-[#070B14] font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-50"
      >
        {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Accept Invitation"}
      </button>
    </div>
  )
}
