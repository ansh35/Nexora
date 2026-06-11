"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/../auth"
import { revalidatePath } from "next/cache"

export async function createProject(data: { name: string; description?: string }) {
  const session = await auth()
  
  if (!session?.user?.organizationId) {
    return { error: "Unauthorized" }
  }

  if (session.user.role === "MEMBER") {
    return { error: "Forbidden: Members cannot create projects" }
  }

  if (!data.name || data.name.trim() === "") {
    return { error: "Project name is required" }
  }

  try {
    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        organizationId: session.user.organizationId,
      }
    })

    revalidatePath("/dashboard")
    return { success: true, project }
  } catch (error) {
    console.error("Failed to create project:", error)
    return { error: "Failed to create project" }
  }
}

export async function updateProject(id: string, data: { name: string; description?: string }) {
  const session = await auth()
  
  if (!session?.user?.organizationId) {
    return { error: "Unauthorized" }
  }

  if (session.user.role === "MEMBER") {
    return { error: "Forbidden: Members cannot edit projects" }
  }

  if (!data.name || data.name.trim() === "") {
    return { error: "Project name is required" }
  }

  try {
    // Verify project belongs to the user's organization
    const project = await prisma.project.findFirst({
      where: { id, organizationId: session.user.organizationId }
    })

    if (!project) {
      return { error: "Project not found or unauthorized" }
    }

    await prisma.project.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
      }
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Failed to update project:", error)
    return { error: "Failed to update project" }
  }
}

export async function archiveProject(id: string) {
  const session = await auth()
  
  if (!session?.user?.organizationId) {
    return { error: "Unauthorized" }
  }

  if (session.user.role === "MEMBER") {
    return { error: "Forbidden: Members cannot archive projects" }
  }

  try {
    const project = await prisma.project.findFirst({
      where: { id, organizationId: session.user.organizationId }
    })

    if (!project) {
      return { error: "Project not found or unauthorized" }
    }

    await prisma.project.update({
      where: { id },
      data: { status: "ARCHIVED" }
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Failed to archive project:", error)
    return { error: "Failed to archive project" }
  }
}

export async function deleteProject(id: string) {
  const session = await auth()
  
  if (!session?.user?.organizationId) {
    return { error: "Unauthorized" }
  }

  // ONLY OWNER can delete
  if (session.user.role !== "OWNER") {
    return { error: "Forbidden: Only owners can delete projects" }
  }

  try {
    const project = await prisma.project.findFirst({
      where: { id, organizationId: session.user.organizationId }
    })

    if (!project) {
      return { error: "Project not found or unauthorized" }
    }

    await prisma.project.delete({
      where: { id }
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete project:", error)
    return { error: "Failed to delete project" }
  }
}
