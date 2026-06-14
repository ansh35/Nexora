"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/../auth"
import { pusherServer } from "@/lib/pusher"

export async function addComment(taskId: string, content: string) {
  const session = await auth()
  
  if (!session?.user?.organizationId) return { error: "Unauthorized" }
  if (!content?.trim()) return { error: "Content is required" }

  try {
    const task = await prisma.task.findFirst({
      where: { id: taskId, organizationId: session.user.organizationId }
    })
    
    if (!task) return { error: "Task not found" }

    const comment = await prisma.taskComment.create({
      data: {
        text: content,
        taskId,
        userId: session.user.id,
        organizationId: session.user.organizationId
      },
      include: {
        user: { select: { id: true, name: true, image: true } }
      }
    })

    await pusherServer.trigger(
      `private-org-${session.user.organizationId}`,
      `task-comment-${taskId}`,
      comment
    )

    return { success: true, comment }
  } catch (error) {
    console.error("Failed to add comment:", error)
    return { error: "Failed to add comment" }
  }
}

export async function getComments(taskId: string) {
  const session = await auth()
  if (!session?.user?.organizationId) return { error: "Unauthorized" }

  try {
    const comments = await prisma.taskComment.findMany({
      where: { taskId, organizationId: session.user.organizationId },
      include: {
        user: { select: { id: true, name: true, image: true } }
      },
      orderBy: { createdAt: "asc" }
    })

    return { success: true, comments }
  } catch (error) {
    console.error("Failed to fetch comments:", error)
    return { error: "Failed to fetch comments" }
  }
}

export async function triggerTyping(taskId: string, isTyping: boolean) {
  const session = await auth()
  if (!session?.user?.organizationId) return { error: "Unauthorized" }

  try {
    await pusherServer.trigger(
      `private-org-${session.user.organizationId}`,
      `task-typing-${taskId}`,
      {
        userId: session.user.id,
        userName: session.user.name,
        isTyping
      }
    )
    return { success: true }
  } catch (error) {
    console.error("Failed to trigger typing:", error)
    return { error: "Failed to trigger typing" }
  }
}
