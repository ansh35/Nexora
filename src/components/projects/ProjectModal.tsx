"use client"

import { useState, useTransition } from "react"
import { Loader2, X } from "lucide-react"
import { createProject, updateProject } from "@/actions/projects"
import { ModalMotion } from "@/components/motion/modal-motion"
import { useMotion } from "@/components/motion/motion-provider"
import { enhanceTitle, generateDescription } from "@/actions/ai"
import { AIFieldAssistant } from "@/components/ui/ai-assistant-button"
import { ActionFeedback, ActionState } from "@/components/feedback/action-feedback"

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
  const [buttonState, setButtonState] = useState<ActionState>("idle")
  const { toast } = useMotion()



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name.trim()) {
      setError("Project name is required")
      return
    }

    setButtonState("loading")
    startTransition(async () => {
      let result
      if (projectToEdit) {
        result = await updateProject(projectToEdit.id, { name, description })
      } else {
        result = await createProject({ name, description })
      }

      if (result.error) {
        setError(result.error)
        setButtonState("error")
        setTimeout(() => setButtonState("idle"), 3000)
      } else {
        toast({
          title: projectToEdit ? "Project Updated" : "Project Created",
          description: projectToEdit ? "Your changes have been saved." : "Your new project is ready.",
          type: "success"
        })
        setButtonState("success")
        setTimeout(() => {
          onClose()
          setButtonState("idle")
        }, 1500)
      }
    })
  }

  return (
    <ModalMotion 
      isOpen={isOpen} 
      onClose={onClose} 
      className="w-full max-w-md bg-[#070B14] border border-white/[0.08] rounded-[24px] shadow-[0_0_40px_rgba(34,211,238,0.12)] overflow-hidden flex flex-col relative"
    >
        <div className="flex items-center justify-between p-6 border-b border-white/[0.08] bg-white/[0.02]">
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
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-neutral-300">Project Name</label>
              <AIFieldAssistant 
                fieldValue={name} 
                context={`Project Description: ${description || 'A generic project'}`} 
                onAccept={setName} 
                generateAction={enhanceTitle} 
                label="Enhance Title" 
              />
            </div>
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
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-neutral-300">Description (Optional)</label>
              <AIFieldAssistant 
                fieldValue={description} 
                context={`Project Name: ${name || 'A generic project'}`} 
                onAccept={setDescription} 
                generateAction={generateDescription} 
                label="Generate Description" 
              />
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
              rows={3}
              placeholder="Briefly describe the project..."
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
              disabled={isPending || buttonState === "loading" || buttonState === "success"}
              className="flex-1 bg-white/[0.05] hover:bg-white/[0.1] text-white font-medium py-3 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <ActionFeedback
              type="submit"
              state={buttonState}
              disabled={isPending}
              className="flex-1"
              idleText={projectToEdit ? "Save Changes" : "Create Project"}
              loadingText={projectToEdit ? "Saving..." : "Creating..."}
              successText="Saved!"
              errorText="Failed"
            />
          </div>
        </form>
      </ModalMotion>
  )
}
