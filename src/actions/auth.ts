"use server"

import bcryptjs from "bcryptjs"
import prisma from "@/lib/prisma"
import { signIn, signOut } from "@/../auth"
import { loginSchema, registerSchema, LoginInput, RegisterInput } from "@/lib/validations/auth"
import { AuthError } from "next-auth"
import { generateVerificationToken, generatePasswordResetToken } from "@/lib/tokens"
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } from "@/lib/email/service"
import { logActivity } from "@/lib/activity"

export async function register(data: RegisterInput) {
  try {
    const validatedData = registerSchema.safeParse(data)

    if (!validatedData.success) {
      return { error: "Invalid fields" }
    }

    const { email, name, password, workspaceName } = validatedData.data

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return { error: "Email already in use" }
    }

    const hashedPassword = await bcryptjs.hash(password, 10)

    const baseSlug = workspaceName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
    let finalSlug = baseSlug
    let counter = 1
    while (await prisma.organization.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${counter}`
      counter++
    }

    const newOrg = await prisma.organization.create({
      data: {
        name: workspaceName,
        slug: finalSlug,
        users: {
          create: {
            name,
            email,
            password: hashedPassword,
            role: "OWNER",
          }
        }
      },
      include: {
        users: true
      }
    })

    const newUser = newOrg.users[0]

    await logActivity({
      organizationId: newOrg.id,
      userId: newUser.id,
      action: "Created organization",
      entityType: "ORGANIZATION",
      entityId: newOrg.id,
      entityName: newOrg.name
    })

    const verificationToken = await generateVerificationToken(email)
    await sendVerificationEmail(verificationToken.email, verificationToken.token)

    // Optional: Keep them logged out until they verify, or log them in. 
    // For now we'll log them in but they may need to verify.
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    return { success: "Registration successful! A verification email has been sent." }
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Something went wrong during sign-in" }
    }
    // NextAuth throws a redirect error on success sometimes, let it propagate
    if (error && typeof error === 'object' && 'digest' in error && String(error.digest).startsWith('NEXT_REDIRECT')) {
      throw error
    }
    
    console.error("Register Error:", error)
    return { error: "Something went wrong during registration" }
  }
}

export async function login(data: LoginInput) {
  try {
    const validatedData = loginSchema.safeParse(data)

    if (!validatedData.success) {
      return { error: "Invalid fields" }
    }

    const { email, password } = validatedData.data

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    return { success: "Logged in successfully!" }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" }
        default:
          return { error: "Something went wrong" }
      }
    }
    
    // AuthError throws on redirect in some NextAuth versions, so we need to handle it or let it throw if it's a redirect error
    throw error
  }
}

export async function logout() {
  await signOut({ redirectTo: "/login" })
}

export async function verifyEmail(token: string) {
  try {
    const existingToken = await prisma.verificationToken.findUnique({
      where: { token }
    })

    if (!existingToken) {
      return { error: "Token does not exist!" }
    }

    const hasExpired = new Date(existingToken.expiresAt) < new Date()

    if (hasExpired) {
      return { error: "Token has expired!" }
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: existingToken.email }
    })

    if (!existingUser) {
      return { error: "Email does not exist!" }
    }

    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        emailVerified: new Date(),
        email: existingToken.email,
      }
    })

    await prisma.verificationToken.delete({
      where: { id: existingToken.id }
    })

    // Send Welcome Email upon successful verification
    await sendWelcomeEmail(existingUser.email, existingUser.name)

    return { success: "Email verified successfully!" }
  } catch (error) {
    console.error("Verification Error:", error)
    return { error: "Something went wrong during verification" }
  }
}

export async function resetPasswordRequest(email: string) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (!existingUser) {
      return { error: "Email not found!" }
    }

    const passwordResetToken = await generatePasswordResetToken(email)
    await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token)

    return { success: "Reset email sent!" }
  } catch (error) {
    console.error("Reset Request Error:", error)
    return { error: "Something went wrong sending reset email" }
  }
}

export async function resetPassword(token: string, password: string) {
  try {
    const existingToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    })

    if (!existingToken) {
      return { error: "Invalid token!" }
    }

    const hasExpired = new Date(existingToken.expiresAt) < new Date()

    if (hasExpired) {
      return { error: "Token has expired!" }
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: existingToken.email }
    })

    if (!existingUser) {
      return { error: "Email does not exist!" }
    }

    const hashedPassword = await bcryptjs.hash(password, 10)

    await prisma.user.update({
      where: { id: existingUser.id },
      data: { password: hashedPassword }
    })

    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id }
    })

    return { success: "Password updated successfully!" }
  } catch (error) {
    console.error("Reset Password Error:", error)
    return { error: "Something went wrong updating password" }
  }
}
