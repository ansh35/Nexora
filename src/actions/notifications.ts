"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/../auth"
import { revalidatePath } from "next/cache"

function toErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : String(error) || fallback
}

export async function getNotifications() {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" }
    })

    const unreadCount = await prisma.notification.count({
      where: { userId: session.user.id, read: false }
    })

    return { notifications, unreadCount }
  } catch (error: unknown) {
    console.error("Error fetching notifications:", error)
    return { error: toErrorMessage(error, "Failed to fetch notifications") }
  }
}

export async function markAsRead(id: string) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }

  try {
    await prisma.notification.update({
      where: { id, userId: session.user.id },
      data: { read: true }
    })
    revalidatePath("/dashboard/notifications")
    return { success: true }
  } catch (error: unknown) {
    return { error: toErrorMessage(error, "Failed to mark as read") }
  }
}

export async function markAllAsRead() {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }

  try {
    await prisma.notification.updateMany({
      where: { userId: session.user.id, read: false },
      data: { read: true }
    })
    revalidatePath("/dashboard/notifications")
    return { success: true }
  } catch (error: unknown) {
    return { error: toErrorMessage(error, "Failed to mark all as read") }
  }
}
