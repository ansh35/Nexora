import Link from "next/link"
import { Sparkles, FileText, LayoutList, Calendar, ShieldAlert, ListChecks, FolderTree } from "lucide-react"

const AI_TOOLS = [
  {
    name: "Project Planner",
    description: "Generate a comprehensive phase-by-phase plan for a new project.",
    href: "/dashboard/ai/project-planner",
    icon: FolderTree,
  },
  {
    name: "Task Breakdown",
    description: "Automatically break down complex tasks into smaller, actionable subtasks.",
    href: "/dashboard/ai/task-breakdown",
    icon: ListChecks,
  },
  {
    name: "Meeting Notes Parser",
    description: "Extract actionable tasks directly from your meeting notes.",
    href: "/dashboard/ai/meeting-notes",
    icon: FileText,
  },
  {
    name: "Sprint Generator",
    description: "Plan your next sprint effortlessly by analyzing your backlog.",
    href: "/dashboard/ai/sprint-generator",
    icon: Calendar,
  },
  {
    name: "Task Summaries",
    description: "Get a quick summary of a project's overall progress and next steps.",
    href: "/dashboard/ai/task-summaries",
    icon: LayoutList,
  },
  {
    name: "Risk Detection",
    description: "Analyze project tasks to identify and mitigate potential risks.",
    href: "/dashboard/ai/risk-detection",
    icon: ShieldAlert,
  },
]

export default function AIToolsPage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center gap-3 space-y-2">
        <Sparkles className="w-8 h-8 text-[#22D3EE]" />
        <h2 className="text-3xl font-bold tracking-tight">AI Productivity Assistant</h2>
      </div>
      
      <p className="text-neutral-400 max-w-2xl text-lg">
        Supercharge your workflow with our suite of AI tools. Select a tool below to get started.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {AI_TOOLS.map((tool) => {
          const Icon = tool.icon
          return (
            <Link 
              key={tool.href} 
              href={tool.href}
              className="group bg-white/[0.05] border border-white/10 hover:border-white/20 hover:bg-white/[0.06] shadow-[0_0_40px_rgba(34,211,238,0.12)] p-6 rounded-[24px] backdrop-blur-xl transition-all duration-300 flex flex-col h-full"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg bg-[#22D3EE]/10 text-[#22D3EE] group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg">{tool.name}</h3>
              </div>
              <p className="text-neutral-400 text-sm">
                {tool.description}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
