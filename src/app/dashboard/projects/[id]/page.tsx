import { auth } from "@/../auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { TaskDashboard } from "@/components/tasks/TaskDashboard"
import { ActivityFeedPopover } from "@/components/activity/ActivityFeedPopover"
import { ActiveUsers } from "@/components/activity/ActiveUsers"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth()

  if (!session?.user?.organizationId) {
    redirect("/login")
  }

  const project = await prisma.project.findFirst({
    where: { 
      id: id,
      organizationId: session.user.organizationId 
    }
  })

  if (!project) {
    redirect("/dashboard")
  }

  const tasks = await prisma.task.findMany({
    where: { 
      projectId: project.id,
      organizationId: session.user.organizationId
    },
    orderBy: { createdAt: "desc" }
  })

  const members = await prisma.user.findMany({
    where: { organizationId: session.user.organizationId },
    select: { id: true, name: true, email: true }
  })

  return (
    <div className="min-h-screen bg-[#070B14] p-8 text-white font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="relative z-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.04] p-6 rounded-[24px] border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard"
              className="p-2 bg-white/[0.05] hover:bg-white/[0.1] rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-400" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white">{project.name}</h1>
                {project.status === "ARCHIVED" && (
                  <span className="text-xs uppercase font-bold tracking-wider px-2 py-1 bg-neutral-500/20 text-neutral-400 rounded-full">
                    Archived
                  </span>
                )}
              </div>
              <p className="text-neutral-400 text-sm mt-1">{project.description || "No description."}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 self-end sm:self-auto">
            <ActiveUsers organizationId={session.user.organizationId} />
            <ActivityFeedPopover organizationId={session.user.organizationId} />
          </div>
        </header>

        <main className="bg-white/[0.02] border border-white/5 p-8 rounded-[24px] backdrop-blur-xl">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#22D3EE]">Project Tasks</h2>
            <p className="text-sm text-neutral-400">Manage tasks for this project.</p>
          </div>
          
          <TaskDashboard 
            projectId={project.id} 
            initialTasks={tasks} 
            organizationMembers={members} 
            userRole={session.user.role} 
            currentUserId={session.user.id}
            organizationId={session.user.organizationId}
          />
        </main>
      </div>
    </div>
  )
}
