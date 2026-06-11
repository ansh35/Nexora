"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { motion } from "framer-motion"
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

type KanbanColumnProps = {
  id: string
  title: string
  tasks: Task[]
  userRole: string
  currentUserId: string
  organizationMembers: { id: string; name: string }[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onAssign: (taskId: string, assigneeId: string) => void
}

export function KanbanColumn({ 
  id, 
  title, 
  tasks, 
  userRole, 
  currentUserId,
  organizationMembers,
  onEdit,
  onDelete,
  onAssign
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  const canEdit = userRole === "OWNER" || userRole === "ADMIN"
  const canDelete = userRole === "OWNER"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col bg-white/[0.02] border rounded-[24px] overflow-hidden backdrop-blur-xl h-full transition-colors ${
        isOver ? "border-[#22D3EE]/50 bg-white/[0.04]" : "border-white/5"
      }`}
    >
      <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
        <h2 className="font-semibold text-white tracking-wide">{title}</h2>
        <span className="text-xs font-medium text-neutral-400 bg-white/[0.05] px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>

      <div 
        ref={setNodeRef}
        className="flex-1 p-4 space-y-4 overflow-y-auto min-h-[150px]"
      >
        <SortableContext 
          items={tasks.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => {
            const canDrag = userRole === "OWNER" || userRole === "ADMIN" || task.assigneeId === currentUserId
            
            return (
              <KanbanCard 
                key={task.id} 
                task={task} 
                canEdit={canEdit}
                canDelete={canDelete}
                canDrag={canDrag}
                onEdit={onEdit}
                onDelete={onDelete}
                organizationMembers={organizationMembers}
                onAssign={onAssign}
              />
            )
          })}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="h-full flex items-center justify-center text-sm text-neutral-500 py-8 border-2 border-dashed border-white/10 rounded-2xl">
            Drop tasks here
          </div>
        )}
      </div>
    </motion.div>
  )
}
