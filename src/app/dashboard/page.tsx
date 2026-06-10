import { auth } from "@/../auth"
import { logout } from "@/actions/auth"
import { redirect } from "next/navigation"
import { getCurrentOrganization } from "@/lib/org"
import prisma from "@/lib/prisma"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const org = await getCurrentOrganization()

  if (!org) {
    return (
      <div className="min-h-screen bg-[#070B14] flex items-center justify-center text-white font-sans">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-400">Organization Not Found</h1>
          <p className="text-neutral-400">Please contact support or try logging in again.</p>
          <form action={logout}>
            <button type="submit" className="text-[#22D3EE] hover:underline">Sign Out</button>
          </form>
        </div>
      </div>
    )
  }

  const memberCount = await prisma.user.count({
    where: { organizationId: org.id }
  })

  return (
    <div className="min-h-screen bg-[#070B14] p-8 text-white font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between bg-white/[0.04] p-6 rounded-[24px] border border-white/10 backdrop-blur-xl">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-neutral-400">Welcome back, {session.user.name}</p>
          </div>
          
          <form action={logout}>
            <button 
              type="submit" 
              className="px-6 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors font-medium border border-red-500/20"
            >
              Sign Out
            </button>
          </form>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/[0.05] border border-white/10 p-6 rounded-[24px] backdrop-blur-xl">
            <h3 className="text-sm font-medium text-neutral-400 mb-2">Workspace Name</h3>
            <p className="text-2xl font-semibold text-[#22D3EE]">{org.name}</p>
          </div>
          
          <div className="bg-white/[0.05] border border-white/10 p-6 rounded-[24px] backdrop-blur-xl">
            <h3 className="text-sm font-medium text-neutral-400 mb-2">Your Role</h3>
            <p className="text-2xl font-semibold text-white">{session.user.role}</p>
          </div>

          <div className="bg-white/[0.05] border border-white/10 p-6 rounded-[24px] backdrop-blur-xl">
            <h3 className="text-sm font-medium text-neutral-400 mb-2">Total Members</h3>
            <p className="text-2xl font-semibold text-white">{memberCount}</p>
          </div>
        </div>

        <main className="bg-white/[0.05] border border-white/10 p-8 rounded-[24px] backdrop-blur-xl">
          <h2 className="text-xl font-semibold mb-4 text-[#22D3EE]">Current User Session Data</h2>
          <pre className="bg-[#070B14] p-6 rounded-xl border border-white/5 overflow-x-auto text-sm text-neutral-300">
            {JSON.stringify(session.user, null, 2)}
          </pre>
        </main>
      </div>
    </div>
  )
}
