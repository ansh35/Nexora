import { auth } from "@/../auth"
import { redirect } from "next/navigation"
import { updateProfile } from "@/actions/settings"
import { User, Mail, Shield } from "lucide-react"

export default async function ProfileSettingsPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  return (
    <>
      <div className="flex items-center gap-4 border-b border-white/10 pb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#22D3EE] to-[#8B5CF6] p-[2px]">
          <div className="w-full h-full bg-[#070B14] rounded-full flex items-center justify-center text-xl font-bold">
            {session.user.name?.charAt(0).toUpperCase()}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold">{session.user.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs bg-[#22D3EE]/20 text-[#22D3EE] px-2 py-0.5 rounded-full uppercase tracking-wider font-medium">
              {session.user.role}
            </span>
          </div>
        </div>
      </div>

      <form action={async (formData) => {
        "use server"
        await updateProfile(formData)
      }} className="space-y-4 pt-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-neutral-300 block">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-4 w-4 text-neutral-500" />
            </div>
            <input
              suppressHydrationWarning
              type="text"
              name="name"
              id="name"
              defaultValue={session.user.name!}
              required
              className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-xl bg-white/5 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-neutral-300 block">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-neutral-500" />
            </div>
            <input
              suppressHydrationWarning
              type="email"
              id="email"
              defaultValue={session.user.email!}
              disabled
              className="block w-full pl-10 pr-3 py-2 border border-white/5 rounded-xl bg-white/[0.02] text-neutral-400 cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
            <Shield className="w-3 h-3" /> Email is managed by your organization.
          </p>
        </div>

        <div className="pt-4 flex items-center justify-end">
          <button
            suppressHydrationWarning
            type="submit"
            className="px-6 py-2 bg-[#22D3EE] hover:bg-[#22D3EE]/90 text-black font-medium rounded-xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE]"
          >
            Save Changes
          </button>
        </div>
      </form>
    </>
  )
}
