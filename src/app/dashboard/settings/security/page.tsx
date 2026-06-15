"use client"

import { useState } from "react"
import { updatePassword } from "@/actions/settings"
import { signOut } from "next-auth/react"

export default function SecuritySettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null)

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) {
      setMessage({ type: "error", text: "Please fill in all fields." })
      return
    }

    setLoading(true)
    setMessage(null)

    const formData = new FormData()
    formData.append("currentPassword", currentPassword)
    formData.append("newPassword", newPassword)

    const result = await updatePassword(formData)

    if (result.error) {
      setMessage({ type: "error", text: result.error })
    } else {
      setMessage({ type: "success", text: "Password updated successfully!" })
      setCurrentPassword("")
      setNewPassword("")
    }

    setLoading(false)
  }

  const handleLogoutAll = async () => {
    if (confirm("Are you sure you want to log out?")) {
      await signOut({ callbackUrl: "/login" })
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold border-b border-white/10 pb-4">Security Settings</h2>
      
      <div className="space-y-6">
        <div className="p-4 bg-white/[0.02] border border-white/10 rounded-xl space-y-4">
          <div>
            <h3 className="font-medium text-white">Change Password</h3>
            <p className="text-sm text-neutral-400 mt-1">Update your account password.</p>
          </div>
          <div className="space-y-3">
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="block w-full px-3 py-2 border border-white/10 rounded-xl bg-white/[0.05] text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#22D3EE] transition-all"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="block w-full px-3 py-2 border border-white/10 rounded-xl bg-white/[0.05] text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#22D3EE] transition-all"
            />
            
            {message && (
              <div className={`p-3 rounded-md text-sm ${message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                {message.text}
              </div>
            )}

            <button
              type="button"
              onClick={handleUpdatePassword}
              disabled={loading}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>

        <div className="p-4 bg-white/[0.02] border border-white/10 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-white">Active Sessions</h3>
              <p className="text-sm text-neutral-400 mt-1">Manage devices logged into your account.</p>
            </div>
            <button
              type="button"
              onClick={handleLogoutAll}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium rounded-xl transition-all border border-red-500/20"
            >
              Logout All Devices
            </button>
          </div>
          <div className="pt-2 text-sm text-neutral-500">
            Current Session: Windows PC (Chrome) - Active now
          </div>
        </div>
      </div>
    </div>
  )
}
