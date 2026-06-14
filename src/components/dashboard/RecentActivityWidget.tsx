import { getActivities } from "@/actions/activity"
import { formatDistanceToNow } from "date-fns"
import { Activity as ActivityIcon } from "lucide-react"

export async function RecentActivityWidget() {
  const res = await getActivities(1, 5) // Fetch top 5
  
  if (!res || res.error || !res.activities || res.activities.length === 0) {
    return (
      <div className="bg-white/[0.04] border border-white/10 rounded-[24px] p-6 backdrop-blur-xl h-full flex flex-col items-center justify-center text-center">
        <ActivityIcon className="w-8 h-8 text-neutral-500 mb-3 opacity-50" />
        <h3 className="text-white font-medium">Recent Activity</h3>
        <p className="text-sm text-neutral-500 mt-1">No recent activity.</p>
      </div>
    )
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
    <div className="bg-white/[0.04] border border-white/10 rounded-[24px] p-6 backdrop-blur-xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <ActivityIcon className="w-4 h-4 text-[#22D3EE]" />
          Recent Activity
        </h3>
        <a href="/dashboard/activity" className="text-xs text-[#22D3EE] hover:underline">
          View All
        </a>
      </div>

      <div className="space-y-4 flex-1">
        {res.activities.map((activity: any) => (
          <div key={activity.id} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 shrink-0 flex items-center justify-center text-xs font-medium text-white overflow-hidden border border-white/5">
              {activity.user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={activity.user.image} alt={activity.user.name} className="w-full h-full object-cover" />
              ) : (
                activity.user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-neutral-300 leading-snug">
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
    </div>
  )
}
