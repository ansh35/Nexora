import { freePlan, proPlan, enterprisePlan } from "@/config/subscriptions"
import prisma from "@/lib/prisma"

export async function getOrganizationSubscription(organizationId: string) {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: {
      subscriptionPlan: true,
      subscriptionStatus: true,
      subscriptionActivatedAt: true,
      subscriptionExpiresAt: true,
    },
  })

  if (!org) {
    throw new Error("Organization not found")
  }

  const isPro = org.subscriptionPlan === "pro" && org.subscriptionStatus === "ACTIVE"
  const isEnterprise = org.subscriptionPlan === "enterprise" && org.subscriptionStatus === "ACTIVE"

  let plan = freePlan
  if (isPro) plan = proPlan
  if (isEnterprise) plan = enterprisePlan

  return {
    ...plan,
    isPro,
    isEnterprise,
    subscriptionStatus: org.subscriptionStatus,
    subscriptionActivatedAt: org.subscriptionActivatedAt,
    subscriptionExpiresAt: org.subscriptionExpiresAt,
  }
}
