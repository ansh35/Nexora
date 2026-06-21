import { auth } from "@/../auth"
import { logout } from "@/actions/auth"
import { redirect } from "next/navigation"
import { getCurrentOrganization } from "@/lib/org"
import prisma from "@/lib/prisma"
import { ProjectDashboard } from "@/components/projects/ProjectDashboard"
import { WelcomeOnboarding } from "@/components/dashboard/WelcomeOnboarding"
import { EmptyState } from "@/components/ui/EmptyState"
import { FolderPlus, User as UserIcon } from "lucide-react"
import Link from "next/link"
import { RecentActivityWidget } from "@/components/dashboard/RecentActivityWidget"
import { NotificationPopover } from "@/components/dashboard/NotificationPopover"
import { ActiveUsers } from "@/components/activity/ActiveUsers"

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
            <button type="submit" suppressHydrationWarning className="text-[#22D3EE] hover:underline">Sign Out</button>
          </form>
        </div>
      </div>
    )
  }

  const activeProjectsCount = await prisma.project.count({
    where: { organizationId: org.id, status: "ACTIVE" }
  })

  const pendingTasksCount = await prisma.task.count({
    where: { organizationId: org.id, status: { in: ["TODO", "IN_PROGRESS"] } }
  })

  const completedTasksThisWeekCount = await prisma.task.count({
    where: {
      organizationId: org.id,
      status: "DONE",
      updatedAt: { gte: new Date(new Date().setDate(new Date().getDate() - 7)) }
    }
  })

  const projects = await prisma.project.findMany({
    where: { organizationId: org.id },
    orderBy: { createdAt: "desc" },
    include: {
      tasks: true,
      owner: true
    }
  })

  return (
    <div className="min-h-screen bg-[#070B14] p-8 text-white font-sans">
      <WelcomeOnboarding 
        userName={session.user.name || "User"} 
        organizationName={org.name} 
        hasProjects={projects.length > 0} 
      />
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="relative z-50 flex items-center justify-between bg-white/[0.05] p-6 rounded-[24px] border border-white/[0.08] backdrop-blur-xl">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-neutral-400">Welcome back, {session.user.name}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <ActiveUsers organizationId={org.id} />
            <NotificationPopover userId={session.user.id} />
            <Link href="/dashboard/settings/profile" className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#22D3EE] to-[#8B5CF6] p-[2px] cursor-pointer hover:opacity-90 transition-opacity">
              <div className="w-full h-full bg-[#070B14] rounded-full flex items-center justify-center font-bold text-white overflow-hidden">
                {session.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={session.user.image} alt={session.user.name || "User"} className="w-full h-full object-cover" />
                ) : (
                  session.user.name?.charAt(0).toUpperCase() || <UserIcon className="w-5 h-5 text-neutral-400" />
                )}
              </div>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white/[0.05] border border-white/10 hover:border-white/20 hover:bg-white/[0.06] shadow-[0_0_40px_rgba(34,211,238,0.12)] p-6 rounded-[24px] backdrop-blur-xl transition-all duration-300  hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(34,211,238,0.1)] group">
            <h3 className="text-sm font-medium text-neutral-400 mb-2">Active Projects</h3>
            <p className="text-3xl font-bold text-[#22D3EE] group-hover:scale-105 transform origin-left transition-transform duration-300">{activeProjectsCount}</p>
          </div>
          
          <div className="bg-white/[0.05] border border-white/10 hover:border-white/20 hover:bg-white/[0.06] shadow-[0_0_40px_rgba(34,211,238,0.12)] p-6 rounded-[24px] backdrop-blur-xl transition-all duration-300  hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(245,158,11,0.1)] group">
            <h3 className="text-sm font-medium text-neutral-400 mb-2">Pending Tasks</h3>
            <p className="text-3xl font-bold text-[#F59E0B] group-hover:scale-105 transform origin-left transition-transform duration-300">{pendingTasksCount}</p>
          </div>

          <div className="bg-white/[0.05] border border-white/10 hover:border-white/20 hover:bg-white/[0.06] shadow-[0_0_40px_rgba(34,211,238,0.12)] p-6 rounded-[24px] backdrop-blur-xl transition-all duration-300  hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(239,68,68,0.1)] group">
            <h3 className="text-sm font-medium text-neutral-400 mb-2">Overdue Tasks</h3>
            <p className="text-3xl font-bold text-[#EF4444] group-hover:scale-105 transform origin-left transition-transform duration-300">0</p>
          </div>

          <div className="bg-white/[0.05] border border-white/10 hover:border-white/20 hover:bg-white/[0.06] shadow-[0_0_40px_rgba(34,211,238,0.12)] p-6 rounded-[24px] backdrop-blur-xl transition-all duration-300  hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(16,185,129,0.1)] group">
            <h3 className="text-sm font-medium text-neutral-400 mb-2">Completed (7d)</h3>
            <p className="text-3xl font-bold text-[#10B981] group-hover:scale-105 transform origin-left transition-transform duration-300">{completedTasksThisWeekCount}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <main className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Your Projects</h2>
            </div>
          {projects.length === 0 ? (
            <div className="mt-8">
              <EmptyState 
                icon={FolderPlus}
                title="No projects yet"
                description="Get started by creating your first project. Projects help you organize tasks and collaborate with your team."
              />
              <div className="mt-8">
                <ProjectDashboard initialProjects={projects} userRole={session.user.role} />
              </div>
            </div>
          ) : (
            <ProjectDashboard initialProjects={projects} userRole={session.user.role} />
          )}
          </main>
          
          <div className="lg:col-span-1">
            <RecentActivityWidget />
          </div>
        </div>
      </div>
    </div>
  )
}
