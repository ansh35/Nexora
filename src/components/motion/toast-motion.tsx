"use client"

import { motion, useReducedMotion } from "framer-motion"
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react"

export type ToastType = "success" | "error" | "info"

export interface ToastData {
  id: string
  title: string
  description?: string
  type: ToastType
}

interface ToastMotionProps {
  toast: ToastData
  onClose: () => void
}

export function ToastMotion({ toast, onClose }: ToastMotionProps) {
  const shouldReduceMotion = useReducedMotion()

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#22D3EE]" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
  }

  return (
    <motion.div
      layout
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 50 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 50, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="w-full max-w-sm bg-[#070B14] border border-white/10 rounded-xl shadow-2xl p-4 flex items-start gap-3 relative overflow-hidden"
    >
      <div className="shrink-0 pt-0.5">{icons[toast.type]}</div>
      <div className="flex-1 pr-6">
        <h4 className="text-sm font-semibold text-white">{toast.title}</h4>
        {toast.description && (
          <p className="text-xs text-neutral-400 mt-1">{toast.description}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}
