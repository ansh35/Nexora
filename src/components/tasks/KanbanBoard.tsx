"use client"

import { useState, useEffect } from "react"
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragStartEvent,
  DragEndEvent,
  DragOverEvent
} from "@dnd-kit/core"
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { useMutation } from "@tanstack/react-query"
import { updateTaskStatus } from "@/actions/tasks"
import { KanbanColumn } from "./KanbanColumn"
import { KanbanCard } from "./KanbanCard"
import { useMotion } from "@/components/motion/motion-provider"
import { SkeletonCard } from "@/components/feedback/skeleton-loader"

type Task = {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  assigneeId: string | null
  createdAt: Date
}

type KanbanBoardProps = {
  initialTasks: Task[]
  organizationMembers: { id: string; name: string }[]
  userRole: string
  currentUserId: string
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onAssign: (taskId: string, assigneeId: string) => void
}

const COLUMNS = [
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "DONE", title: "Done" }
]

export function KanbanBoard({
  initialTasks,
  organizationMembers,
  userRole,
  currentUserId,
  onEdit,
  onDelete,
  onAssign
}: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const { toast } = useMotion()

  useEffect(() => {
    // eslint-disable-next-line
    setIsMounted(true)
  }, [])

  const [prevInitialTasks, setPrevInitialTasks] = useState(initialTasks)

  if (initialTasks !== prevInitialTasks) {
    setPrevInitialTasks(initialTasks)
    setTasks(initialTasks)
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const updateStatusMutation = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: string }) => {
      const res = await updateTaskStatus(taskId, status)
      if (res?.error) throw new Error(res.error)
      return res
    },
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "Task status has been updated.",
        type: "success"
      })
    },
    onError: (error) => {
      console.error(error)
      setTasks(initialTasks) 
      toast({
        title: "Update Failed",
        description: `Failed to update task: ${error.message}`,
        type: "error"
      })
    }
  })

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = tasks.find(t => t.id === active.id)
    if (task) setActiveTask(task)
  }

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveTask = active.data.current?.sortable
    const isOverTask = over.data.current?.sortable
    const isOverColumn = COLUMNS.some(c => c.id === overId)

    if (!isActiveTask) return

    setTasks((tasks) => {
      const activeIndex = tasks.findIndex(t => t.id === activeId)
      const overIndex = tasks.findIndex(t => t.id === overId)

      if (activeIndex === -1) return tasks

      const newTasks = [...tasks]
      const activeTask = newTasks[activeIndex]

      // Dropping over another task
      if (isOverTask && overIndex !== -1) {
        const overTask = newTasks[overIndex]
        if (activeTask.status !== overTask.status) {
          activeTask.status = overTask.status
          return arrayMove(newTasks, activeIndex, overIndex)
        }
        return arrayMove(newTasks, activeIndex, overIndex)
      }

      // Dropping over a column
      if (isOverColumn) {
        if (activeTask.status !== overId) {
          activeTask.status = overId as string
          return arrayMove(newTasks, activeIndex, newTasks.length - 1)
        }
      }

      return tasks
    })
  }

  const onDragEnd = (event: DragEndEvent) => {
    setActiveTask(null)
    const { active, over } = event
    if (!over) return

    const activeId = active.id

    const task = tasks.find(t => t.id === activeId)
    if (!task) return

    const originalTask = initialTasks.find(t => t.id === activeId)

    if (originalTask && originalTask.status !== task.status) {
      updateStatusMutation.mutate({ taskId: task.id, status: task.status })
    }
  }

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-[600px]">
        {COLUMNS.map((col) => (
          <div key={col.id} className="bg-[#070B14]/50 border border-white/[0.08] rounded-[24px] p-4 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-neutral-700" />
              <div className="h-5 w-24 bg-white/5 rounded-md" />
            </div>
            <SkeletonCard className="h-32 min-h-0" />
            <SkeletonCard className="h-32 min-h-0" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-[600px]">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            tasks={tasks.filter(t => t.status === col.id)}
            userRole={userRole}
            currentUserId={currentUserId}
            organizationMembers={organizationMembers}
            onEdit={onEdit}
            onDelete={onDelete}
            onAssign={onAssign}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{
        duration: 250,
        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
      }}>
        {activeTask ? (
          <div className="opacity-95 rotate-3 scale-105 shadow-[0_20px_40px_rgba(34,211,238,0.15)] rounded-[24px] cursor-grabbing transition-transform">
            <KanbanCard
              task={activeTask}
              canEdit={userRole === "OWNER" || userRole === "ADMIN"}
              canDelete={userRole === "OWNER"}
              canDrag={true} // It's already dragging
              onEdit={() => {}}
              onDelete={() => {}}
              onAssign={() => {}}
              organizationMembers={organizationMembers}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
