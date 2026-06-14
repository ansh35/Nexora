"use client"

import { Activity, CheckCircle, FolderKanban, Target } from "lucide-react"

type OverviewProps = {
  data: {
    totalTasks: number
    completedTasks: number
    completionRate: number
    activeProjects: number
  }
}

export function OverviewMetrics({ data }: OverviewProps) {
  const metrics = [
    {
      title: "Total Tasks",
      value: data.totalTasks,
      icon: Activity,
      color: "text-blue-400",
      bg: "bg-blue-400/10"
    },
    {
      title: "Completed",
      value: data.completedTasks,
      icon: CheckCircle,
      color: "text-green-400",
      bg: "bg-green-400/10"
    },
    {
      title: "Completion Rate",
      value: `${data.completionRate}%`,
      icon: Target,
      color: "text-purple-400",
      bg: "bg-purple-400/10"
    },
    {
      title: "Active Projects",
      value: data.activeProjects,
      icon: FolderKanban,
      color: "text-orange-400",
      bg: "bg-orange-400/10"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((m, i) => (
        <div key={i} className="bg-white/[0.05] border border-white/10 p-6 rounded-[24px] backdrop-blur-xl hover:bg-white/[0.08] transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-neutral-400">{m.title}</h3>
            <div className={`p-2 rounded-xl ${m.bg}`}>
              <m.icon className={`w-5 h-5 ${m.color}`} />
            </div>
          </div>
          <p className="text-3xl font-semibold text-white">{m.value}</p>
        </div>
      ))}
    </div>
  )
}
