"use client"
// Force cache refresh

import { useState, useTransition } from "react"
import { Loader2, X, Copy, Check, MessageCircle, AlertCircle } from "lucide-react"
import { inviteMember } from "@/actions/team"
import { DrawerMotion } from "@/components/motion/drawer-motion"
import { useMotion } from "@/components/motion/motion-provider"
import { ActionFeedback, ActionState } from "@/components/feedback/action-feedback"

export function InviteModal({ isOpen, onClose, userRole }: { isOpen: boolean; onClose: () => void; userRole: string }) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("MEMBER")
  const [error, setError] = useState("")
  const [successToken, setSuccessToken] = useState<string | null>(null)
  const [orgName, setOrgName] = useState("")
  const [copied, setCopied] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [buttonState, setButtonState] = useState<ActionState>("idle")
  const { toast } = useMotion()



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!email.trim()) {
      setError("Email address is required")
      return
    }

    setButtonState("loading")
    startTransition(async () => {
      const result = await inviteMember(email, role)
      if (result.error) {
        setError(result.error)
        setButtonState("error")
        setTimeout(() => setButtonState("idle"), 3000)
      } else if (result.token) {
        setSuccessToken(result.token)
        setOrgName(result.organizationName || "the workspace")
        toast({
          title: "Invite Created",
          description: "The invitation link is ready to be shared.",
          type: "success"
        })
        setButtonState("success")
        // Don't auto-reset state or close, because we need to show the success view with the link
      }
    })
  }

  const getBaseUrl = () => {
    if (typeof window !== "undefined") return window.location.origin
    if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
    return "http://localhost:3000"
  }

  const inviteLink = successToken ? `${getBaseUrl()}/invite/accept?token=${successToken}` : ""

  const copyLink = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareWhatsApp = () => {
    const text = `You've been invited to join ${orgName} on Nexora as a ${role}.\n\nOpen this invitation link:\n\n${inviteLink}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank")
  }

  const handleClose = () => {
    setEmail("")
    setRole("MEMBER")
    setError("")
    setSuccessToken(null)
    setOrgName("")
    setButtonState("idle")
    onClose()
  }

  return (
    <DrawerMotion 
      isOpen={isOpen} 
      onClose={handleClose} 
      className="w-full max-w-md bg-[#070B14] border border-white/[0.08] rounded-[24px] shadow-[0_0_40px_rgba(34,211,238,0.12)] overflow-hidden flex flex-col relative"
    >
        <div className="flex items-center justify-between p-6 border-b border-white/[0.08] bg-white/[0.02]">
          <h2 className="text-xl font-bold text-white">Invite Team Member</h2>
          <button onClick={handleClose} className="text-neutral-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {successToken ? (
          <div className="p-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-medium text-white">Invitation Created</h3>
              <p className="text-sm text-neutral-400">
                The invitation for <strong>{email}</strong> is ready.
              </p>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/20 p-3 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
              <div className="text-xs text-orange-200">
                Email delivery is limited during development. Use Copy Link or WhatsApp Share for demonstrations.
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between gap-3 overflow-hidden">
                <span className="text-xs text-neutral-300 truncate select-all">{inviteLink}</span>
                <button 
                  onClick={copyLink}
                  className="shrink-0 p-2 bg-[#22D3EE]/10 text-[#22D3EE] hover:bg-[#22D3EE]/20 rounded-lg transition-colors flex items-center gap-2 text-xs font-medium"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              <button
                onClick={shareWhatsApp}
                className="w-full bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Share via WhatsApp
              </button>
            </div>

            <button
              onClick={handleClose}
              className="w-full bg-white/[0.05] hover:bg-white/[0.1] text-white font-medium py-3 rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Email Address</label>
              <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
              placeholder="colleague@company.com"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/50 transition-all"
            />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Role</label>
              <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isPending}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/50 transition-all appearance-none"
            >
                <option value="MEMBER" className="bg-[#070B14]">Member (View Only)</option>
                <option value="ADMIN" className="bg-[#070B14]">Admin (Manage Projects)</option>
                {userRole === "OWNER" && (
                  <option value="OWNER" className="bg-[#070B14]">Owner (Full Access)</option>
                )}
              </select>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isPending || buttonState === "loading"}
                className="flex-1 bg-white/[0.05] hover:bg-white/[0.1] text-white font-medium py-3 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <ActionFeedback
                type="submit"
                state={buttonState}
                disabled={isPending}
                className="flex-1"
                idleText="Generate Link"
                loadingText="Generating..."
                successText="Generated!"
                errorText="Failed"
              />
            </div>
          </form>
        )}
      </DrawerMotion>
  )
}
