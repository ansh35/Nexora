"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

type ProductivityChartProps = {
  data: {
    date: string
    completed: number
  }[]
}

export function ProductivityChart({ data }: ProductivityChartProps) {
  return (
    <div className="bg-white/[0.05] border border-white/10 p-6 rounded-[24px] backdrop-blur-xl h-[400px]">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">Productivity</h3>
        <p className="text-sm text-neutral-400">Tasks completed over the last 7 days</p>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis 
              dataKey="date" 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `${value}`} 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#070B14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
              itemStyle={{ color: '#22D3EE' }}
            />
            <Line 
              type="monotone" 
              dataKey="completed" 
              stroke="#22D3EE" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#070B14', strokeWidth: 2 }} 
              activeDot={{ r: 6, fill: '#22D3EE', stroke: '#070B14', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
