import { auth } from "@/../auth"
import { getOrganizationSubscription } from "@/services/billing/subscription-service"
import { getAiUsage } from "@/services/billing/usage-service"
import { BillingForm } from "@/components/billing/billing-form"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function BillingPage() {
  const session = await auth()

  if (!session?.user?.organizationId) {
    redirect("/login")
  }

  const subscriptionPlan = await getOrganizationSubscription(
    session.user.organizationId
  )

  const isOwner = session.user.role === "OWNER"

  const projectCount = await prisma.project.count({
    where: { organizationId: session.user.organizationId },
  })

  const userCount = await prisma.user.count({
    where: { organizationId: session.user.organizationId },
  })

  const aiUsageCount = await getAiUsage(session.user.organizationId)

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Billing & Subscription</h2>
        <span className="inline-flex items-center rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-500">
          Developer Billing Mode
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white/[0.05] border border-white/10 hover:border-white/20 hover:bg-white/[0.06] shadow-[0_0_40px_rgba(34,211,238,0.12)] rounded-[24px] backdrop-blur-xl transition-all duration-300">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-neutral-400">Projects</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{projectCount} / {subscriptionPlan.features.maxProjects === Infinity ? "Unlimited" : subscriptionPlan.features.maxProjects}</div>
          </div>
        </div>
        <div className="bg-white/[0.05] border border-white/10 hover:border-white/20 hover:bg-white/[0.06] shadow-[0_0_40px_rgba(34,211,238,0.12)] rounded-[24px] backdrop-blur-xl transition-all duration-300">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-neutral-400">Users</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{userCount} / {subscriptionPlan.features.maxUsers === Infinity ? "Unlimited" : subscriptionPlan.features.maxUsers}</div>
          </div>
        </div>
        <div className="bg-white/[0.05] border border-white/10 hover:border-white/20 hover:bg-white/[0.06] shadow-[0_0_40px_rgba(34,211,238,0.12)] rounded-[24px] backdrop-blur-xl transition-all duration-300">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-neutral-400">AI Requests (Monthly)</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{aiUsageCount} / {subscriptionPlan.features.maxAiRequests === Infinity ? "Unlimited" : subscriptionPlan.features.maxAiRequests}</div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Subscription Plans</h3>
        <BillingForm subscriptionPlan={subscriptionPlan} isOwner={isOwner} />
      </div>
    </div>
  )
}
