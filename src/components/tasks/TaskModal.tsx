"use client"

import { useState, useTransition } from "react"
import { X } from "lucide-react"
import { createTask, editTask } from "@/actions/tasks"
import { TaskComments } from "./TaskComments"
import { ModalMotion } from "@/components/motion/modal-motion"
import { useMotion } from "@/components/motion/motion-provider"
import { enhanceTitle, generateDescription } from "@/actions/ai"
import { AIFieldAssistant } from "@/components/ui/ai-assistant-button"
import { ActionFeedback, ActionState } from "@/components/feedback/action-feedback"

type Task = {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
}

type TaskModalProps = {
  isOpen: boolean
  onClose: () => void
  projectId: string
  taskToEdit?: Task | null
  organizationId: string
}

export function TaskModal({ isOpen, onClose, projectId, taskToEdit, organizationId }: TaskModalProps) {
  const [title, setTitle] = useState(taskToEdit?.title || "")
  const [description, setDescription] = useState(taskToEdit?.description || "")
  const [priority, setPriority] = useState(taskToEdit?.priority || "MEDIUM")
  const [status, setStatus] = useState(taskToEdit?.status || "TODO")
  
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()
  const [buttonState, setButtonState] = useState<ActionState>("idle")
  const { toast } = useMotion()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!title.trim()) {
      setError("Task title is required")
      return
    }

    setButtonState("loading")
    startTransition(async () => {
      let result
      if (taskToEdit) {
        result = await editTask(taskToEdit.id, { title, description, priority, status })
      } else {
        result = await createTask(projectId, { title, description, priority, status })
      }

      if (result.error) {
        setError(result.error)
        setButtonState("error")
        setTimeout(() => setButtonState("idle"), 3000)
      } else {
        toast({
          title: taskToEdit ? "Task Updated" : "Task Created",
          description: taskToEdit ? "Your changes have been saved." : "Your new task is ready.",
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
            {taskToEdit ? "Edit Task" : "Create Task"}
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
              <label className="text-sm font-medium text-neutral-300">Task Title</label>
              <AIFieldAssistant 
                fieldValue={title} 
                context={`Task Description: ${description || 'A generic task'}`} 
                onAccept={setTitle} 
                generateAction={enhanceTitle} 
                label="Enhance Title" 
              />
            </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isPending}
                placeholder="e.g. Design Login Page"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-neutral-300">Description (Optional)</label>
                <AIFieldAssistant 
                  fieldValue={description} 
                  context={`Task Title: ${title || 'A generic task'}`} 
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
                placeholder="Task details..."
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/50 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={isPending}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/50 transition-all appearance-none"
                >
                  <option value="TODO" className="bg-[#070B14]">To Do</option>
                  <option value="IN_PROGRESS" className="bg-[#070B14]">In Progress</option>
                  <option value="DONE" className="bg-[#070B14]">Done</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  disabled={isPending}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/50 transition-all appearance-none"
                >
                  <option value="LOW" className="bg-[#070B14]">Low</option>
                  <option value="MEDIUM" className="bg-[#070B14]">Medium</option>
                  <option value="HIGH" className="bg-[#070B14]">High</option>
                </select>
              </div>
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
              idleText={taskToEdit ? "Save Changes" : "Create Task"}
              loadingText={taskToEdit ? "Saving..." : "Creating..."}
              successText="Saved!"
              errorText="Failed"
            />
          </div>
        </form>
        {taskToEdit && (
          <div className="px-6 pb-6">
            <TaskComments taskId={taskToEdit.id} organizationId={organizationId} />
          </div>
        )}
      </ModalMotion>
  )
}
