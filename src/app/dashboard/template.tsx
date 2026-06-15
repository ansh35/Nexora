"use client"

import { PageTransition } from "@/components/motion/page-transition"

export default function DashboardTemplate({ children }: { children: React.ReactNode }) {
  return <PageTransition className="w-full h-full flex flex-col flex-1">{children}</PageTransition>
}
