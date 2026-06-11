import { CommandPalette } from "@/components/CommandPalette"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <CommandPalette />
      {children}
    </>
  )
}
