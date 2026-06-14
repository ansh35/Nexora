"use client"

import { useState, useRef, useTransition } from "react"
import { Search, Plus, Archive, Trash2, Edit2, Loader2, FolderOpen } from "lucide-react"
import { ProjectModal } from "./ProjectModal"
import { archiveProject, deleteProject } from "@/actions/projects"

type Project = {
  id: string
  name: string
  description: string | null
  status: string
  createdAt: Date
  tasks?: { status: string }[]
  owner?: { name: string, image: string | null } | null
}

type ProjectDashboardProps = {
  initialProjects: Project[]
  userRole: string
}

import Link from "next/link"

export function ProjectDashboard({ initialProjects, userRole }: ProjectDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()
  
  const canCreate = userRole === "OWNER" || userRole === "ADMIN"
  const canEdit = userRole === "OWNER" || userRole === "ADMIN"
  const canDelete = userRole === "OWNER"

  const filteredProjects = initialProjects.filter((p) => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const activeProjects = filteredProjects.filter(p => p.status === "ACTIVE")
  const archivedProjects = filteredProjects.filter(p => p.status === "ARCHIVED")

  const handleArchive = (id: string) => {
    startTransition(async () => {
      await archiveProject(id)
    })
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to permanently delete this project?")) {
      startTransition(async () => {
        await deleteProject(id)
      })
    }
  }

  const openEditModal = (project: Project) => {
    setProjectToEdit(project)
    setIsModalOpen(true)
  }

  const openCreateModal = () => {
    setProjectToEdit(null)
    setIsModalOpen(true)
  }

  const ProjectCard = ({ project }: { project: Project }) => {
    const totalTasks = project.tasks?.length || 0
    const completedTasks = project.tasks?.filter(t => t.status === "DONE").length || 0
    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

    return (
      <div className="bg-white/[0.05] border border-white/10 p-6 rounded-[24px] backdrop-blur-xl group hover:bg-white/[0.08] transition-colors flex flex-col h-full relative overflow-hidden">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#22D3EE]/5 to-transparent" />
        </div>

        <div className="flex-1 relative z-10">
          <div className="flex items-start justify-between mb-2">
            <Link href={`/dashboard/projects/${project.id}`}>
              <h3 className="text-xl font-semibold text-white group-hover:text-[#22D3EE] transition-colors cursor-pointer">
                {project.name}
              </h3>
            </Link>
            {project.status === "ARCHIVED" && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-neutral-500/20 text-neutral-400 rounded-full">
                Archived
              </span>
            )}
            {project.status === "ACTIVE" && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 rounded-full">
                Active
              </span>
            )}
          </div>
          <p className="text-sm text-neutral-400 line-clamp-2 mb-6">
            {project.description || "No description provided."}
          </p>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
              <span>Progress</span>
              <span className="text-white font-medium">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#22D3EE] to-[#06B6D4] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-medium text-white overflow-hidden border border-white/5" title={`Owner: ${project.owner?.name || "Organization"}`}>
              {project.owner?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.owner.image} alt={project.owner.name} className="w-full h-full object-cover" />
              ) : (
                (project.owner?.name || "O").charAt(0).toUpperCase()
              )}
            </div>
            <span className="text-xs text-neutral-500" suppressHydrationWarning>
              {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {canEdit && project.status === "ACTIVE" && (
              <>
                <button 
                  suppressHydrationWarning
                  onClick={() => openEditModal(project)}
                  className="p-2 text-neutral-400 hover:text-[#22D3EE] hover:bg-[#22D3EE]/10 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE]"
                  title="Edit Project"
                  aria-label={`Edit ${project.name}`}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  suppressHydrationWarning
                  onClick={() => handleArchive(project.id)}
                  className="p-2 text-neutral-400 hover:text-orange-400 hover:bg-orange-400/10 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                  title="Archive Project"
                  aria-label={`Archive ${project.name}`}
                >
                  <Archive className="w-4 h-4" />
                </button>
              </>
            )}
            {canDelete && (
              <button 
                suppressHydrationWarning
                onClick={() => handleDelete(project.id)}
                className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                title="Delete Project"
                aria-label={`Delete ${project.name}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-neutral-500" />
          </div>
          <input
            suppressHydrationWarning
            ref={searchInputRef}
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-12 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/50 transition-all"
          />

        </div>
        
        {canCreate && (
          <button
            suppressHydrationWarning
            onClick={openCreateModal}
            className="bg-[#22D3EE] hover:bg-[#06B6D4] text-[#070B14] font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070B14] focus-visible:ring-[#22D3EE]"
            aria-label="Create New Project"
          >
            <Plus className="w-5 h-5" />
            New Project
          </button>
        )}
      </div>

      {isPending && (
        <div className="flex items-center text-[#22D3EE] text-sm">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </div>
      )}

      {activeProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeProjects.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>
      ) : (
        <div className="bg-white/[0.02] border border-white/5 rounded-[24px] p-12 flex flex-col items-center justify-center text-center">
          <FolderOpen className="w-12 h-12 text-neutral-600 mb-4" />
          <h3 className="text-xl font-medium text-neutral-300 mb-2">No active projects</h3>
          <p className="text-neutral-500 max-w-sm">
            {searchQuery 
              ? "No projects match your search." 
              : "Get started by creating your first project."}
          </p>
        </div>
      )}

      {archivedProjects.length > 0 && (
        <div className="pt-8 mt-8 border-t border-white/10">
          <h2 className="text-xl font-semibold text-neutral-400 mb-6 flex items-center gap-2">
            <Archive className="w-5 h-5" />
            Archived Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
            {archivedProjects.map(p => <ProjectCard key={p.id} project={p} />)}
          </div>
        </div>
      )}

      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false)
          setProjectToEdit(null)
        }} 
        projectToEdit={projectToEdit}
      />
    </div>
  )
}
