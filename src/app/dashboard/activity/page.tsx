import { auth } from "@/../auth"
import { redirect } from "next/navigation"
import { ActivityTimeline } from "@/components/activity/ActivityTimeline"
import { Activity } from "lucide-react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function ActivityPage() {
  const session = await auth()

  if (!session?.user?.organizationId) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-[#070B14] p-8 text-white font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="relative z-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.04] p-6 rounded-[24px] border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 bg-white/[0.05] hover:bg-white/[0.1] rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-400" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#22D3EE]/10 rounded-xl">
                <Activity className="w-6 h-6 text-[#22D3EE]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Activity Log</h1>
                <p className="text-neutral-400 text-sm mt-1">Audit trail of all actions across the workspace.</p>
              </div>
            </div>
          </div>
        </header>

        <main className="bg-white/[0.02] border border-white/5 p-8 rounded-[24px] backdrop-blur-xl min-h-[600px]">
          <ActivityTimeline />
        </main>
      </div>
    </div>
  )
}
