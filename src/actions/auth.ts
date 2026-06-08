"use server"

import bcryptjs from "bcryptjs"
import prisma from "@/lib/prisma"
import { signIn, signOut } from "@/../auth"
import { loginSchema, registerSchema, LoginInput, RegisterInput } from "@/lib/validations/auth"
import { AuthError } from "next-auth"
import { revalidatePath } from "next/cache"

export async function register(data: RegisterInput) {
  try {
    const validatedData = registerSchema.safeParse(data)

    if (!validatedData.success) {
      return { error: "Invalid fields" }
    }

    const { email, name, password, role } = validatedData.data

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return { error: "Email already in use" }
    }

    const hashedPassword = await bcryptjs.hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      }
    })

    return { success: "User registered successfully! You can now log in." }
  } catch (error) {
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
