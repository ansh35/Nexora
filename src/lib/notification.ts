import prisma from "./prisma"

export type NotificationType = "TASK_CREATED" | "TASK_ASSIGNED" | "PROJECT_INVITE" | "SYSTEM"

interface CreateNotificationProps {
  userId: string
  organizationId: string
  type: NotificationType
  message: string
  link?: string
}

export async function createNotification({
  userId,
  organizationId,
  type,
  message,
  link
}: CreateNotificationProps) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        organizationId,
        type,
        message,
        link
      }
    })

    const { pusherServer } = await import("@/lib/pusher")
    await pusherServer.trigger(
      `private-user-${userId}`,
      "new-notification",
      notification
    )
    
    return notification
  } catch (error) {
    console.error("Failed to create notification:", error)
    return null
  }
}
