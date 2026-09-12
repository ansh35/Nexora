import * as z from "zod"

export const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }).max(255, {
    message: "Email cannot exceed 255 characters.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }).max(128, {
    message: "Password cannot exceed 128 characters.",
  }),
})

export const registerSchema = z.object({
  workspaceName: z.string().min(2, {
    message: "Workspace name must be at least 2 characters.",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }).max(255, {
    message: "Email cannot exceed 255 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }).max(128, {
    message: "Password cannot exceed 128 characters.",
  }),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
