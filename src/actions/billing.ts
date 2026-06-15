"use server"

import { auth } from "@/../auth"
import { billingProvider } from "@/services/billing/developer-billing-provider"

async function verifyOwner() {
  const session = await auth()
  if (!session?.user?.organizationId) throw new Error("Unauthorized")
  if (session.user.role !== "OWNER") throw new Error("Forbidden")
  return session.user.organizationId
}

export async function simulateUpgrade(planId: string) {
  try {
    const orgId = await verifyOwner()
    await billingProvider.upgrade(orgId, planId)
    return { success: true }
  } catch (error: unknown) {
    return { error: error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error) }
  }
}

export async function simulateDowngrade(planId: string) {
  try {
    const orgId = await verifyOwner()
    await billingProvider.downgrade(orgId, planId)
    return { success: true }
  } catch (error: unknown) {
    return { error: error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error) }
  }
}
