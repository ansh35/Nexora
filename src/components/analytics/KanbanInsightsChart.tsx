"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"

type KanbanInsightsChartProps = {
  data: {
    name: string
    value: number
  }[]
}

const COLORS = ['#64748B', '#3B82F6', '#10B981']

export function KanbanInsightsChart({ data }: KanbanInsightsChartProps) {
  return (
    <div className="bg-white/[0.05] border border-white/10 p-6 rounded-[24px] backdrop-blur-xl h-[400px]">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">Kanban Insights</h3>
        <p className="text-sm text-neutral-400">Total tasks by status</p>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#070B14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
