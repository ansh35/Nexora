"use client"

import { motion } from "framer-motion"

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-white/[0.03] border border-white/5 rounded-[24px] p-6 h-full flex flex-col ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <SkeletonLine width="w-1/2" height="h-6" />
        <SkeletonLine width="w-16" height="h-5" className="rounded-full" />
      </div>
      <SkeletonLine width="w-full" className="mb-2" />
      <SkeletonLine width="w-3/4" className="mb-6" />
      
      <div className="mt-auto pt-4 border-t border-white/10 flex justify-between">
        <SkeletonLine width="w-24" />
        <div className="flex gap-2">
          <SkeletonLine width="w-8" height="h-8" className="rounded-lg" />
          <SkeletonLine width="w-8" height="h-8" className="rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonLine({ width = "w-full", height = "h-4", className = "" }: { width?: string, height?: string, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", repeatType: "reverse" }}
      className={`${width} ${height} bg-white/10 rounded-md overflow-hidden relative ${className}`}
    >
      <motion.div 
        initial={{ x: "-100%" }}
        animate={{ x: "200%" }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-full h-full"
      />
    </motion.div>
  )
}

export function SkeletonGrid({ count = 3, className = "" }: { count?: number, className?: string }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
