"use client"

import { useState, useTransition, useEffect } from "react"
import { Search, Plus, Trash2, Edit2, Loader2, ListTodo, Circle, CheckCircle2, Clock, LayoutList, Kanban } from "lucide-react"
import { TaskModal } from "./TaskModal"
import { deleteTask, updateTaskStatus, assignTask } from "@/actions/tasks"
import { KanbanBoard } from "./KanbanBoard"
import { usePusher } from "@/components/providers/PusherProvider"

type User = {
  id: string
  name: string
  email: string
}

type Task = {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  assigneeId: string | null
  createdAt: Date
  projectId?: string
}

type TaskDashboardProps = {
  projectId: string
  initialTasks: Task[]
  organizationMembers: User[]
  userRole: string
  currentUserId: string
  isGlobal?: boolean
  organizationId: string
}

export function TaskDashboard({ projectId, initialTasks, organizationMembers, userRole, currentUserId, isGlobal = false, organizationId }: TaskDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)
  const [isPending, startTransition] = useTransition()
  
  const [liveTasks, setLiveTasks] = useState<Task[]>(initialTasks)
  const { pusherClient } = usePusher()

  useEffect(() => {
    setLiveTasks(initialTasks)
  }, [initialTasks])

  useEffect(() => {
    if (!pusherClient) return

    const channel = pusherClient.subscribe(`private-org-${organizationId}`)

    channel.bind("task-created", (newTask: Task) => {
      if (projectId !== "GLOBAL" && newTask.projectId !== projectId) return
      setLiveTasks((prev) => [newTask, ...prev])
    })

    channel.bind("task-updated", (updatedTask: Task) => {
      setLiveTasks((prev) => prev.map(t => t.id === updatedTask.id ? updatedTask : t))
    })

    channel.bind("task-deleted", (data: { id: string }) => {
      setLiveTasks((prev) => prev.filter(t => t.id !== data.id))
    })

    return () => {
      pusherClient.unsubscribe(`private-org-${organizationId}`)
    }
  }, [pusherClient, organizationId, projectId])

  const canCreate = !isGlobal && (userRole === "OWNER" || userRole === "ADMIN")
  const canEdit = userRole === "OWNER" || userRole === "ADMIN"
  const canDelete = userRole === "OWNER"

  const filteredTasks = liveTasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDelete = (id: string) => {
    if (confirm("Delete this task?")) {
      startTransition(async () => {
        await deleteTask(id)
      })
    }
  }

  const handleStatusChange = (taskId: string, status: string) => {
    startTransition(async () => {
      await updateTaskStatus(taskId, status)
    })
  }

  const handleAssign = (taskId: string, assigneeId: string) => {
    startTransition(async () => {
      await assignTask(taskId, assigneeId === "UNASSIGNED" ? null : assigneeId)
    })
  }

  const openEditModal = (task: Task) => {
    setTaskToEdit(task)
    setIsModalOpen(true)
  }

  const openCreateModal = () => {
    setTaskToEdit(null)
    setIsModalOpen(true)
  }

  const TaskCard = ({ task }: { task: Task }) => {
    const canUpdateStatus = canEdit || task.assigneeId === currentUserId

    return (
      <div className="bg-white/[0.05] border border-white/10 p-5 rounded-[20px] backdrop-blur-xl group hover:bg-white/[0.08] transition-colors flex flex-col h-full">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {task.status === "TODO" && <Circle className="w-5 h-5 text-neutral-500" />}
            {task.status === "IN_PROGRESS" && <Clock className="w-5 h-5 text-[#22D3EE]" />}
            {task.status === "DONE" && <CheckCircle2 className="w-5 h-5 text-green-400" />}
            <h3 className="text-lg font-semibold text-white group-hover:text-[#22D3EE] transition-colors line-clamp-1">
              {task.title}
            </h3>
          </div>
          
          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full ${
            task.priority === "HIGH" ? "bg-red-500/20 text-red-400" :
            task.priority === "MEDIUM" ? "bg-orange-500/20 text-orange-400" :
            "bg-blue-500/20 text-blue-400"
          }`}>
            {task.priority}
          </span>
        </div>
        
        <p className="text-sm text-neutral-400 line-clamp-2 mb-4 flex-1">
          {task.description || "No description provided."}
        </p>
        
        <div className="flex flex-col gap-3 pt-4 border-t border-white/10 mt-auto">
          <div className="flex items-center justify-between gap-2">
            <select
              disabled={!canUpdateStatus || isPending}
              value={task.status}
              onChange={(e) => handleStatusChange(task.id, e.target.value)}
              className="bg-white/[0.04] border border-white/10 text-xs text-white rounded-lg px-2 py-1 focus:outline-none appearance-none disabled:opacity-50"
            >
              <option value="TODO" className="bg-[#070B14]">To Do</option>
              <option value="IN_PROGRESS" className="bg-[#070B14]">In Progress</option>
              <option value="DONE" className="bg-[#070B14]">Done</option>
            </select>

            <select
              disabled={!canEdit || isPending}
              value={task.assigneeId || "UNASSIGNED"}
              onChange={(e) => handleAssign(task.id, e.target.value)}
              className="bg-white/[0.04] border border-white/10 text-xs text-white rounded-lg px-2 py-1 focus:outline-none appearance-none disabled:opacity-50 max-w-[120px] truncate"
            >
              <option value="UNASSIGNED" className="bg-[#070B14]">Unassigned</option>
              {organizationMembers.map(m => (
                <option key={m.id} value={m.id} className="bg-[#070B14]">{m.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] text-neutral-500" suppressHydrationWarning>
              {new Date(task.createdAt).toLocaleDateString()}
            </span>
            <div className="flex items-center gap-1">
              {canEdit && (
                <button 
                  onClick={() => openEditModal(task)}
                  disabled={isPending}
                  className="p-1.5 text-neutral-400 hover:text-[#22D3EE] hover:bg-[#22D3EE]/10 rounded-md transition-colors"
                  title="Edit Task"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
              {canDelete && (
                <button 
                  onClick={() => handleDelete(task.id)}
                  disabled={isPending}
                  className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                  title="Delete Task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2 flex-1 max-w-xl">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-neutral-500" />
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/50 transition-all"
            />
          </div>
          
          {viewMode === "list" && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/50 transition-all appearance-none min-w-[120px]"
            >
              <option value="ALL" className="bg-[#070B14]">All Status</option>
              <option value="TODO" className="bg-[#070B14]">To Do</option>
              <option value="IN_PROGRESS" className="bg-[#070B14]">In Progress</option>
              <option value="DONE" className="bg-[#070B14]">Done</option>
            </select>
          )}

          <div className="flex bg-white/[0.04] border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setViewMode("kanban")}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === "kanban" ? "bg-white/[0.1] text-white" : "text-neutral-500 hover:text-white"}`}
              title="Kanban View"
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-white/[0.1] text-white" : "text-neutral-500 hover:text-white"}`}
              title="List View"
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {canCreate && (
          <button
            onClick={openCreateModal}
            className="bg-[#22D3EE] hover:bg-[#06B6D4] text-[#070B14] font-semibold py-2 px-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        )}
      </div>

      {isPending && (
        <div className="flex items-center text-[#22D3EE] text-sm">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Updating...
        </div>
      )}

      {viewMode === "kanban" ? (
        <KanbanBoard 
          initialTasks={filteredTasks}
          organizationMembers={organizationMembers}
          userRole={userRole}
          currentUserId={currentUserId}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onAssign={handleAssign}
        />
      ) : (
        <>
          {filteredTasks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map(t => <TaskCard key={t.id} task={t} />)}
            </div>
          ) : (
            <div className="bg-white/[0.02] border border-white/5 rounded-[24px] p-12 flex flex-col items-center justify-center text-center">
              <ListTodo className="w-10 h-10 text-neutral-600 mb-4" />
              <h3 className="text-lg font-medium text-neutral-300 mb-1">No tasks found</h3>
              <p className="text-sm text-neutral-500 max-w-sm">
                {searchQuery || statusFilter !== "ALL" 
                  ? "No tasks match your filters." 
                  : "This project has no tasks yet."}
              </p>
            </div>
          )}
        </>
      )}

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false)
          setTaskToEdit(null)
        }} 
        projectId={projectId}
        taskToEdit={taskToEdit}
        organizationId={organizationId}
      />
    </div>
  )
}
