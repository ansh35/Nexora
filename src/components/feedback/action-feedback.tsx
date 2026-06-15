"use client"

import { ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Check, AlertCircle } from "lucide-react"

export type ActionState = "idle" | "loading" | "success" | "error"

type ActionFeedbackProps = {
  state: ActionState
  loadingText?: string
  successText?: string
  errorText?: string
  idleText?: ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  type?: "button" | "submit" | "reset"
  variant?: "primary" | "secondary" | "danger"
}

export function ActionFeedback({
  state,
  loadingText = "Loading...",
  successText = "Success",
  errorText = "Error",
  idleText = "Submit",
  className = "",
  onClick,
  disabled = false,
  type = "button",
  variant = "primary"
}: ActionFeedbackProps) {

  const baseStyles = "relative overflow-hidden font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070B14]"
  
  const variants = {
    primary: "bg-[#22D3EE] hover:bg-[#06B6D4] text-[#070B14] focus-visible:ring-[#22D3EE]",
    secondary: "bg-white/[0.05] hover:bg-white/[0.1] text-white focus-visible:ring-white/20",
    danger: "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 focus-visible:ring-red-500"
  }

  // Override styles based on state
  let currentStyles = `${baseStyles} ${variants[variant]} ${className}`
  if (state === "success") {
    currentStyles = `${baseStyles} bg-green-500/20 text-green-400 border border-green-500/30 ${className}`
  } else if (state === "error") {
    currentStyles = `${baseStyles} bg-red-500/20 text-red-400 border border-red-500/30 ${className}`
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || state === "loading" || state === "success"}
      className={`${currentStyles} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      whileHover={disabled || state !== "idle" ? {} : { scale: 1.02 }}
      whileTap={disabled || state !== "idle" ? {} : { scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2"
          >
            {idleText}
          </motion.div>
        )}
        
        {state === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="w-5 h-5 animate-spin" />
            {loadingText}
          </motion.div>
        )}

        {state === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2, type: "spring" }}
            className="flex items-center gap-2"
          >
            <Check className="w-5 h-5" />
            {successText}
          </motion.div>
        )}

        {state === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2, type: "spring" }}
            className="flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5" />
            {errorText}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
