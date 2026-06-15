/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState, useRef } from "react"
import { usePusher } from "@/components/providers/PusherProvider"
import { Users, X } from "lucide-react"

type ActiveMember = {
  id: string
  info: {
    name: string
    email: string
  }
}

export function ActiveUsers({ organizationId }: { organizationId: string }) {
  const { pusherClient } = usePusher()
  const [members, setMembers] = useState<ActiveMember[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!pusherClient) return

    const channel = pusherClient.subscribe(`presence-org-${organizationId}`)

    channel.bind("pusher:subscription_succeeded", (members: any) => {
      const activeMembers: ActiveMember[] = []
      members.each((member: any) => {
        activeMembers.push({ id: member.id, info: member.info })
      })
      setMembers(activeMembers)
    })

    channel.bind("pusher:member_added", (member: any) => {
      setMembers(prev => [...prev.filter(m => m.id !== member.id), { id: member.id, info: member.info }])
    })

    channel.bind("pusher:member_removed", (member: any) => {
      setMembers(prev => prev.filter(m => m.id !== member.id))
    })

    return () => {
      pusherClient.unsubscribe(`presence-org-${organizationId}`)
    }
  }, [pusherClient, organizationId])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (members.length === 0) return null

  return (
    <div className="relative" ref={popoverRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] transition-colors border border-white/10 rounded-full cursor-pointer"
      >
        <div className="relative flex items-center">
          <div className="w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse absolute -left-3" />
          <Users className="w-4 h-4 text-neutral-400 mr-2" />
          <span className="text-xs font-medium text-neutral-300">
            {members.length} Online
          </span>
        </div>
        <div className="flex -space-x-2">
          {members.slice(0, 3).map(m => (
            <div 
              key={m.id} 
              className="w-6 h-6 rounded-full bg-[#070B14] border-2 border-[#22D3EE]/30 flex items-center justify-center text-[10px] font-bold text-white relative group"
              title={m.info.name}
            >
              {m.info.name.charAt(0).toUpperCase()}
            </div>
          ))}
          {members.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-white/[0.1] border-2 border-transparent flex items-center justify-center text-[10px] font-bold text-white">
              +{members.length - 3}
            </div>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-3 w-64 bg-[#070B14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-4">
          <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
            <h3 className="font-semibold text-white text-sm">Active Members</h3>
            <button onClick={() => setIsOpen(false)} className="text-neutral-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
            {members.map(member => (
              <div key={member.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.04] transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#22D3EE]/20 to-[#8B5CF6]/20 border border-[#22D3EE]/30 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {member.info.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-white font-medium truncate">{member.info.name}</p>
                  <p className="text-xs text-neutral-400 truncate">{member.info.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
