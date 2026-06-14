"use client"

import { useState } from "react"
import { generateTaskSummaries } from "@/actions/ai"
import { Button } from "@/components/ui/button"

export function TaskSummariesClient({ projects }: { projects: { id: string, name: string }[] }) {
  const [projectId, setProjectId] = useState(projects[0]?.id || "")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  const handleGenerate = async () => {
    if (!projectId) return
    setLoading(true)
    setError("")
    const res = await generateTaskSummaries(projectId)
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

        <Button onClick={handleGenerate} disabled={loading || !projectId}>
          {loading ? "Summarizing..." : "Generate Summary"}
        </Button>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {result && (
        <div className="space-y-6 rounded-xl border border-[#22D3EE]/50 bg-[#22D3EE]/5 p-6">
          <div>
            <h3 className="font-semibold text-lg text-[#22D3EE] mb-2">Project Summary</h3>
            <p className="text-white/90 leading-relaxed">{result.summary}</p>
          </div>
          
          {result.blockers && result.blockers.length > 0 && (
            <div>
              <h4 className="font-medium text-red-400 mb-2">Potential Blockers</h4>
              <ul className="list-disc pl-5 space-y-1 text-neutral-300">
                {result.blockers.map((b: string, i: number) => <li key={i}>{b}</li>)}
              </ul>
            </div>
          )}

          {result.nextSteps && result.nextSteps.length > 0 && (
            <div>
              <h4 className="font-medium text-[#22D3EE] mb-2">Next Steps</h4>
              <ul className="list-disc pl-5 space-y-1 text-neutral-300">
                {result.nextSteps.map((s: string, i: number) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
