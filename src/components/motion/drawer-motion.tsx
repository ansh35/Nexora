"use client"

import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { ReactNode } from "react"

interface DrawerMotionProps {
  isOpen: boolean
  onClose?: () => void
  children: ReactNode
  className?: string
}

export function DrawerMotion({ isOpen, onClose, children, className = "" }: DrawerMotionProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Drawer Container */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: "100%" }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: "100%" }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={`relative z-10 h-full ${className}`}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
