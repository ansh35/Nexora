"use client"

import { useState, useEffect } from "react"
import { Sparkles, ArrowRight, X } from "lucide-react"

type WelcomeOnboardingProps = {
  userName: string
  organizationName: string
  hasProjects: boolean
}

export function WelcomeOnboarding({ userName, organizationName, hasProjects }: WelcomeOnboardingProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Only show if user has no projects and hasn't dismissed it
    const hasDismissed = localStorage.getItem(`nexora_onboarding_dismissed_${organizationName}`)
    if (!hasProjects && !hasDismissed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOpen(true)
    }
  }, [hasProjects, organizationName])

  if (!isOpen) return null

  const handleDismiss = () => {
    localStorage.setItem(`nexora_onboarding_dismissed_${organizationName}`, "true")
    setIsOpen(false)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-[#070B14] border border-white/10 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#22D3EE]/20 blur-[120px] rounded-full pointer-events-none" />

        <button 
          onClick={handleDismiss}
          className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-white transition-colors rounded-full hover:bg-white/10 z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10 space-y-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-[#22D3EE] to-[#8B5CF6] rounded-2xl flex items-center justify-center p-[2px]">
            <div className="w-full h-full bg-[#070B14] rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-[#22D3EE]" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to Nexora, {userName}!</h2>
            <p className="text-neutral-400">
              You&apos;ve successfully joined <strong>{organizationName}</strong>. Let&apos;s get you set up and ready to boost your team&apos;s productivity.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
              <div className="w-8 h-8 rounded-full bg-[#22D3EE]/10 text-[#22D3EE] flex items-center justify-center font-bold text-sm shrink-0">1</div>
              <div>
                <h4 className="font-medium text-white">Create your first project</h4>
                <p className="text-sm text-neutral-500 mt-1">Organize your work by creating a project in the dashboard.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
              <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center font-bold text-sm shrink-0">2</div>
              <div>
                <h4 className="font-medium text-white">Invite your team</h4>
                <p className="text-sm text-neutral-500 mt-1">Go to the Team Directory to invite members to your workspace.</p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={handleDismiss}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#22D3EE] hover:bg-[#22D3EE]/90 text-black font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070B14] focus-visible:ring-[#22D3EE]"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
