"use client"

import { AnalyticsData } from "@/actions/analytics"
import { OverviewMetrics } from "./OverviewMetrics"
import { ProductivityChart } from "./ProductivityChart"
import { ProjectHealthChart } from "./ProjectHealthChart"
import { KanbanInsightsChart } from "./KanbanInsightsChart"
import { TeamPerformanceChart } from "./TeamPerformanceChart"
import { WorkloadDistributionChart } from "./WorkloadDistributionChart"

type AnalyticsDashboardProps = {
  data: AnalyticsData
  userRole: string
}

export function AnalyticsDashboard({ data, userRole }: AnalyticsDashboardProps) {
  const isMember = userRole === "MEMBER"

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <OverviewMetrics data={data.overview} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductivityChart data={data.productivity} />
        <KanbanInsightsChart data={data.kanbanInsights} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ProjectHealthChart data={data.projectHealth} />
      </div>

      {!isMember && data.teamPerformance && data.workloadDistribution && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TeamPerformanceChart data={data.teamPerformance} />
          <WorkloadDistributionChart data={data.workloadDistribution} />
        </div>
      )}
    </div>
  )
}
