import { auth } from "@/../auth"
import prisma from "@/lib/prisma"
import { RiskDetectionClient } from "./client"
import { redirect } from "next/navigation"

export default async function RiskDetectionPage() {
  const session = await auth()
  if (!session?.user?.organizationId) redirect("/login")

  const projects = await prisma.project.findMany({ 
    where: { organizationId: session.user.organizationId },
    select: { id: true, name: true }
  })

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Risk Detection</h2>
      </div>
      <p className="text-neutral-400">Enter your project&apos;s current context, timeline, and key dependencies to identify potential risks.</p>
      <RiskDetectionClient projects={projects} />
    </div>
  )
}
