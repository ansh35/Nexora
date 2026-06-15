"use client"

import { useState } from "react"
import { Sparkles, Check, RefreshCw, X, Loader2 } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useMotion } from "@/components/motion/motion-provider"

type AIFieldAssistantProps = {
  fieldValue: string
  context: string
  onAccept: (value: string) => void
  generateAction: (currentValue: string, context: string) => Promise<{ success?: boolean, data?: string, error?: string }>
  label: string
}

export function AIFieldAssistant({ fieldValue, context, onAccept, generateAction, label }: AIFieldAssistantProps) {
  const [suggestion, setSuggestion] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useMotion()

  const handleGenerate = async () => {
    setIsGenerating(true)
    setSuggestion(null)
    const result = await generateAction(fieldValue, context)
    if (result.error) {
      toast({ title: "AI Error", description: result.error, type: "error" })
    } else if (result.data) {
      setSuggestion(result.data)
    }
    setIsGenerating(false)
  }

  const handleAccept = () => {
    if (suggestion) {
      onAccept(suggestion)
      setSuggestion(null)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleGenerate}
        disabled={isGenerating}
        className="inline-flex items-center gap-1.5 ml-2 text-xs font-medium text-[#22D3EE] hover:text-[#06B6D4] transition-colors disabled:opacity-50 p-1 rounded-md hover:bg-[#22D3EE]/10"
        title={label}
      >
        {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
        <span>{isGenerating ? "AI Generating..." : label}</span>
      </button>

      <AnimatePresence>
        {suggestion && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -5 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -5 }}
            className="overflow-hidden"
          >
            <div className="mt-2 mb-1 bg-[#22D3EE]/5 border border-[#22D3EE]/20 p-3.5 rounded-xl flex flex-col gap-3 backdrop-blur-sm">
              <div className="text-sm text-white/90 leading-relaxed font-medium">
                <span className="text-[#22D3EE] mr-2">✨</span>
                {suggestion}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAccept}
                  className="flex items-center gap-1.5 bg-[#22D3EE]/20 hover:bg-[#22D3EE]/30 text-[#22D3EE] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                >
                  <Check className="w-3.5 h-3.5" /> Accept
                </button>
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="flex items-center gap-1.5 bg-white/[0.05] hover:bg-white/10 text-neutral-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                </button>
                <button
                  type="button"
                  onClick={() => setSuggestion(null)}
                  className="flex items-center gap-1 bg-white/[0.05] hover:bg-white/10 text-neutral-400 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ml-auto"
                  title="Dismiss"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
