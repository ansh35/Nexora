"use client"

import { useState } from "react"
import { detectProjectRisks } from "@/actions/ai"
import { Button } from "@/components/ui/button"

export function RiskDetectionClient({ projects }: { projects: { id: string, name: string }[] }) {
  const [projectId, setProjectId] = useState(projects[0]?.id || "")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  const handleGenerate = async () => {
    if (!projectId) return
    setLoading(true)
    setError("")
    const res = await detectProjectRisks(projectId)
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
          {loading ? "Analyzing..." : "Detect Risks"}
        </Button>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {result && (
        <div className="space-y-4 rounded-xl border border-red-500/50 bg-red-500/5 p-6">
          <h3 className="font-semibold text-lg text-red-500">Detected Risks</h3>
          <div className="grid gap-4">
            {result.map((risk: any, idx: number) => (
              <div key={idx} className="rounded-lg bg-card p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-1 rounded-md font-medium ${risk.severity === 'HIGH' ? 'bg-red-500/20 text-red-500' : risk.severity === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>{risk.severity}</span>
                  <h4 className="font-medium text-white">{risk.title}</h4>
                </div>
                <p className="text-sm text-neutral-400"><strong className="text-white/80">Mitigation:</strong> {risk.mitigation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
