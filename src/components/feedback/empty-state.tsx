"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"
import { FolderOpen, Search, Inbox, AlertCircle } from "lucide-react"

type EmptyStateProps = {
  icon?: "folder" | "search" | "inbox" | "alert" | ReactNode
  title: string
  description: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon = "folder", title, description, action, className = "" }: EmptyStateProps) {
  
  const renderIcon = () => {
    if (typeof icon !== "string") return icon
    
    const iconProps = { className: "w-12 h-12 text-neutral-500 mb-4" }
    switch (icon) {
      case "search": return <Search {...iconProps} />
      case "inbox": return <Inbox {...iconProps} />
      case "alert": return <AlertCircle {...iconProps} />
      case "folder":
      default:
        return <FolderOpen {...iconProps} />
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-white/[0.02] border border-white/5 rounded-[24px] p-12 flex flex-col items-center justify-center text-center ${className}`}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4, type: "spring" }}
        className="relative"
      >
        <div className="absolute inset-0 bg-[#22D3EE]/20 blur-2xl rounded-full" />
        {renderIcon()}
      </motion.div>
      
      <h3 className="text-xl font-medium text-white mb-2">{title}</h3>
      <p className="text-neutral-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </motion.div>
  )
}
