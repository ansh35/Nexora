/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { parseMeetingNotes } from "@/actions/ai"
import { Button } from "@/components/ui/button"

export function MeetingNotesClient({ projects }: { projects: { id: string, name: string }[] }) {
  const [projectId, setProjectId] = useState(projects[0]?.id || "")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  const handleGenerate = async () => {
    if (!projectId || !notes) return
    setLoading(true)
    setError("")
    const res = await parseMeetingNotes(projectId, notes)
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
          <label className="block text-sm font-medium mb-2">Meeting Notes</label>
          <textarea 
            className="w-full min-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            placeholder="Paste your meeting notes here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <Button onClick={handleGenerate} disabled={loading || !notes || !projectId}>
          {loading ? "Parsing..." : "Extract Tasks"}
        </Button>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {result && (
        <div className="space-y-4 rounded-xl border border-[#22D3EE]/50 bg-[#22D3EE]/5 p-6">
          <h3 className="font-semibold text-lg text-[#22D3EE]">Extracted Tasks Preview</h3>
          <p className="text-sm text-neutral-400 mb-4">You can review these tasks. In a full implementation, you&apos;d click &apos;Save&apos; to add them to the DB.</p>
          <div className="grid gap-4">
            {result.map((task: any, idx: number) => (
              <div key={idx} className="rounded-lg bg-card p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-1 bg-white/10 rounded-md font-medium">{task.priority}</span>
                  <h4 className="font-medium">{task.title}</h4>
                </div>
                <p className="text-sm text-neutral-400">{task.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
