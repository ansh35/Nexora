import { auth } from "@/../auth"
import prisma from "@/lib/prisma"
import { TaskBreakdownClient } from "./client"
import { redirect } from "next/navigation"

export default async function TaskBreakdownPage() {
  const session = await auth()
  if (!session?.user?.organizationId) redirect("/login")

  const tasks = await prisma.task.findMany({ 
    where: { organizationId: session.user.organizationId },
    select: { id: true, title: true }
  })

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Task Breakdown</h2>
      </div>
      <p className="text-neutral-400">Select a complex task and let AI break it down into smaller, actionable subtasks.</p>
      <TaskBreakdownClient tasks={tasks} />
    </div>
  )
}
