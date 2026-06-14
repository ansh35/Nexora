import { auth } from "@/../auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { TaskDashboard } from "@/components/tasks/TaskDashboard"

export const metadata = { title: "Global Tasks | Nexora" }

export default async function GlobalTasksPage() {
  const session = await auth()
  if (!session?.user?.organizationId) redirect("/login")

  const tasks = await prisma.task.findMany({
    where: { organizationId: session.user.organizationId as string },
    orderBy: { createdAt: "desc" },
  })

  const members = await prisma.user.findMany({
    where: { organizationId: session.user.organizationId as string },
    select: { id: true, name: true, email: true }
  })

  return (
    <div className="p-8 max-w-6xl mx-auto w-full font-sans animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Global Tasks</h1>
        <p className="text-neutral-400 mt-1">Global view of all tasks across your organization's projects.</p>
      </header>
      
      <div className="mt-8">
        <TaskDashboard 
          projectId="GLOBAL"
          initialTasks={tasks} 
          organizationMembers={members} 
          userRole={session.user.role} 
          currentUserId={session.user.id}
          organizationId={session.user.organizationId}
          isGlobal={true}
        />
      </div>
    </div>
  )
}
