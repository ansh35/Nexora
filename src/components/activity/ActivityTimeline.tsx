"use client"

import { useState, useEffect } from "react"
import { getActivities } from "@/actions/activity"
import { formatDistanceToNow, format } from "date-fns"
import { Loader2, ChevronLeft, ChevronRight, Activity, Filter, Search } from "lucide-react"

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

export function ActivityTimeline() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchActivities = async (p: number) => {
    setLoading(true)
    const res = await getActivities(p, 15)
    if (res?.activities) {
      setActivities(res.activities as Activity[])
      setTotalPages(res.totalPages || 1)
      setPage(res.currentPage || 1)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchActivities(1)
  }, [])

  const handleNext = () => {
    if (page < totalPages) fetchActivities(page + 1)
  }

  const handlePrev = () => {
    if (page > 1) fetchActivities(page - 1)
  }

  const getEntityColor = (type: string) => {
    switch (type) {
      case "PROJECT": return "bg-[#22D3EE]/20 text-[#22D3EE]"
      case "TASK": return "bg-purple-500/20 text-purple-400"
      case "USER": return "bg-green-500/20 text-green-400"
      case "ORGANIZATION": return "bg-orange-500/20 text-orange-400"
      default: return "bg-neutral-500/20 text-neutral-400"
    }
  }

  if (loading && activities.length === 0) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-[#22D3EE] animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {/* We can add filters here in the future */}
        </div>
      </div>

      <div className="relative border-l border-white/10 ml-4 space-y-8 pb-4">
        {activities.map((activity, index) => (
          <div key={activity.id} className="relative pl-8 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 50}ms` }}>
            {/* Timeline dot */}
            <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#22D3EE] shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
            
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 hover:bg-white/[0.04] transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 shrink-0 flex items-center justify-center text-sm font-medium text-white overflow-hidden border border-white/10">
                    {activity.user.image ? (
                      <img src={activity.user.image} alt={activity.user.name} className="w-full h-full object-cover" />
                    ) : (
                      activity.user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="text-neutral-300">
                      <span className="font-semibold text-white">{activity.user.name}</span>
                      {" "}{activity.action.toLowerCase()}{" "}
                      <span className="font-semibold text-white">{activity.entityName}</span>
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {format(new Date(activity.createdAt), "MMM d, yyyy 'at' h:mm a")} 
                      {" • "} 
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getEntityColor(activity.entityType)}`}>
                  {activity.entityType}
                </div>
              </div>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="pl-8 py-8 text-neutral-500 text-sm">
            No activities recorded yet.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <p className="text-sm text-neutral-400">
            Page <span className="text-white font-medium">{page}</span> of <span className="text-white font-medium">{totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={page === 1 || loading}
              className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={page === totalPages || loading}
              className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
