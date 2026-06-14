import { getOrganizationSubscription } from "./subscription-service"
import prisma from "@/lib/prisma"

export async function checkProjectLimit(organizationId: string): Promise<boolean> {
  const subscription = await getOrganizationSubscription(organizationId)
  
  if (subscription.features.maxProjects === Infinity) {
    return true
  }

  const projectCount = await prisma.project.count({
    where: { organizationId },
  })

  return projectCount < subscription.features.maxProjects
}

export async function checkUserLimit(organizationId: string): Promise<boolean> {
  const subscription = await getOrganizationSubscription(organizationId)
  
  if (subscription.features.maxUsers === Infinity) {
    return true
  }

  const userCount = await prisma.user.count({
    where: { organizationId },
  })

  return userCount < subscription.features.maxUsers
}

export async function getAiUsage(organizationId: string) {
  const date = new Date()
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)

  const usage = await prisma.aiUsage.aggregate({
    _sum: {
      requestsUsed: true,
    },
    where: {
      organizationId,
      createdAt: {
        gte: startOfMonth,
      },
    },
  })

  return usage._sum.requestsUsed || 0
}

export async function checkAiQuota(organizationId: string): Promise<boolean> {
  const subscription = await getOrganizationSubscription(organizationId)
  
  if (subscription.features.maxAiRequests === Infinity) {
    return true
  }

  const currentUsage = await getAiUsage(organizationId)
  return currentUsage < subscription.features.maxAiRequests
}

export async function incrementAiUsage(
  organizationId: string,
  userId: string,
  feature: string,
  estimatedTokens: number = 0
): Promise<void> {
  await prisma.aiUsage.create({
    data: {
      organizationId,
      userId,
      feature,
      requestsUsed: 1,
      estimatedTokens,
    },
  })
}
