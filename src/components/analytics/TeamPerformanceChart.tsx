"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

type TeamPerformanceChartProps = {
  data: {
    name: string
    completed: number
  }[]
}

export function TeamPerformanceChart({ data }: TeamPerformanceChartProps) {
  // Sort by completed descending and take top 10
  const sortedData = [...data].sort((a, b) => b.completed - a.completed).slice(0, 10)

  return (
    <div className="bg-white/[0.05] border border-white/10 p-6 rounded-[24px] backdrop-blur-xl h-[400px]">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">Team Performance</h3>
        <p className="text-sm text-neutral-400">Top members by completed tasks</p>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
            <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={100} />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ backgroundColor: '#070B14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
            />
            <Bar dataKey="completed" name="Completed Tasks" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
