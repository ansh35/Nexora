import { auth } from "@/../auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { TeamDashboard } from "@/components/team/TeamDashboard"
import { ActivityFeedPopover } from "@/components/activity/ActivityFeedPopover"
import { Users } from "lucide-react"

export default async function TeamPage() {
  const session = await auth()

  if (!session?.user?.organizationId) {
    redirect("/login")
  }

  const organization = await prisma.organization.findUnique({
    where: { id: session.user.organizationId }
  })

  if (!organization) {
    redirect("/dashboard")
  }

  const members = await prisma.user.findMany({
    where: { organizationId: session.user.organizationId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "asc" }
  })

  const pendingInvitations = await prisma.invitation.findMany({
    where: { organizationId: session.user.organizationId },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="min-h-screen bg-[#070B14] p-8 text-white font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="relative z-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.04] p-6 rounded-[24px] border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#22D3EE]/10 rounded-xl">
              <Users className="w-6 h-6 text-[#22D3EE]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Team Directory</h1>
              <p className="text-neutral-400 text-sm mt-1">Manage members and roles for {organization.name}.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 self-end sm:self-auto">
            <ActivityFeedPopover />
          </div>
        </header>

        <main className="bg-white/[0.02] border border-white/5 p-8 rounded-[24px] backdrop-blur-xl min-h-[600px]">
          <TeamDashboard 
            members={members} 
            pendingInvitations={pendingInvitations} 
            userRole={session.user.role} 
            currentUserId={session.user.id}
            organizationName={organization.name}
          />
        </main>
      </div>
    </div>
  )
}
