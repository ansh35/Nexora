import { auth } from "@/../auth"
import prisma from "@/lib/prisma"
import { MeetingNotesClient } from "./client"
import { redirect } from "next/navigation"

export default async function MeetingNotesPage() {
  const session = await auth()
  if (!session?.user?.organizationId) redirect("/login")

  const projects = await prisma.project.findMany({ 
    where: { organizationId: session.user.organizationId },
    select: { id: true, name: true }
  })

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Meeting Notes Parser</h2>
      </div>
      <p className="text-neutral-400">Extract actionable tasks directly from your meeting notes.</p>
      <MeetingNotesClient projects={projects} />
    </div>
  )
}
