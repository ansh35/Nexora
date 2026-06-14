import { auth } from "@/../auth"
import { ProjectPlannerClient } from "./client"
import { redirect } from "next/navigation"

export default async function ProjectPlannerPage() {
  const session = await auth()
  if (!session?.user?.organizationId) redirect("/login")

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Project Planner</h2>
      </div>
      <p className="text-neutral-400">Generate a comprehensive phase-by-phase plan for a new project.</p>
      <ProjectPlannerClient />
    </div>
  )
}
