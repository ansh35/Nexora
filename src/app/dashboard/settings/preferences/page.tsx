"use client"

import { useState, useEffect } from "react"

export default function PreferencesSettingsPage() {
  const [theme, setTheme] = useState("Dark Mode (Luxury)")
  const [language, setLanguage] = useState("English (US)")
  const [timezone, setTimezone] = useState("UTC (Auto)")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null)

  // Load preferences from local storage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("app_theme")
    const savedLang = localStorage.getItem("app_language")
    const savedTz = localStorage.getItem("app_timezone")

    if (savedTheme) setTheme(savedTheme)
    if (savedLang) setLanguage(savedLang)
    if (savedTz) setTimezone(savedTz)
  }, [])

  const handleSave = () => {
    setLoading(true)
    setMessage(null)

    // Simulate API delay
    setTimeout(() => {
      localStorage.setItem("app_theme", theme)
      localStorage.setItem("app_language", language)
      localStorage.setItem("app_timezone", timezone)

      setMessage({ type: "success", text: "Preferences saved successfully!" })
      setLoading(false)

      // Hide message after 3 seconds
      setTimeout(() => setMessage(null), 3000)
    }, 500)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold border-b border-white/10 pb-4">App Preferences</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
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

        <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
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

        <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
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
        <div className={`p-3 rounded-md text-sm ${message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
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
