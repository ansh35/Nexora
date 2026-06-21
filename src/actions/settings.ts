"use server"

import { auth } from "@/../auth"
import prisma from "@/lib/prisma"
import bcryptjs from "bcryptjs"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: "Unauthorized" }
    }

    const name = formData.get("name") as string
    
    if (!name || name.trim() === "") {
      return { error: "Name is required" }
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: name.trim() }
    })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/settings")
    
    return { success: true }
  } catch (error) {
    console.error("Failed to update profile", error)
    return { error: "Failed to update profile. Please try again." }
  }
}

export async function updatePassword(formData: FormData) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: "Unauthorized" }
    }

    const currentPassword = formData.get("currentPassword") as string
    const newPassword = formData.get("newPassword") as string

    if (!currentPassword || !newPassword) {
      return { error: "Please provide both current and new passwords" }
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user || !user.password) {
      return { error: "User not found or no password set" }
    }

    const passwordsMatch = await bcryptjs.compare(currentPassword, user.password)
    if (!passwordsMatch) {
      return { error: "Current password is incorrect" }
    }

    if (newPassword.length < 8 || newPassword.length > 10) {
      return { error: "New password must be between 8 and 10 characters long" }
    }

    const hashedNewPassword = await bcryptjs.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedNewPassword }
    })

    return { success: true }
  } catch (error) {
    console.error("Failed to update password", error)
    return { error: "Failed to update password. Please try again." }
  }
}
