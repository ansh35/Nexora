/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { generateProjectPlan } from "@/actions/ai"
import { Button } from "@/components/ui/button"

export function ProjectPlannerClient() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  const handleGenerate = async () => {
    if (!name || !description) return
    setLoading(true)
    setError("")
    const res = await generateProjectPlan(name, description)
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
          <label className="block text-sm font-medium mb-2">Project Name</label>
          <input 
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            placeholder="e.g. Q3 Marketing Campaign"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Project Description</label>
          <textarea 
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            placeholder="Briefly describe the goals and scope of the project..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <Button onClick={handleGenerate} disabled={loading || !name || !description}>
          {loading ? "Planning..." : "Generate Plan"}
        </Button>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {result && (
        <div className="space-y-6 rounded-xl border border-[#22D3EE]/50 bg-[#22D3EE]/5 p-6">
          <h3 className="font-semibold text-lg text-[#22D3EE]">Proposed Project Plan</h3>
          <div className="space-y-6">
            {result.map((phase: any, idx: number) => (
              <div key={idx} className="rounded-lg bg-card p-4 border border-white/10">
                <h4 className="font-medium text-white mb-1">{phase.name}</h4>
                <p className="text-sm text-neutral-400 mb-4">{phase.description}</p>
                <div className="pl-4 border-l-2 border-[#22D3EE]/20 space-y-2">
                  {phase.tasks.map((task: string, tIdx: number) => (
                    <div key={tIdx} className="text-sm text-neutral-300 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]" />
                      {task}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
