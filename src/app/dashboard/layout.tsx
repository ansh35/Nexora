import { CommandPalette } from "@/components/CommandPalette"
import { Sidebar } from "@/components/layout/Sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[#070B14] w-full">
      <CommandPalette />
      <Sidebar />
      <div className="flex-1 md:ml-[280px] w-full max-w-[100vw] overflow-x-hidden">
        {children}
      </div>
    </div>
  )
}
