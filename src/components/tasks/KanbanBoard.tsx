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
    onError: (error) => {
      // Revert optimistic update on error by resetting from initialTasks
      // or we can implement a more robust rollback if needed.
      console.error(error)
      setTasks(initialTasks) 
      alert(`Failed to update task: ${error.message}`)
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

      <DragOverlay>
        {activeTask ? (
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
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
