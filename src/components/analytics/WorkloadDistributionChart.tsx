"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

type WorkloadDistributionChartProps = {
  data: {
    name: string
    active: number
  }[]
}

export function WorkloadDistributionChart({ data }: WorkloadDistributionChartProps) {
  // Sort by active workload descending and take top 10
  const sortedData = [...data].sort((a, b) => b.active - a.active).slice(0, 10)

  return (
    <div className="bg-white/[0.05] border border-white/10 p-6 rounded-[24px] backdrop-blur-xl h-[400px]">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">Workload Distribution</h3>
        <p className="text-sm text-neutral-400">Members with highest active tasks</p>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ backgroundColor: '#070B14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
            />
            <Bar dataKey="active" name="Active Tasks" fill="#F43F5E" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
