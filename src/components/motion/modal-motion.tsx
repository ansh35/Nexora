"use client"

import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { ReactNode } from "react"

interface ModalMotionProps {
  isOpen: boolean
  onClose?: () => void
  children: ReactNode
  className?: string
  position?: "center" | "top"
}

export function ModalMotion({ isOpen, onClose, children, className = "", position = "center" }: ModalMotionProps) {
  const shouldReduceMotion = useReducedMotion()

  const positionClass = position === "center" 
    ? "items-center justify-center p-4" 
    : "items-start justify-center px-4 pb-4"

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className={`fixed inset-0 z-[100] flex ${positionClass}`}
          style={position === "top" ? { paddingTop: "15vh" } : undefined}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal Container */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`relative z-10 ${className}`}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
