"use client"

import { useState, useTransition, useEffect, Suspense } from "react"
import { Search, Plus, Trash2, Mail, Shield, Clock, Copy, Check, MessageCircle, AlertCircle } from "lucide-react"
import { InviteModal } from "./InviteModal"
import { removeMember, updateRole, cancelInvitation } from "@/actions/team"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

type Member = { id: string; name: string; email: string; role: string; createdAt: Date }
type Invitation = { id: string; email: string; role: string; token: string; expiresAt: Date }

export function TeamDashboard({
  members,
  pendingInvitations,
  userRole,
  currentUserId,
  organizationName
}: {
  members: Member[]
  pendingInvitations: Invitation[]
  userRole: string
  currentUserId: string
  organizationName: string
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TeamDashboardContent members={members} pendingInvitations={pendingInvitations} userRole={userRole} currentUserId={currentUserId} organizationName={organizationName} />
    </Suspense>
  )
}

function TeamDashboardContent({
  members,
  pendingInvitations,
  userRole,
  currentUserId,
  organizationName
}: {
  members: Member[]
  pendingInvitations: Invitation[]
  userRole: string
  currentUserId: string
  organizationName: string
}) {
  const [activeTab, setActiveTab] = useState<"members" | "invites">("members")
  const [searchQuery, setSearchQuery] = useState("")
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [copiedToken, setCopiedToken] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (searchParams.get("invite") === "true") {
      // eslint-disable-next-line
      setIsInviteModalOpen(true)
    }
  }, [searchParams])

  const closeInviteModal = () => {
    setIsInviteModalOpen(false)
    if (searchParams.has("invite")) {
      router.replace(pathname, { scroll: false })
    }
  }

  const canInvite = userRole === "OWNER" || userRole === "ADMIN"
  const canManageRolesAndRemove = userRole === "OWNER"

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleRoleChange = (userId: string, newRole: string) => {
    startTransition(async () => {
      const res = await updateRole(userId, newRole)
      if (res?.error) alert(res.error)
    })
  }

  const handleRemove = (userId: string) => {
    if (confirm("Are you sure you want to remove this user from the organization?")) {
      startTransition(async () => {
        const res = await removeMember(userId)
        if (res?.error) alert(res.error)
      })
    }
  }

  const handleCancelInvite = (invitationId: string) => {
    if (confirm("Cancel this invitation?")) {
      startTransition(async () => {
        const res = await cancelInvitation(invitationId)
        if (res?.error) alert(res.error)
      })
    }
  }

  const getBaseUrl = () => {
    if (typeof window !== "undefined") return window.location.origin
    if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
    return "http://localhost:3000"
  }

  const copyToClipboard = (token: string) => {
    const url = `${getBaseUrl()}/invite/accept?token=${token}`
    navigator.clipboard.writeText(url)
    setCopiedToken(token)
    setTimeout(() => setCopiedToken(null), 2000)
  }

  const shareWhatsApp = (token: string, role: string) => {
    const url = `${getBaseUrl()}/invite/accept?token=${token}`
    const text = `You've been invited to join ${organizationName} on Nexora as a ${role}.\n\nOpen this invitation link:\n\n${url}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-4 border-b border-white/10 flex-1">
          <button
            onClick={() => setActiveTab("members")}
            className={`pb-3 px-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "members" ? "border-[#22D3EE] text-white" : "border-transparent text-neutral-500 hover:text-neutral-300"
            }`}
          >
            Members ({members.length})
          </button>
          {canInvite && (
            <button
              onClick={() => setActiveTab("invites")}
              className={`pb-3 px-2 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
                activeTab === "invites" ? "border-[#22D3EE] text-white" : "border-transparent text-neutral-500 hover:text-neutral-300"
              }`}
            >
              Pending Invites
              {pendingInvitations.length > 0 && (
                <span className="bg-white/10 text-xs px-1.5 rounded-full">{pendingInvitations.length}</span>
              )}
            </button>
          )}
        </div>

        {canInvite && (
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="bg-[#22D3EE] hover:bg-[#06B6D4] text-[#070B14] font-semibold py-2 px-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Invite User
          </button>
        )}
      </div>

      {activeTab === "members" && (
        <div className="space-y-4">
          <div className="relative max-w-md mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/50 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredMembers.map(member => (
              <div key={member.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-semibold">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white flex items-center gap-2">
                      {member.name}
                      {member.id === currentUserId && (
                        <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-neutral-300">You</span>
                      )}
                    </h3>
                    <p className="text-xs text-neutral-400">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Shield className={`w-3.5 h-3.5 ${member.role === 'OWNER' ? 'text-red-400' : member.role === 'ADMIN' ? 'text-orange-400' : 'text-blue-400'}`} />
                    <select
                      value={member.role}
                      disabled={!canManageRolesAndRemove || member.id === currentUserId || isPending}
                      onChange={(e) => handleRoleChange(member.id, e.target.value)}
                      className="bg-transparent border-none text-sm text-neutral-300 focus:ring-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="MEMBER" className="bg-[#070B14]">Member</option>
                      <option value="ADMIN" className="bg-[#070B14]">Admin</option>
                      <option value="OWNER" className="bg-[#070B14]">Owner</option>
                    </select>
                  </div>

                  {canManageRolesAndRemove && member.id !== currentUserId && (
                    <button
                      onClick={() => handleRemove(member.id)}
                      disabled={isPending}
                      className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      title="Remove Member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "invites" && canInvite && (
        <div className="space-y-4">
          {pendingInvitations.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 text-sm">
              No pending invitations.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingInvitations.map(invite => (
                <div key={invite.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-full">
                      <Mail className="w-4 h-4 text-neutral-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">{invite.email}</h3>
                      <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                        <span className="uppercase">{invite.role}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Expires {new Date(invite.expiresAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => shareWhatsApp(invite.token, invite.role)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] text-xs rounded-lg transition-colors"
                      title="Share via WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Share
                    </button>
                    <button
                      onClick={() => copyToClipboard(invite.token)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs rounded-lg transition-colors"
                    >
                      {copiedToken === invite.token ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedToken === invite.token ? "Copied" : "Copy Link"}
                    </button>
                    <button
                      onClick={() => handleCancelInvite(invite.id)}
                      disabled={isPending}
                      className="px-3 py-1.5 text-red-400 hover:bg-red-400/10 text-xs rounded-lg transition-colors"
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <InviteModal 
        isOpen={isInviteModalOpen} 
        onClose={closeInviteModal} 
        userRole={userRole}
      />
    </div>
  )
}
