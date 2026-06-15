"use client"

import { useState } from "react"
import { generateSprint } from "@/actions/ai"
import { Button } from "@/components/ui/button"
import { AIFadeUpContainer } from "@/components/motion/ai-motion"

export function SprintGeneratorClient({ projects }: { projects: { id: string, name: string }[] }) {
  const [projectId, setProjectId] = useState(projects[0]?.id || "")
  const [focusArea, setFocusArea] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  const handleGenerate = async () => {
    if (!projectId || !focusArea) return
    setLoading(true)
    setError("")
    const res = await generateSprint(projectId, focusArea)
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
          <label className="block text-sm font-medium mb-2">Target Project</label>
          <select 
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            value={projectId} 
            onChange={(e) => setProjectId(e.target.value)}
          >
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Sprint Focus Area</label>
          <input 
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            placeholder="e.g. Bug fixes and performance improvements"
            value={focusArea}
            onChange={(e) => setFocusArea(e.target.value)}
          />
        </div>

        <Button onClick={handleGenerate} disabled={loading || !projectId || !focusArea}>
          {loading ? "Generating..." : "Generate Sprint"}
        </Button>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {result && (
        <div className="space-y-4 rounded-xl border border-[#22D3EE]/50 bg-[#22D3EE]/5 p-6">
          <h3 className="font-semibold text-lg text-[#22D3EE]">Proposed Sprint</h3>
          <p className="text-white/90 mb-4"><strong className="text-[#22D3EE]">Goal:</strong> {result.sprintGoal}</p>
          <AIFadeUpContainer className="grid gap-4">
            {result.tasks.map((task: any, idx: number) => (
              <div key={idx} className="rounded-lg bg-card p-4 border border-white/10 flex items-center justify-between">
                <h4 className="font-medium text-white">{task.title}</h4>
                <span className="text-xs px-2 py-1 bg-white/10 rounded-md font-medium">{task.priority}</span>
              </div>
            ))}
          </AIFadeUpContainer>
        </div>
      )}
    </div>
  )
}
