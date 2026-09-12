"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/../auth"

export async function getActivities(page = 1, limit = 20) {
  const session = await auth()
  
  if (!session?.user?.organizationId) return { error: "Unauthorized" }

  try {
    const whereClause: {
      organizationId: string
      userId?: string
    } = { organizationId: session.user.organizationId }

    // Members can only see their own activities
    if (session.user.role === "MEMBER") {
      whereClause.userId = session.user.id
    }

    const safePage = Math.max(1, Math.floor(Number(page) || 1))
    const safeLimit = Math.min(100, Math.max(1, Math.floor(Number(limit) || 20)))
    const skip = (safePage - 1) * safeLimit
    
    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take: safeLimit,
        include: {
          user: {
            select: { name: true, email: true, image: true }
          }
        }
      }),
      prisma.activity.count({ where: whereClause })
    ])

    return {
      activities,
      totalPages: Math.ceil(total / safeLimit),
      currentPage: safePage
    }
  } catch (error) {
    console.error("Failed to get activities", error)
    return { error: "Failed to load activities" }
  }
}
