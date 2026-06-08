"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { loginSchema } from "@/lib/validations/auth"
import { login } from "@/actions/auth"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    setError("")

    startTransition(() => {
      login(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error)
          } else {
            router.push("/dashboard")
            router.refresh()
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
            Welcome Back
          </h1>
          <p className="text-sm text-neutral-400">
            Sign in to your Nexora account
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-neutral-300">Password</label>
            </div>
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

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm text-center">
              {error}
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
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-neutral-400">
          Don't have an account?{" "}
          <Link href="/register" className="text-[#22D3EE] hover:text-[#06B6D4] font-medium transition-colors">
            Register now
          </Link>
        </div>
      </div>
    </div>
  )
}
