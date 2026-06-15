import { auth } from "@/../auth"
import { redirect } from "next/navigation"
import { AuthMarketing } from "@/components/auth/auth-marketing"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (session?.user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-[#070B14] flex flex-col lg:flex-row font-sans text-white overflow-hidden">
      {/* Left Side: Marketing Content (60% Desktop) - Order 2 on mobile to stack below auth */}
      <div className="w-full lg:w-[60%] order-2 lg:order-1 relative shrink-0">
        <AuthMarketing />
      </div>

      {/* Right Side: Auth Forms (40% Desktop) - Order 1 on mobile to appear first */}
      <div className="w-full lg:w-[40%] order-1 lg:order-2 flex flex-col items-center justify-center p-4 sm:p-8 relative z-10 overflow-y-auto lg:h-screen shrink-0">
        {/* Subtle separator or background element if needed */}
        <div className="absolute inset-0 bg-[#070B14] z-[-1] lg:border-l lg:border-white/[0.04]" />
        {children}
      </div>
    </div>
  )
}
