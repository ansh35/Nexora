import prisma from "./prisma"

export type EntityType = "PROJECT" | "TASK" | "USER" | "ORGANIZATION"

interface LogActivityProps {
  organizationId: string
  userId: string
  action: string
  entityType: EntityType
  entityId: string
  entityName: string
  details?: string
}

export async function logActivity({
  organizationId,
  userId,
  action,
  entityType,
  entityId,
  entityName,
  details
}: LogActivityProps) {
  try {
    const activity = await prisma.activity.create({
      data: {
        organizationId,
        userId,
        action,
        entityType,
        entityId,
        entityName,
        details
      },
      include: {
        user: { select: { id: true, name: true, image: true } }
      }
    })

    const { pusherServer } = await import("@/lib/pusher")
    await pusherServer.trigger(
      `private-org-${organizationId}`,
      "new-activity",
      activity
    )
  } catch (error) {
    console.error("Failed to log activity:", error)
  }
}
