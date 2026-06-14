"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"

type ProjectHealthChartProps = {
  data: {
    name: string
    todo: number
    inProgress: number
    done: number
  }[]
}

export function ProjectHealthChart({ data }: ProjectHealthChartProps) {
  return (
    <div className="bg-white/[0.05] border border-white/10 p-6 rounded-[24px] backdrop-blur-xl h-[400px]">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">Project Health</h3>
        <p className="text-sm text-neutral-400">Task status distribution across active projects</p>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
            <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={100} />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ backgroundColor: '#070B14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="todo" name="To Do" stackId="a" fill="#64748B" radius={[0, 0, 0, 0]} />
            <Bar dataKey="inProgress" name="In Progress" stackId="a" fill="#3B82F6" radius={[0, 0, 0, 0]} />
            <Bar dataKey="done" name="Done" stackId="a" fill="#10B981" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
