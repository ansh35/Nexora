"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { signOut } from "next-auth/react"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const tabs = [
    { name: "Profile", href: "/dashboard/settings/profile" },
    { name: "Security", href: "/dashboard/settings/security" },
    { name: "Preferences", href: "/dashboard/settings/preferences" },
  ]

  return (
    <div className="min-h-screen bg-[#070B14] p-8 text-white font-sans w-full">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="relative z-50 flex items-center justify-between bg-white/[0.04] p-6 rounded-[24px] border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard"
              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-neutral-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Account Settings</h1>
              <p className="text-neutral-400">Manage your profile, security, and preferences.</p>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-2">
            <nav className="flex flex-col space-y-1">
              {tabs.map((tab) => {
                const isActive = pathname === tab.href
                return (
                  <Link 
                    key={tab.href}
                    href={tab.href} 
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      isActive 
                        ? "bg-white/10 text-white" 
                        : "text-neutral-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {tab.name}
                  </Link>
                )
              })}
              <div className="pt-4 mt-4 border-t border-white/10">
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full text-left px-4 py-2 rounded-lg font-medium transition-colors text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  Sign Out
                </button>
              </div>
            </nav>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-white/[0.04] border border-white/10 rounded-[24px] p-6 backdrop-blur-xl space-y-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
