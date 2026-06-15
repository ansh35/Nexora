import { auth } from "@/../auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { ProjectDashboard } from "@/components/projects/ProjectDashboard"
import { FolderPlus } from "lucide-react"
import { EmptyState } from "@/components/ui/EmptyState"

export const metadata = { title: "Projects | Nexora" }

export default async function ProjectsPage() {
  const session = await auth()
  if (!session?.user?.organizationId) redirect("/login")

  const projects = await prisma.project.findMany({
    where: { organizationId: session.user.organizationId as string },
    orderBy: { createdAt: "desc" },
    include: { tasks: true, owner: true }
  })

  return (
    <div className="p-8 max-w-6xl mx-auto w-full font-sans animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">All Projects</h1>
        <p className="text-neutral-400 mt-1">Manage and organize all your team&apos;s projects.</p>
      </header>

      {projects.length === 0 ? (
        <div className="mt-8">
          <EmptyState 
            icon={FolderPlus}
            title="No projects yet"
            description="You don&apos;t have any projects yet. Create your first project to get started."
          />
          <div className="mt-8">
            <ProjectDashboard initialProjects={projects} userRole={session.user.role} />
          </div>
        </div>
      ) : (
        <ProjectDashboard initialProjects={projects} userRole={session.user.role} />
      )}
    </div>
  )
}
