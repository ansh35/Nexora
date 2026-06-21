"use client"

import { useState } from "react"
import { useMotion } from "@/components/motion/motion-provider"

export default function PreferencesSettingsPage() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("app_theme") || "Dark Mode (Luxury)"
    return "Dark Mode (Luxury)"
  })
  const [language, setLanguage] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("app_language") || "English (US)"
    return "English (US)"
  })
  const [timezone, setTimezone] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("app_timezone") || "UTC (Auto)"
    return "UTC (Auto)"
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "error"; text: string } | null>(null)
  const { toast } = useMotion()

  const handleSave = () => {
    setLoading(true)
    setMessage(null)

    // Simulate API delay
    setTimeout(() => {
      localStorage.setItem("app_theme", theme)
      localStorage.setItem("app_language", language)
      localStorage.setItem("app_timezone", timezone)

      toast({
        title: "Preferences Saved",
        description: "Your interface settings have been updated.",
        type: "success"
      })
      setLoading(false)
    }, 500)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold border-b border-white/10 pb-4">App Preferences</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/10 rounded-xl">
          <div>
            <h3 className="font-medium text-white">Theme Mode</h3>
            <p className="text-sm text-neutral-400 mt-1">Select your preferred color interface.</p>
          </div>
          <select 
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="bg-[#070B14] border border-white/10 text-white text-sm rounded-lg focus:ring-[#22D3EE] focus:border-[#22D3EE] block p-2.5"
          >
            <option value="Dark Mode (Luxury)">Dark Mode (Luxury)</option>
            <option value="Light Mode (Coming Soon)" disabled>Light Mode (Coming Soon)</option>
            <option value="System Sync" disabled>System Sync</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/10 rounded-xl">
          <div>
            <h3 className="font-medium text-white">Language</h3>
            <p className="text-sm text-neutral-400 mt-1">Select your primary language.</p>
          </div>
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-[#070B14] border border-white/10 text-white text-sm rounded-lg focus:ring-[#22D3EE] focus:border-[#22D3EE] block p-2.5"
          >
            <option value="English (US)">English (US)</option>
            <option value="Spanish" disabled>Spanish</option>
            <option value="French" disabled>French</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/10 rounded-xl">
          <div>
            <h3 className="font-medium text-white">Timezone</h3>
            <p className="text-sm text-neutral-400 mt-1">Set your local timezone for dates.</p>
          </div>
          <select 
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="bg-[#070B14] border border-white/10 text-white text-sm rounded-lg focus:ring-[#22D3EE] focus:border-[#22D3EE] block p-2.5"
          >
            <option value="UTC (Auto)">UTC (Auto)</option>
            <option value="EST" disabled>EST</option>
            <option value="PST" disabled>PST</option>
          </select>
        </div>
      </div>

      {message && (
        <div className="p-3 rounded-md text-sm bg-red-500/10 text-red-400 border border-red-500/20">
          {message.text}
        </div>
      )}

      <div className="pt-4 flex items-center justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all focus-visible:outline-none disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </div>
  )
}
