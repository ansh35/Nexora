/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/../auth"

export async function getActivities(page = 1, limit = 20) {
  const session = await auth()
  
  if (!session?.user?.organizationId) return { error: "Unauthorized" }

  try {
    const whereClause: any = { organizationId: session.user.organizationId }

    // Members can only see their own activities
    if (session.user.role === "MEMBER") {
      whereClause.userId = session.user.id
    }

    const skip = (page - 1) * limit
    
    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
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
      totalPages: Math.ceil(total / limit),
      currentPage: page
    }
  } catch (error) {
    console.error("Failed to get activities", error)
    return { error: "Failed to load activities" }
  }
}
