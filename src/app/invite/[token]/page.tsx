import { auth } from "@/../auth"
import prisma from "@/lib/prisma"

import Link from "next/link"
import { Shield, Building2 } from "lucide-react"
import { AcceptInviteButton } from "@/components/team/AcceptInviteButton"

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const session = await auth()

  const invitation = await prisma.invitation.findUnique({
    where: { token: token },
    include: { organization: true, inviter: true }
  })

  if (!invitation) {
    return (
      <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center p-4">
        <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[24px] max-w-md w-full text-center backdrop-blur-xl">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Invalid Invitation</h1>
          <p className="text-neutral-400 mb-6">This invitation link is invalid or has been cancelled.</p>
          <Link href="/" className="inline-block bg-[#22D3EE] text-[#070B14] font-semibold px-6 py-3 rounded-xl transition-colors hover:bg-[#06B6D4]">
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  if (invitation.expiresAt < new Date()) {
    return (
      <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center p-4">
        <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[24px] max-w-md w-full text-center backdrop-blur-xl">
          <Shield className="w-12 h-12 text-orange-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Invitation Expired</h1>
          <p className="text-neutral-400 mb-6">This invitation link has expired. Please ask your administrator for a new one.</p>
          <Link href="/" className="inline-block bg-[#22D3EE] text-[#070B14] font-semibold px-6 py-3 rounded-xl transition-colors hover:bg-[#06B6D4]">
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center p-4">
      <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[24px] max-w-md w-full text-center backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#22D3EE] to-blue-500"></div>
        
        <div className="w-16 h-16 bg-[#22D3EE]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Building2 className="w-8 h-8 text-[#22D3EE]" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">You&apos;ve been invited!</h1>
        <p className="text-neutral-400 mb-8">
          <span className="text-white font-medium">{invitation.inviter.name}</span> has invited you to join <span className="text-white font-medium">{invitation.organization.name}</span> as a <span className="uppercase">{invitation.role}</span>.
        </p>

        {session ? (
          session.user.email === invitation.email ? (
            <AcceptInviteButton token={invitation.token} />
          ) : (
            <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl text-sm text-orange-400">
              This invitation was sent to <strong>{invitation.email}</strong>, but you are logged in as <strong>{session.user.email}</strong>. Please log in with the correct account.
            </div>
          )
        ) : (
          <div className="space-y-4">
            <Link href="/login" className="block w-full bg-[#22D3EE] hover:bg-[#06B6D4] text-[#070B14] font-semibold px-6 py-3 rounded-xl transition-colors">
              Log In to Accept
            </Link>
            <Link href="/register" className="block w-full bg-white/[0.05] hover:bg-white/[0.1] text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              Create an Account
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
