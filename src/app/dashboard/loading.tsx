import { Skeleton } from "@/components/ui/Skeleton"

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#070B14] p-8 text-white font-sans w-full">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between bg-white/[0.04] p-6 rounded-[24px] border border-white/10 backdrop-blur-xl">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-4 w-64 rounded-lg" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <Skeleton className="w-32 h-10 rounded-xl" />
            <Skeleton className="w-24 h-10 rounded-xl" />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 rounded-[24px] border border-white/10" />
          <Skeleton className="h-32 rounded-[24px] border border-white/10" />
          <Skeleton className="h-32 rounded-[24px] border border-white/10" />
        </div>

        <div className="space-y-6">
          <Skeleton className="h-[400px] rounded-[24px] border border-white/10 w-full" />
        </div>
      </div>
    </div>
  )
}
