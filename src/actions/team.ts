"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/../auth"
import { revalidatePath } from "next/cache"
import crypto from "crypto"
import { sendInvitationEmail } from "@/lib/email/service"
import { logActivity } from "@/lib/activity"

export async function inviteMember(email: string, role: string) {
  const session = await auth()
  
  if (!session?.user?.organizationId) return { error: "Unauthorized" }
  if (session.user.role === "MEMBER") return { error: "Forbidden: Only admins or owners can invite" }

  // Admin cannot invite Owners
  if (session.user.role === "ADMIN" && role === "OWNER") {
    return { error: "Forbidden: Admins cannot invite Owners" }
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: { email, organizationId: session.user.organizationId }
    })
    
    if (existingUser) return { error: "User is already in the organization" }

    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    await prisma.invitation.upsert({
      where: {
        email_organizationId: {
          email,
          organizationId: session.user.organizationId
        }
      },
      update: {
        token,
        expiresAt,
        role,
        inviterId: session.user.id
      },
      create: {
        email,
        role,
        token,
        expiresAt,
        organizationId: session.user.organizationId,
        inviterId: session.user.id
      }
    })

    const org = await prisma.organization.findUnique({
      where: { id: session.user.organizationId }
    })

    if (org) {
      await sendInvitationEmail(
        email,
        session.user.name || "A user",
        org.name,
        token
      )
    }

    await logActivity({
      organizationId: session.user.organizationId,
      userId: session.user.id,
      action: `Invited user as ${role}`,
      entityType: "USER",
      entityId: email,
      entityName: email
    })

    revalidatePath("/dashboard/team")
    return { success: true, token, organizationName: org?.name || "your workspace" } // Returning token and org name for local demo
  } catch (error) {
    console.error("Failed to invite member:", error)
    return { error: "Failed to invite member" }
  }
}

export async function removeMember(userId: string) {
  const session = await auth()
  
  if (!session?.user?.organizationId) return { error: "Unauthorized" }
  if (session.user.role !== "OWNER") return { error: "Forbidden: Only owners can remove members" }

  try {
    const userToRemove = await prisma.user.findFirst({
      where: { id: userId, organizationId: session.user.organizationId }
    })

    if (!userToRemove) return { error: "User not found" }

    if (userToRemove.role === "OWNER") {
      const ownerCount = await prisma.user.count({
        where: { organizationId: session.user.organizationId, role: "OWNER" }
      })
      if (ownerCount <= 1) {
        return { error: "Cannot remove the last owner of the organization" }
      }
    }

    // Unassign tasks assigned to this user
    await prisma.task.updateMany({
      where: { assigneeId: userId },
      data: { assigneeId: null }
    })

    // Delete invitations sent by this user
    await prisma.invitation.deleteMany({
      where: { inviterId: userId }
    })

    // Delete the user
    await prisma.user.delete({
      where: { id: userId }
    })

    await logActivity({
      organizationId: session.user.organizationId,
      userId: session.user.id,
      action: "Removed member",
      entityType: "USER",
      entityId: userId,
      entityName: userToRemove.email
    })

    revalidatePath("/dashboard/team")
    return { success: true }
  } catch (error) {
    console.error("Failed to remove member:", error)
    return { error: "Failed to remove member" }
  }
}

export async function updateRole(userId: string, newRole: string) {
  const session = await auth()
  
  if (!session?.user?.organizationId) return { error: "Unauthorized" }
  if (session.user.role !== "OWNER") return { error: "Forbidden: Only owners can change roles" }

  try {
    const userToUpdate = await prisma.user.findFirst({
      where: { id: userId, organizationId: session.user.organizationId }
    })

    if (!userToUpdate) return { error: "User not found" }

    // If downgrading an owner, ensure there is another owner
    if (userToUpdate.role === "OWNER" && newRole !== "OWNER") {
      const ownerCount = await prisma.user.count({
        where: { organizationId: session.user.organizationId, role: "OWNER" }
      })
      if (ownerCount <= 1) {
        return { error: "Cannot downgrade the last owner of the organization" }
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    })

    await logActivity({
      organizationId: session.user.organizationId,
      userId: session.user.id,
      action: `Updated role to ${newRole}`,
      entityType: "USER",
      entityId: userId,
      entityName: userToUpdate.email
    })

    revalidatePath("/dashboard/team")
    return { success: true }
  } catch (error) {
    console.error("Failed to update role:", error)
    return { error: "Failed to update role" }
  }
}

export async function cancelInvitation(invitationId: string) {
  const session = await auth()
  
  if (!session?.user?.organizationId) return { error: "Unauthorized" }
  if (session.user.role === "MEMBER") return { error: "Forbidden" }

  try {
    const invitation = await prisma.invitation.findFirst({
      where: { id: invitationId, organizationId: session.user.organizationId }
    })

    if (!invitation) return { error: "Invitation not found" }

    await prisma.invitation.delete({
      where: { id: invitationId, organizationId: session.user.organizationId }
    })

    await logActivity({
      organizationId: session.user.organizationId,
      userId: session.user.id,
      action: "Cancelled invitation",
      entityType: "USER",
      entityId: invitationId,
      entityName: invitation.email
    })

    revalidatePath("/dashboard/team")
    return { success: true }
  } catch (error) {
    console.error("Failed to cancel invitation:", error)
    return { error: "Failed to cancel invitation" }
  }
}

export async function acceptInvitation(token: string) {
  const session = await auth()
  
  if (!session?.user) return { error: "Not logged in" }

  try {
    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: { organization: true }
    })

    if (!invitation) return { error: "Invalid invitation link" }
    if (invitation.expiresAt < new Date()) return { error: "Invitation expired" }

    // User must have the same email as the invitation (optional depending on UX, but good for security)
    if (invitation.email !== session.user.email) {
      return { error: "This invitation is for a different email address." }
    }

    // Unassign tasks from the user's old org just in case they were assigned (optional cleanup)
    await prisma.task.updateMany({
      where: { assigneeId: session.user.id },
      data: { assigneeId: null }
    })

    // Move user to new org
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        organizationId: invitation.organizationId,
        role: invitation.role
      }
    })

    // Delete the invitation
    await prisma.invitation.delete({
      where: { id: invitation.id }
    })

    await logActivity({
      organizationId: invitation.organizationId,
      userId: session.user.id,
      action: "Accepted invitation",
      entityType: "USER",
      entityId: session.user.id,
      entityName: session.user.email || "Unknown user"
    })

    return { success: true, organizationName: invitation.organization.name }
  } catch (error) {
    console.error("Failed to accept invitation:", error)
    return { error: "Failed to accept invitation" }
  }
}
