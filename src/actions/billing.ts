"use server"

import { auth } from "@/../auth"
import { billingProvider } from "@/services/billing/developer-billing-provider"
import { plans } from "@/config/subscriptions"

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

async function verifyOwner() {
  const session = await auth()
  if (!session?.user?.organizationId) throw new Error("Unauthorized")
  if (session.user.role !== "OWNER") throw new Error("Forbidden")
  return session.user.organizationId
}

export async function simulateUpgrade(planId: string) {
  if (process.env.NODE_ENV === "production") {
    return { error: "Simulated billing upgrades are disabled in production." }
  }

  const allowedPlanIds = plans.map((p) => p.id)
  if (!allowedPlanIds.includes(planId)) {
    return { error: "Invalid subscription plan." }
  }

  try {
    const orgId = await verifyOwner()
    await billingProvider.upgrade(orgId, planId)
    return { success: true }
  } catch (error: unknown) {
    return { error: toErrorMessage(error) }
  }
}

export async function simulateDowngrade(planId: string) {
  if (process.env.NODE_ENV === "production") {
    return { error: "Simulated billing downgrades are disabled in production." }
  }

  const allowedPlanIds = plans.map((p) => p.id)
  if (!allowedPlanIds.includes(planId)) {
    return { error: "Invalid subscription plan." }
  }

  try {
    const orgId = await verifyOwner()
    await billingProvider.downgrade(orgId, planId)
    return { success: true }
  } catch (error: unknown) {
    return { error: toErrorMessage(error) }
  }
}
