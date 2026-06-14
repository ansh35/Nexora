import { auth } from "@/../auth"
import { redirect } from "next/navigation"
import { getAnalyticsData } from "@/actions/analytics"
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Analytics | Nexora",
  description: "View your workspace analytics and insights",
}

export default async function AnalyticsPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const data = await getAnalyticsData()

  if (!data) {
    return (
      <div className="min-h-screen bg-[#070B14] p-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-white">Failed to load analytics</h2>
          <p className="text-neutral-400">Please try refreshing the page.</p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-[#22D3EE] hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#070B14] p-8 text-white font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="relative z-50 flex items-center justify-between bg-white/[0.04] p-6 rounded-[24px] border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard"
              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-neutral-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Analytics & Insights</h1>
              <p className="text-neutral-400">
                {session.user.role === "MEMBER" ? "Your personal performance metrics" : "Organization-wide metrics"}
              </p>
            </div>
          </div>
        </header>

        <main>
          <AnalyticsDashboard data={data} userRole={session.user.role} />
        </main>
      </div>
    </div>
  )
}
