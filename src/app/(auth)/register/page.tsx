"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"

import { registerSchema } from "@/lib/validations/auth"
import { register } from "@/actions/auth"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      workspaceName: "",
      name: "",
      email: "",
      password: "",
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
              router.push(callbackUrl)
            }, 2000)
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
          Register Workspace
        </h1>
        <p className="text-sm text-neutral-400">
          Create a new Nexora workspace as an owner
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300">Workspace Name</label>
          <input
            {...form.register("workspaceName")}
            type="text"
            placeholder="Acme Corp"
            disabled={isPending}
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/50 transition-all"
          />
          {form.formState.errors.workspaceName && (
            <p className="text-sm text-red-400 mt-1">{form.formState.errors.workspaceName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300">Your Name</label>
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
          className="w-full bg-[#22D3EE] hover:bg-[#06B6D4] hover:scale-[1.02] text-[#070B14] font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.25)] mt-4"
        >
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Register Workspace"
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-neutral-400 border-t border-white/10 pt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-[#22D3EE] hover:text-[#06B6D4] font-medium transition-colors hover:underline">
          Sign in
        </Link>
      </div>
    </motion.div>
  )
}
