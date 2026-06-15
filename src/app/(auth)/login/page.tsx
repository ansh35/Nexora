"use client"

import { useState, useTransition, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"

import { loginSchema } from "@/lib/validations/auth"
import { login } from "@/actions/auth"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  
  const [error, setError] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition()
  const [rememberMe, setRememberMe] = useState(false)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  useEffect(() => {
    const savedEmail = localStorage.getItem("nexora_remembered_email")
    if (savedEmail) {
      form.setValue("email", savedEmail)
      // eslint-disable-next-line
      setRememberMe(true)
    }
  }, [form])

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    setError("")

    if (rememberMe) {
      localStorage.setItem("nexora_remembered_email", values.email)
    } else {
      localStorage.removeItem("nexora_remembered_email")
    }

    startTransition(() => {
      login(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error)
          } else {
            router.push(callbackUrl)
            router.refresh()
          }
        })
        .catch(() => setError("Something went wrong!"))
    })
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md bg-white/[0.05] border border-white/10 hover:border-white/20 hover:bg-white/[0.06] p-8 rounded-[24px] backdrop-blur-xl shadow-[0_0_40px_rgba(34,211,238,0.12)] transition-all duration-300"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
          Welcome back 👋
        </h1>
        <p className="text-sm text-neutral-400">
          Sign in to continue to Nexora
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300">Email Address</label>
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
            <Link href="/forgot-password" className="text-xs text-[#22D3EE] hover:text-[#06B6D4] transition-colors hover:underline">
              Forgot Password
            </Link>
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

        <div className="flex items-center gap-2 pt-1">
          <input 
            type="checkbox" 
            id="remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-white/10 bg-white/[0.04] text-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE]/50 accent-[#22D3EE] cursor-pointer" 
          />
          <label htmlFor="remember" className="text-sm text-neutral-400 cursor-pointer select-none">
            Remember Me
          </label>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#22D3EE] hover:bg-[#06B6D4] hover:scale-[1.02] text-[#070B14] font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.25)]"
        >
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-neutral-400 border-t border-white/10 pt-6">
        <p className="text-white font-medium mb-1">Need access to an existing workspace?</p>
        <p className="mb-4">Contact your workspace administrator for an invitation.</p>
        <Link href="/register" className="text-[#22D3EE] hover:text-[#06B6D4] font-medium transition-colors hover:underline">
          Want to create a new workspace? Register as an owner.
        </Link>
      </div>
    </motion.div>
  )
}
