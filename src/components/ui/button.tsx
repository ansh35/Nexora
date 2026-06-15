import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-[#22D3EE] focus-visible:ring-[3px] focus-visible:ring-[#22D3EE]/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-[#22D3EE] text-[#070B14] hover:bg-[#06B6D4] hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] font-bold",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500/20",
        outline:
          "border border-white/10 bg-white/[0.05] hover:bg-white/[0.1] text-white backdrop-blur-xl",
        secondary:
          "bg-white/[0.05] text-white hover:bg-white/[0.1] backdrop-blur-xl",
        ghost:
          " text-neutral-300 hover:text-white",
        link: "text-[#22D3EE] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2 has-[>svg]:px-4",
        xs: "h-7 gap-1 rounded-lg px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 rounded-xl px-4 has-[>svg]:px-3",
        lg: "h-12 rounded-xl px-8 has-[>svg]:px-5 text-base",
        icon: "size-11",
        "icon-xs": "size-7 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const MotionSlot = motion.create ? motion.create(Slot.Root) : motion(Slot.Root);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? MotionSlot : motion.button

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.12 }}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(props as any)}
    />
  )
}

export { Button, buttonVariants }
