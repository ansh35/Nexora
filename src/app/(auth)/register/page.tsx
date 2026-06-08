"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { registerSchema } from "@/lib/validations/auth"
import { register } from "@/actions/auth"

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "MEMBER",
    },
  })

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    setError("")
    setSuccess("")

    startTransition(() => {
      register(values)
        .then((data) => {
          if (data.error) {
            setError(data.error)
          } else if (data.success) {
            setSuccess(data.success)
            // Optionally, redirect after a short delay
            setTimeout(() => {
              router.push("/login")
            }, 2000)
          }
        })
        .catch(() => setError("Something went wrong!"))
    })
  }

  return (
    <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center p-4 sm:p-8 font-sans text-white">
      <div className="w-full max-w-md bg-white/[0.05] border border-white/10 p-8 rounded-[24px] backdrop-blur-xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
            Create an Account
          </h1>
          <p className="text-sm text-neutral-400">
            Join Nexora and start building today
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Name</label>
            <input
              {...form.register("name")}
              type="text"
              placeholder="John Doe"
              disabled={isPending}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/50 transition-all"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-400 mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Email</label>
            <input
              {...form.register("email")}
              type="email"
              placeholder="name@example.com"
              disabled={isPending}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/50 transition-all"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-400 mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Password</label>
            <input
              {...form.register("password")}
              type="password"
              placeholder="••••••••"
              disabled={isPending}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/50 transition-all"
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-400 mt-1">{form.formState.errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Role</label>
            <select
              {...form.register("role")}
              disabled={isPending}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/50 transition-all appearance-none"
            >
              <option value="MEMBER" className="bg-[#070B14] text-white">Member</option>
              <option value="ADMIN" className="bg-[#070B14] text-white">Admin</option>
              <option value="OWNER" className="bg-[#070B14] text-white">Owner</option>
            </select>
            {form.formState.errors.role && (
              <p className="text-sm text-red-400 mt-1">{form.formState.errors.role.message}</p>
            )}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-[#22D3EE]/10 border border-[#22D3EE]/20 text-[#22D3EE] p-3 rounded-xl text-sm text-center">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#22D3EE] hover:bg-[#06B6D4] text-[#070B14] font-semibold py-3 rounded-xl transition-colors flex items-center justify-center"
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-neutral-400">
          Already have an account?{" "}
          <Link href="/login" className="text-[#22D3EE] hover:text-[#06B6D4] font-medium transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
