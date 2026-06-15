"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, Loader2, Check, CheckCircle2 } from "lucide-react"
import { getNotifications, markAsRead, markAllAsRead } from "@/actions/notifications"
import { formatDistanceToNow } from "date-fns"
import { usePusher } from "@/components/providers/PusherProvider"

type Notification = {
  id: string
  type: string
  message: string
  read: boolean
  createdAt: Date
}

export function NotificationPopover({ userId }: { userId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const { pusherClient } = usePusher()

  const fetchNotifications = async () => {
    setLoading(true)
    const res = await getNotifications()
    if (res && !res.error) {
      setNotifications(res.notifications as Notification[])
      setUnreadCount(res.unreadCount || 0)
    }
    setLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line
    fetchNotifications()
    // Poll every 60s as a fallback
    const interval = setInterval(fetchNotifications, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!pusherClient || !userId) return

    const channel = pusherClient.subscribe(`private-user-${userId}`)

    channel.bind("new-notification", (notification: Notification) => {
      setNotifications(prev => [notification, ...prev])
      setUnreadCount(prev => prev + 1)
    })

    return () => {
      pusherClient.unsubscribe(`private-user-${userId}`)
    }
  }, [pusherClient, userId])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleToggle = () => {
    if (!isOpen) {
      // eslint-disable-next-line
    fetchNotifications()
    }
    setIsOpen(!isOpen)
  }

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    await markAsRead(id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  return (
    <div className="relative" ref={popoverRef}>
      <button
        suppressHydrationWarning
        onClick={handleToggle}
        className="p-2.5 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white rounded-xl transition-colors border border-white/10 relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-[#070B14]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#070B14] border border-white/[0.08] rounded-[24px] shadow-[0_0_40px_rgba(34,211,238,0.12)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-4">
          <div className="p-4 border-b border-white/[0.08] bg-white/[0.02] flex items-center justify-between">
            <h3 className="font-semibold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-xs text-[#22D3EE] hover:underline flex items-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto p-2">
            {loading && notifications.length === 0 ? (
              <div className="flex justify-center p-8">
                <Loader2 className="w-6 h-6 text-[#22D3EE] animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                  <Bell className="w-5 h-5 text-neutral-500" />
                </div>
                <p className="text-sm font-medium text-white mb-1">You&apos;re all caught up</p>
                <p className="text-xs text-neutral-500">No new notifications right now.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`flex gap-3 p-3 rounded-[20px] transition-colors ${notification.read ? 'hover:bg-white/[0.05]' : 'bg-[#22D3EE]/5 hover:bg-[#22D3EE]/10'}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${notification.read ? 'text-neutral-300' : 'text-white font-medium'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    {!notification.read && (
                      <button 
                        onClick={(e) => handleMarkAsRead(notification.id, e)}
                        className="p-1.5 text-neutral-400 hover:text-[#22D3EE] hover:bg-[#22D3EE]/10 rounded-lg transition-colors h-fit"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="p-2 border-t border-white/[0.08] bg-white/[0.02]">
            <a href="/dashboard/notifications" className="block w-full py-2 text-center text-xs font-medium text-[#22D3EE] hover:bg-[#22D3EE]/10 rounded-[20px] transition-colors">
              View All Notifications
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
