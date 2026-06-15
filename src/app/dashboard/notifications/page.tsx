import { auth } from "@/../auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { formatDistanceToNow } from "date-fns"
import { Bell, CheckCircle2 } from "lucide-react"
import { markAllAsRead } from "@/actions/notifications"
import { EmptyState } from "@/components/ui/EmptyState"

export const metadata = {
  title: "Notifications | Nexora",
}

export default async function NotificationsPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="p-8 max-w-4xl mx-auto w-full font-sans animate-in fade-in duration-500">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Notifications</h1>
          <p className="text-neutral-400 mt-1">Stay updated with your latest alerts and tasks.</p>
        </div>
        
        {notifications.some(n => !n.read) && (
          <form action={async () => {
            "use server"
            await markAllAsRead()
          }}>
            <button 
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] hover:bg-white/10 text-white rounded-xl transition-colors text-sm font-medium border border-white/10"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark all as read
            </button>
          </form>
        )}
      </header>

      {notifications.length === 0 ? (
        <EmptyState 
          icon={Bell}
          title="You're all caught up"
          description="No new notifications right now. When you have updates, they will appear here."
        />
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div 
              key={notification.id}
              className={`p-4 sm:p-6 rounded-[24px] border backdrop-blur-xl transition-all flex items-start gap-4 ${
                notification.read 
                  ? "bg-white/[0.02] border-white/5" 
                  : "bg-white/[0.05] border-[#22D3EE]/30 shadow-[0_0_15px_rgba(34,211,238,0.05)]"
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                notification.read ? "bg-white/[0.05]" : "bg-[#22D3EE]/10"
              }`}>
                <Bell className={`w-5 h-5 ${notification.read ? "text-neutral-500" : "text-[#22D3EE]"}`} />
              </div>
              
              <div className="flex-1 min-w-0 pt-1">
                <p className={`text-base leading-snug ${notification.read ? "text-neutral-300" : "text-white font-medium"}`}>
                  {notification.message}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-neutral-500">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </span>
                  {!notification.read && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-neutral-600"></span>
                      <span className="text-xs text-[#22D3EE] font-medium">New</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
