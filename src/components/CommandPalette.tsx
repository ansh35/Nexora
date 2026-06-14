"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, Folder, ListTodo, User, UserPlus, Users, Settings } from "lucide-react"
import { globalSearch } from "@/actions/search"
import { useRouter } from "next/navigation"

type ProjectType = { id: string; name: string; description: string | null; status: string }
type TaskType = { id: string; title: string; priority: string; status: string; projectId: string }
type MemberType = { id: string; name: string; email: string }

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<{
    projects: ProjectType[]
    tasks: TaskType[]
    members: MemberType[]
  }>({ projects: [], tasks: [], members: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen((prev) => {
          if (!prev) {
            setQuery("")
            setResults({ projects: [], tasks: [], members: [] })
          }
          return !prev
        })
      }
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  const handleNavigate = useCallback((path: string) => {
    setIsOpen(false)
    router.push(path)
  }, [router])

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim()) {
        setIsLoading(true)
        const res = await globalSearch(query)
        setResults(res)
        setSelectedIndex(0) // Reset selection on new search
        setIsLoading(false)
      } else {
        setResults({ projects: [], tasks: [], members: [] })
        setSelectedIndex(0)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const flattenResults = useCallback(() => {
    if (!query) {
      return [
        { type: "action", id: "action-invite", path: "/dashboard/team?invite=true" },
        { type: "action", id: "action-team", path: "/dashboard/team" },
        { type: "action", id: "action-settings", path: "/dashboard/settings" }
      ]
    }
    const flat: { type: string, id: string, path: string }[] = []
    results.projects.forEach(p => flat.push({ type: "project", id: p.id, path: `/dashboard/projects/${p.id}` }))
    results.tasks.forEach(t => flat.push({ type: "task", id: t.id, path: `/dashboard/projects/${t.projectId}` }))
    results.members.forEach(m => flat.push({ type: "member", id: m.id, path: "" })) // members don't navigate yet
    return flat
  }, [query, results])

  useEffect(() => {
    const handleNavigation = (e: KeyboardEvent) => {
      if (!isOpen) return
      const flat = flattenResults()
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % flat.length)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + flat.length) % flat.length)
      } else if (e.key === "Enter") {
        e.preventDefault()
        if (flat.length > 0) {
          const selected = flat[selectedIndex]
          if (selected.path) handleNavigate(selected.path)
        }
      }
    }
    window.addEventListener("keydown", handleNavigation)
    return () => window.removeEventListener("keydown", handleNavigation)
  }, [isOpen, selectedIndex, flattenResults, handleNavigate])

  if (!isOpen) return null

  const hasResults = results.projects.length > 0 || results.tasks.length > 0 || results.members.length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#070B14] border border-white/10 rounded-[24px] shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center px-4 border-b border-white/10 bg-white/[0.02]">
          <Search className="w-5 h-5 text-[#22D3EE]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, tasks, or members..."
            className="w-full bg-transparent border-none px-4 py-5 text-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-0"
          />
          {isLoading && <div className="text-xs text-neutral-500 mr-2">Searching...</div>}
          <span className="text-[10px] text-neutral-500 border border-white/10 bg-white/[0.05] rounded px-1.5 py-0.5">ESC</span>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!query && (
            <div className="p-2 space-y-1">
              <h3 className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 mt-2">Quick Actions</h3>
              <button
                onClick={() => handleNavigate(`/dashboard/team?invite=true`)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-left group ${selectedIndex === 0 ? "bg-white/[0.05]" : "hover:bg-white/[0.05]"}`}
              >
                <div className="p-2 bg-white/[0.05] rounded-lg group-hover:text-[#22D3EE] group-hover:bg-[#22D3EE]/10 transition-colors">
                  <UserPlus className="w-4 h-4 text-neutral-400 group-hover:text-[#22D3EE]" />
                </div>
                <div className="text-sm font-medium text-white">Invite Member</div>
              </button>
              <button
                onClick={() => handleNavigate(`/dashboard/team`)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-left group ${selectedIndex === 1 ? "bg-white/[0.05]" : "hover:bg-white/[0.05]"}`}
              >
                <div className="p-2 bg-white/[0.05] rounded-lg group-hover:text-[#22D3EE] group-hover:bg-[#22D3EE]/10 transition-colors">
                  <Users className="w-4 h-4 text-neutral-400 group-hover:text-[#22D3EE]" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white group-hover:text-[#22D3EE] transition-colors">Team Directory</div>
                  <div className="text-xs text-neutral-500">View team members</div>
                </div>
              </button>
              <button
                onClick={() => handleNavigate(`/dashboard/settings`)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-left group ${selectedIndex === 2 ? "bg-white/[0.05]" : "hover:bg-white/[0.05]"}`}
              >
                <div className="p-2 bg-white/[0.05] rounded-lg group-hover:text-[#22D3EE] group-hover:bg-[#22D3EE]/10 transition-colors">
                  <Settings className="w-4 h-4 text-neutral-400 group-hover:text-[#22D3EE]" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white group-hover:text-[#22D3EE] transition-colors">Account Settings</div>
                  <div className="text-xs text-neutral-500">Update your profile</div>
                </div>
              </button>
            </div>
          )}

          {query && !isLoading && !hasResults && (
            <div className="p-8 text-center text-neutral-500 text-sm">
              No results found for &quot;{query}&quot;
            </div>
          )}

          {results.projects.length > 0 && (
            <div className="mb-4">
              <h3 className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 mt-2">Projects</h3>
              {results.projects.map((p, idx) => {
                const globalIndex = idx;
                return (
                <button
                  key={p.id}
                  onClick={() => handleNavigate(`/dashboard/projects/${p.id}`)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-left group ${selectedIndex === globalIndex ? "bg-white/[0.05]" : "hover:bg-white/[0.05]"}`}
                >
                  <div className="p-2 bg-white/[0.05] rounded-lg group-hover:text-[#22D3EE] group-hover:bg-[#22D3EE]/10 transition-colors">
                    <Folder className="w-4 h-4 text-neutral-400 group-hover:text-[#22D3EE]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{p.name}</div>
                    {p.description && <div className="text-xs text-neutral-500 truncate max-w-md">{p.description}</div>}
                  </div>
                </button>
              )})}
            </div>
          )}

          {results.tasks.length > 0 && (
            <div className="mb-4">
              <h3 className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 mt-2">Tasks</h3>
              {results.tasks.map((t, idx) => {
                const globalIndex = results.projects.length + idx;
                return (
                <button
                  key={t.id}
                  onClick={() => handleNavigate(`/dashboard/projects/${t.projectId}`)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-left group ${selectedIndex === globalIndex ? "bg-white/[0.05]" : "hover:bg-white/[0.05]"}`}
                >
                  <div className="p-2 bg-white/[0.05] rounded-lg group-hover:text-[#22D3EE] group-hover:bg-[#22D3EE]/10 transition-colors">
                    <ListTodo className="w-4 h-4 text-neutral-400 group-hover:text-[#22D3EE]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white flex items-center gap-2">
                      {t.title}
                      <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full ${
                        t.priority === "HIGH" ? "bg-red-500/20 text-red-400" :
                        t.priority === "MEDIUM" ? "bg-orange-500/20 text-orange-400" :
                        "bg-blue-500/20 text-blue-400"
                      }`}>
                        {t.priority}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-500 flex gap-2">
                      <span>Status: {t.status}</span>
                    </div>
                  </div>
                </button>
              )})}
            </div>
          )}

          {results.members.length > 0 && (
            <div className="mb-2">
              <h3 className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 mt-2">Members</h3>
              {results.members.map((m, idx) => {
                const globalIndex = results.projects.length + results.tasks.length + idx;
                return (
                <div
                  key={m.id}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-left ${selectedIndex === globalIndex ? "bg-white/[0.05]" : "hover:bg-white/[0.02]"}`}
                >
                  <div className="p-2 bg-white/[0.05] rounded-lg">
                    <User className="w-4 h-4 text-neutral-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{m.name}</div>
                    <div className="text-xs text-neutral-500">{m.email}</div>
                  </div>
                </div>
              )})}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
