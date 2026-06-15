"use client"

import { motion } from "framer-motion"
import { Sparkles, Users, BarChart3, ShieldCheck, Cpu } from "lucide-react"

const features = [
  {
    title: "AI Productivity Assistant",
    description: "Get intelligent insights, summaries, and suggestions to save hours every day.",
    icon: Sparkles,
  },
  {
    title: "Real-time Collaboration",
    description: "Work together in real time with live updates, presence, and activity tracking.",
    icon: Users,
  },
  {
    title: "Smart Analytics",
    description: "Track progress, analyze performance, and make data-driven decisions.",
    icon: BarChart3,
  },
  {
    title: "Enterprise Security",
    description: "Your data is protected with enterprise-grade security and role-based access.",
    icon: ShieldCheck,
  },
]

export function AuthMarketing() {
  return (
    <div className="relative w-full min-h-screen bg-[#070B14] overflow-hidden flex flex-col py-8 lg:py-12 px-8 lg:px-16 text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Soft cyan radial gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#22D3EE] opacity-[0.15] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#06B6D4] opacity-[0.1] blur-[100px] rounded-full" />
        
        {/* Low-opacity grid texture */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
      </div>

      <div className="relative z-10 flex flex-col justify-between flex-1 max-w-3xl mx-auto w-full">
        {/* Header/Logo */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#22D3EE] to-[#06B6D4] flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
              <Sparkles className="w-5 h-5 text-[#070B14]" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Nexora</span>
          </div>
        </motion.div>

        {/* Hero Content */}
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6"
          >
            Organize Work.<br />
            Accelerate Teams.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22D3EE] to-[#06B6D4]">Powered by AI.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-lg text-white/65 max-w-xl leading-relaxed"
          >
            Nexora brings projects, tasks, teams, and AI together in one intelligent workspace to help you plan smarter, collaborate faster, and ship better.
          </motion.p>
        </div>

        {/* Feature Cards Grid */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
              }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 z-20"
        >
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              className="bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] hover:border-[#22D3EE]/30 transition-all duration-300 rounded-2xl p-5 backdrop-blur-md group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-white/[0.05] text-[#22D3EE] group-hover:bg-[#22D3EE]/10 group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-white group-hover:text-[#22D3EE] transition-colors">{feature.title}</h3>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
