import { redirect } from "next/navigation"
import { auth } from "@/../auth"

export default async function BillingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  // Members have no access to billing
  if (session.user.role === "MEMBER") {
    redirect("/dashboard")
  }

  return <>{children}</>
}
