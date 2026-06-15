import { LucideIcon } from "lucide-react"

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white/[0.05] border border-white/10 hover:border-white/20 hover:bg-white/[0.06] shadow-[0_0_40px_rgba(34,211,238,0.12)] rounded-[24px] backdrop-blur-xl animate-in fade-in duration-500">
      <div className="w-16 h-16 bg-white/[0.08] rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-neutral-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-neutral-400 text-sm max-w-md mx-auto mb-6">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  )
}
