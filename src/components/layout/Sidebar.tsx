"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  FolderKanban, 
  ListTodo, 
  KanbanSquare, 
  Users, 
  Activity, 
  BarChart3, 
  Bell, 
  Settings, 
  CreditCard,
  Menu, 
  X, 
  LogOut,
  Sparkles
} from "lucide-react"

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { name: "Tasks", href: "/dashboard/tasks", icon: ListTodo },
  { name: "Kanban", href: "/dashboard/kanban", icon: KanbanSquare },
  { name: "Team", href: "/dashboard/team", icon: Users },
  { name: "Activity", href: "/dashboard/activity", icon: Activity },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "AI Tools", href: "/dashboard/ai", icon: Sparkles },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Close sidebar on mobile when path changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-[60]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl text-white hover:bg-white/20 transition-colors"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 z-[50] bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed top-0 left-0 h-full w-[280px] z-[55] bg-[#070B14]/80 backdrop-blur-2xl border-r border-white/10 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10 pl-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#22D3EE] to-[#06B6D4] flex items-center justify-center font-bold text-black">
              N
            </div>
            <span className="text-xl font-bold tracking-wide text-white">Nexora</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group border ${
                    isActive
                      ? "bg-[#22D3EE]/10 text-[#22D3EE] font-medium border-[#22D3EE]/20 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                      : "text-neutral-400 hover:bg-white/[0.06] hover:text-white border-transparent hover:border-white/10"
                  }`}
                >
                  <Icon 
                    className={`w-5 h-5 transition-colors ${
                      isActive ? "text-[#22D3EE]" : "text-neutral-500 group-hover:text-white"
                    }`} 
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>
    </>
  )
}
