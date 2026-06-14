"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, Loader2 } from "lucide-react"
import { getActivities } from "@/actions/activity"
import { formatDistanceToNow } from "date-fns"
import { usePusher } from "@/components/providers/PusherProvider"

type Activity = {
  id: string
  action: string
  entityType: string
  entityId: string
  entityName: string
  createdAt: Date
  user: {
    name: string
    email: string
    image: string | null
  }
}

export function ActivityFeedPopover({ organizationId }: { organizationId?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(false)
  const [hasNew, setHasNew] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkNewActivity = async () => {
      try {
        const res = await getActivities(1, 1)
        if (res?.activities && res.activities.length > 0) {
          const latestActivity = res.activities[0] as Activity
          const lastSeen = localStorage.getItem("nexora_last_seen_activity")
          if (!lastSeen || new Date(latestActivity.createdAt) > new Date(lastSeen)) {
            setHasNew(true)
          }
        }
      } catch (error) {
        console.error("Failed to check new activity", error)
      }
    }
    checkNewActivity()
  }, [])

  const { pusherClient } = usePusher()

  useEffect(() => {
    if (!pusherClient || !organizationId) return

    const channel = pusherClient.subscribe(`private-org-${organizationId}`)

    channel.bind("new-activity", (activity: Activity) => {
      setHasNew(true)
      setActivities(prev => [activity, ...prev])
    })

    return () => {
      pusherClient.unsubscribe(`private-org-${organizationId}`)
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

  const fetchActivities = async () => {
    setLoading(true)
    const res = await getActivities(1, 10)
    if (res?.activities) {
      const fetchedActivities = res.activities as Activity[]
      setActivities(fetchedActivities)
      if (fetchedActivities.length > 0) {
        localStorage.setItem("nexora_last_seen_activity", new Date().toISOString())
      }
    }
    setLoading(false)
  }

  const togglePopover = () => {
    if (!isOpen) {
      fetchActivities()
      setHasNew(false)
    }
    setIsOpen(!isOpen)
  }

  const getEntityColor = (type: string) => {
    switch (type) {
      case "PROJECT": return "text-[#22D3EE]"
      case "TASK": return "text-purple-400"
      case "USER": return "text-green-400"
      case "ORGANIZATION": return "text-orange-400"
      default: return "text-neutral-400"
    }
  }

  return (
    <div className="relative" ref={popoverRef}>
      <button
        suppressHydrationWarning
        onClick={togglePopover}
        className="p-2.5 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white rounded-xl transition-colors border border-white/10 relative"
      >
        <Bell className="w-5 h-5" />
        {hasNew && (
          <span className="absolute top-2 right-2.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#070B14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-4">
          <div className="p-4 border-b border-white/10 bg-white/[0.02]">
            <h3 className="font-semibold text-white">Activity Log</h3>
          </div>
          
          <div className="max-h-[400px] overflow-y-auto p-2">
            {loading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="w-6 h-6 text-[#22D3EE] animate-spin" />
              </div>
            ) : activities.length === 0 ? (
              <div className="p-8 text-center text-sm text-neutral-500">
                No recent activity.
              </div>
            ) : (
              <div className="space-y-1">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex gap-3 p-3 hover:bg-white/[0.04] rounded-xl transition-colors">
                    <div className="w-8 h-8 rounded-full bg-white/10 shrink-0 flex items-center justify-center text-xs font-medium text-white overflow-hidden">
                      {activity.user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={activity.user.image} alt={activity.user.name} className="w-full h-full object-cover" />
                      ) : (
                        activity.user.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-neutral-300">
                        <span className="font-medium text-white">{activity.user.name}</span>{" "}
                        {activity.action.toLowerCase()}{" "}
                        <span className={`font-medium ${getEntityColor(activity.entityType)}`}>
                          {activity.entityName}
                        </span>
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="p-2 border-t border-white/10 bg-white/[0.02]">
            <a href="/dashboard/activity" className="block w-full py-2 text-center text-xs font-medium text-[#22D3EE] hover:bg-[#22D3EE]/10 rounded-lg transition-colors">
              View All Activity
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
