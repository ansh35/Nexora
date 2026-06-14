"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/../auth"
import { revalidatePath } from "next/cache"
import { logActivity } from "@/lib/activity"
import { pusherServer } from "@/lib/pusher"

type TaskData = {
  title: string
  description?: string
  priority?: string
  status?: string
}

export async function createTask(projectId: string, data: TaskData) {
  const session = await auth()
  
  if (!session?.user?.organizationId) return { error: "Unauthorized" }
  if (session.user.role === "MEMBER") return { error: "Forbidden" }
  if (!data.title?.trim()) return { error: "Title is required" }

  try {
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority || "MEDIUM",
        status: data.status || "TODO",
        projectId,
        organizationId: session.user.organizationId,
      }
    })
    
    await logActivity({
      organizationId: session.user.organizationId,
      userId: session.user.id,
      action: "Created task",
      entityType: "TASK",
      entityId: task.id,
      entityName: task.title
    })

    await pusherServer.trigger(
      `private-org-${session.user.organizationId}`,
      "task-created",
      task
    )

    revalidatePath(`/dashboard/projects/${projectId}`)
    revalidatePath("/dashboard/tasks")
    revalidatePath("/dashboard/kanban")
    return { success: true, task }
  } catch (error) {
    console.error("Failed to create task:", error)
    return { error: "Failed to create task" }
  }
}

export async function editTask(id: string, data: TaskData) {
  const session = await auth()
  
  if (!session?.user?.organizationId) return { error: "Unauthorized" }
  if (session.user.role === "MEMBER") return { error: "Forbidden" }
  if (!data.title?.trim()) return { error: "Title is required" }

  try {
    const task = await prisma.task.findFirst({
      where: { id, organizationId: session.user.organizationId }
    })
    if (!task) return { error: "Task not found" }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
      }
    })

    await logActivity({
      organizationId: session.user.organizationId,
      userId: session.user.id,
      action: "Updated task",
      entityType: "TASK",
      entityId: task.id,
      entityName: task.title
    })

    await pusherServer.trigger(
      `private-org-${session.user.organizationId}`,
      "task-updated",
      updatedTask
    )

    revalidatePath(`/dashboard/projects/${task.projectId}`)
    revalidatePath("/dashboard/tasks")
    revalidatePath("/dashboard/kanban")
    return { success: true }
  } catch (error) {
    console.error("Failed to edit task:", error)
    return { error: "Failed to edit task" }
  }
}

export async function assignTask(id: string, assigneeId: string | null) {
  const session = await auth()
  
  if (!session?.user?.organizationId) return { error: "Unauthorized" }
  if (session.user.role === "MEMBER") return { error: "Forbidden" }

  try {
    const task = await prisma.task.findFirst({
      where: { id, organizationId: session.user.organizationId }
    })
    if (!task) return { error: "Task not found" }

    // Verify assignee belongs to organization if assigneeId is not null
    if (assigneeId) {
      const assignee = await prisma.user.findFirst({
        where: { id: assigneeId, organizationId: session.user.organizationId }
      })
      if (!assignee) return { error: "Invalid assignee" }
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { assigneeId }
    })

    await logActivity({
      organizationId: session.user.organizationId,
      userId: session.user.id,
      action: assigneeId ? "Assigned task" : "Unassigned task",
      entityType: "TASK",
      entityId: task.id,
      entityName: task.title
    })

    await pusherServer.trigger(
      `private-org-${session.user.organizationId}`,
      "task-updated",
      updatedTask
    )

    revalidatePath(`/dashboard/projects/${task.projectId}`)
    revalidatePath("/dashboard/tasks")
    revalidatePath("/dashboard/kanban")
    return { success: true }
  } catch (error) {
    console.error("Failed to assign task:", error)
    return { error: "Failed to assign task" }
  }
}

export async function updateTaskStatus(id: string, status: string) {
  const session = await auth()
  
  if (!session?.user?.organizationId) return { error: "Unauthorized" }

  try {
    const task = await prisma.task.findFirst({
      where: { id, organizationId: session.user.organizationId }
    })
    if (!task) return { error: "Task not found" }

    if (session.user.role === "MEMBER") {
      if (task.assigneeId !== session.user.id) {
        return { error: "Forbidden: You can only update status of tasks assigned to you" }
      }
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status }
    })

    await logActivity({
      organizationId: session.user.organizationId,
      userId: session.user.id,
      action: `Moved task to ${status}`,
      entityType: "TASK",
      entityId: task.id,
      entityName: task.title
    })

    await pusherServer.trigger(
      `private-org-${session.user.organizationId}`,
      "task-updated",
      updatedTask
    )

    revalidatePath(`/dashboard/projects/${task.projectId}`)
    revalidatePath("/dashboard/tasks")
    revalidatePath("/dashboard/kanban")
    return { success: true }
  } catch (error) {
    console.error("Failed to update status:", error)
    return { error: "Failed to update status" }
  }
}

export async function deleteTask(id: string) {
  const session = await auth()
  
  if (!session?.user?.organizationId) return { error: "Unauthorized" }
  if (session.user.role !== "OWNER") return { error: "Forbidden: Only owners can delete tasks" }

  try {
    const task = await prisma.task.findFirst({
      where: { id, organizationId: session.user.organizationId }
    })
    if (!task) return { error: "Task not found" }

    await prisma.task.delete({ where: { id } })

    await logActivity({
      organizationId: session.user.organizationId,
      userId: session.user.id,
      action: "Deleted task",
      entityType: "TASK",
      entityId: task.id,
      entityName: task.title
    })

    await pusherServer.trigger(
      `private-org-${session.user.organizationId}`,
      "task-deleted",
      { id }
    )

    revalidatePath(`/dashboard/projects/${task.projectId}`)
    revalidatePath("/dashboard/tasks")
    revalidatePath("/dashboard/kanban")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete task:", error)
    return { error: "Failed to delete task" }
  }
}
