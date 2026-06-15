"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ReactNode, Children, isValidElement } from "react"

export function AIFadeUpContainer({ children, className = "" }: { children: ReactNode, className?: string }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.05,
          }
        }
      }}
      className={className}
    >
      {Children.map(children, (child) => {
        if (!isValidElement(child)) return child
        return (
          <motion.div
            variants={
              shouldReduceMotion 
                ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
                : { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } } }
            }
          >
            {child}
          </motion.div>
        )
      })}
    </motion.div>
  )
}
