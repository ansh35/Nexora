"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { motion } from "framer-motion"
import { Circle, Clock, CheckCircle2, Edit2, Trash2, GripVertical } from "lucide-react"

type Task = {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  assigneeId: string | null
  createdAt: Date
}

type KanbanCardProps = {
  task: Task
  canEdit: boolean
  canDelete: boolean
  canDrag: boolean
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  organizationMembers: { id: string; name: string }[]
  onAssign: (taskId: string, assigneeId: string) => void
}

export function KanbanCard({ 
  task, 
  canEdit, 
  canDelete, 
  canDrag, 
  onEdit, 
  onDelete, 
  organizationMembers,
  onAssign 
}: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    disabled: !canDrag,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group"
    >
      <motion.div
        whileHover={canDrag ? { y: -2, scale: 1.02 } : {}}
        className={`bg-white/[0.05] border border-white/10 p-5 rounded-[24px] backdrop-blur-xl transition-colors flex flex-col h-full ${
          isDragging ? "shadow-2xl shadow-[#22D3EE]/20 border-[#22D3EE]/50" : "hover:bg-white/[0.08]"
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-1">
            <div 
              {...attributes} 
              {...listeners} 
              className={`p-1 -ml-1 rounded-md text-neutral-500 hover:bg-white/5 ${canDrag ? "cursor-grab active:cursor-grabbing hover:text-white" : "cursor-not-allowed opacity-50"}`}
              title={canDrag ? "Drag to move" : "Cannot move this task"}
            >
              <GripVertical className="w-4 h-4" />
            </div>
            {task.status === "TODO" && <Circle className="w-5 h-5 text-neutral-500 shrink-0" />}
            {task.status === "IN_PROGRESS" && <Clock className="w-5 h-5 text-[#22D3EE] shrink-0" />}
            {task.status === "DONE" && <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />}
            <h3 className="text-sm font-semibold text-white group-hover:text-[#22D3EE] transition-colors line-clamp-2">
              {task.title}
            </h3>
          </div>
          
          <span className={`shrink-0 ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full ${
            task.priority === "HIGH" ? "bg-red-500/20 text-red-400" :
            task.priority === "MEDIUM" ? "bg-orange-500/20 text-orange-400" :
            "bg-blue-500/20 text-blue-400"
          }`}>
            {task.priority}
          </span>
        </div>
        
        <p className="text-xs text-neutral-400 line-clamp-2 mb-4 flex-1">
          {task.description || "No description provided."}
        </p>
        
        <div className="flex flex-col gap-3 pt-3 border-t border-white/10 mt-auto">
          <div className="flex justify-between items-center">
            <select
              disabled={!canEdit}
              value={task.assigneeId || "UNASSIGNED"}
              onChange={(e) => onAssign(task.id, e.target.value)}
              className="bg-white/[0.04] border border-white/10 text-[10px] text-white rounded-lg px-2 py-1 focus:outline-none appearance-none disabled:opacity-50 max-w-[120px] truncate"
            >
              <option value="UNASSIGNED" className="bg-[#070B14]">Unassigned</option>
              {organizationMembers.map(m => (
                <option key={m.id} value={m.id} className="bg-[#070B14]">{m.name}</option>
              ))}
            </select>

            <div className="flex items-center gap-1">
              {canEdit && (
                <button 
                  onClick={() => onEdit(task)}
                  className="p-1.5 text-neutral-400 hover:text-[#22D3EE] hover:bg-[#22D3EE]/10 rounded-md transition-colors"
                  title="Edit Task"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
              {canDelete && (
                <button 
                  onClick={() => onDelete(task.id)}
                  className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                  title="Delete Task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
