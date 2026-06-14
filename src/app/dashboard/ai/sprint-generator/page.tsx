import { auth } from "@/../auth"
import prisma from "@/lib/prisma"
import { SprintGeneratorClient } from "./client"
import { redirect } from "next/navigation"

export default async function SprintGeneratorPage() {
  const session = await auth()
  if (!session?.user?.organizationId) redirect("/login")

  const projects = await prisma.project.findMany({ 
    where: { organizationId: session.user.organizationId },
    select: { id: true, name: true }
  })

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Sprint Generator</h2>
      </div>
      <p className="text-neutral-400">Plan your next sprint effortlessly by analyzing your backlog.</p>
      <SprintGeneratorClient projects={projects} />
    </div>
  )
}
