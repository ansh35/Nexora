"use client"

import { useState, useTransition } from "react"
import { Loader2, X } from "lucide-react"
import { createProject, updateProject } from "@/actions/projects"

type Project = {
  id: string
  name: string
  description: string | null
  status: string
}

type ProjectModalProps = {
  isOpen: boolean
  onClose: () => void
  projectToEdit?: Project | null
}

export function ProjectModal({ isOpen, onClose, projectToEdit }: ProjectModalProps) {
  const [name, setName] = useState(projectToEdit?.name || "")
  const [description, setDescription] = useState(projectToEdit?.description || "")
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name.trim()) {
      setError("Project name is required")
      return
    }

    startTransition(async () => {
      let result
      if (projectToEdit) {
        result = await updateProject(projectToEdit.id, { name, description })
      } else {
        result = await createProject({ name, description })
      }

      if (result.error) {
        setError(result.error)
      } else {
        onClose()
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#070B14] border border-white/10 rounded-[24px] shadow-2xl overflow-hidden flex flex-col relative">
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02]">
          <h2 className="text-xl font-bold text-white">
            {projectToEdit ? "Edit Project" : "Create Project"}
          </h2>
          <button 
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              placeholder="e.g. Website Redesign"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
              rows={3}
              placeholder="A brief description of this project..."
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/50 transition-all resize-none"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 bg-white/[0.05] hover:bg-white/[0.1] text-white font-medium py-3 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-[#22D3EE] hover:bg-[#06B6D4] text-[#070B14] font-semibold py-3 rounded-xl transition-colors flex items-center justify-center"
            >
              {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : projectToEdit ? (
                "Save Changes"
              ) : (
                "Create Project"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
