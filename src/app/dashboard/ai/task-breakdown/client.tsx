"use client"

import { useState } from "react"
import { generateTaskBreakdown } from "@/actions/ai"
import { Button } from "@/components/ui/button"

export function TaskBreakdownClient({ tasks }: { tasks: { id: string, title: string }[] }) {
  const [taskId, setTaskId] = useState(tasks[0]?.id || "")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  const handleGenerate = async () => {
    if (!taskId) return
    setLoading(true)
    setError("")
    const res = await generateTaskBreakdown(taskId)
    if (res.error) {
      setError(res.error)
    } else {
      setResult(res.data)
    }
    setLoading(false)
  }

  return (
    <div className="grid gap-6 max-w-4xl">
      <div className="space-y-4 rounded-xl border bg-card p-6">
        <div>
          <label className="block text-sm font-medium mb-2">Target Task</label>
          <select 
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            value={taskId} 
            onChange={(e) => setTaskId(e.target.value)}
          >
            {tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </div>

        <Button onClick={handleGenerate} disabled={loading || !taskId}>
          {loading ? "Breaking Down..." : "Break Down Task"}
        </Button>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {result && (
        <div className="space-y-4 rounded-xl border border-[#22D3EE]/50 bg-[#22D3EE]/5 p-6">
          <h3 className="font-semibold text-lg text-[#22D3EE]">Generated Subtasks</h3>
          <div className="grid gap-4">
            {result.map((subtask: any, idx: number) => (
              <div key={idx} className="rounded-lg bg-card p-4 border border-white/10">
                <h4 className="font-medium text-white mb-1">{subtask.title}</h4>
                <p className="text-sm text-neutral-400">{subtask.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
