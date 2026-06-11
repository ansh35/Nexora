"use client"

import { useState, useTransition } from "react"
import { Loader2, X } from "lucide-react"
import { createTask, editTask } from "@/actions/tasks"

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
}

export function TaskModal({ isOpen, onClose, projectId, taskToEdit }: TaskModalProps) {
  const [title, setTitle] = useState(taskToEdit?.title || "")
  const [description, setDescription] = useState(taskToEdit?.description || "")
  const [priority, setPriority] = useState(taskToEdit?.priority || "MEDIUM")
  const [status, setStatus] = useState(taskToEdit?.status || "TODO")
  
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!title.trim()) {
      setError("Task title is required")
      return
    }

    startTransition(async () => {
      let result
      if (taskToEdit) {
        result = await editTask(taskToEdit.id, { title, description, priority, status })
      } else {
        result = await createTask(projectId, { title, description, priority, status })
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
            <label className="text-sm font-medium text-neutral-300">Task Title</label>
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
            <label className="text-sm font-medium text-neutral-300">Description (Optional)</label>
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
              ) : taskToEdit ? (
                "Save Changes"
              ) : (
                "Create Task"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
