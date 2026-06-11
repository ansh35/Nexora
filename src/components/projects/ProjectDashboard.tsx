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

  const ProjectCard = ({ project }: { project: Project }) => (
    <div className="bg-white/[0.05] border border-white/10 p-6 rounded-[24px] backdrop-blur-xl group hover:bg-white/[0.08] transition-colors flex flex-col h-full">
      <div className="flex-1">
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
        </div>
        <p className="text-sm text-neutral-400 line-clamp-3 mb-4">
          {project.description || "No description provided."}
        </p>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
        <span className="text-xs text-neutral-500" suppressHydrationWarning>
          Created {new Date(project.createdAt).toLocaleDateString()}
        </span>
        <div className="flex items-center gap-2">
          {canEdit && project.status === "ACTIVE" && (
            <>
              <button 
                onClick={() => openEditModal(project)}
                className="p-2 text-neutral-400 hover:text-[#22D3EE] hover:bg-[#22D3EE]/10 rounded-lg transition-colors"
                title="Edit Project"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleArchive(project.id)}
                className="p-2 text-neutral-400 hover:text-orange-400 hover:bg-orange-400/10 rounded-lg transition-colors"
                title="Archive Project"
              >
                <Archive className="w-4 h-4" />
              </button>
            </>
          )}
          {canDelete && (
            <button 
              onClick={() => handleDelete(project.id)}
              className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              title="Delete Project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-neutral-500" />
          </div>
          <input
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
            onClick={openCreateModal}
            className="bg-[#22D3EE] hover:bg-[#06B6D4] text-[#070B14] font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
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
