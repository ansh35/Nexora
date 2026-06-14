"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SubscriptionPlan, plans } from "@/config/subscriptions"
import { simulateUpgrade } from "@/actions/billing"

interface BillingFormProps {
  subscriptionPlan: SubscriptionPlan & {
    isPro: boolean
    isEnterprise: boolean
    subscriptionStatus: string
    subscriptionActivatedAt: Date | null
    subscriptionExpiresAt: Date | null
  }
  isOwner: boolean
}

export function BillingForm({ subscriptionPlan, isOwner }: BillingFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()

  const handleSimulate = async (planId: string) => {
    setIsLoading(true)
    const res = await simulateUpgrade(planId)
    if (res.error) {
      alert(`Error: ${res.error}`)
    } else {
      router.refresh()
    }
    setIsLoading(false)
  }

  return (
    <div className="grid gap-6">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className="rounded-lg border bg-card p-6 shadow-sm"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1 space-y-1">
              <h3 className="text-xl font-semibold leading-none tracking-tight">
                {plan.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {plan.description}
              </p>
              <div className="text-sm text-muted-foreground mt-4">
                <strong>Limits:</strong> {plan.features.maxProjects === Infinity ? "Unlimited" : plan.features.maxProjects} Projects, {plan.features.maxUsers === Infinity ? "Unlimited" : plan.features.maxUsers} Users
              </div>
            </div>

            <div className="mt-4 flex items-center md:mt-0">
              {subscriptionPlan.id === plan.id ? (
                <div className="flex flex-col space-y-2 items-end">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    Current Plan
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Status: {subscriptionPlan.subscriptionStatus}
                  </p>
                </div>
              ) : (
                isOwner && (
                  <button
                    onClick={() => handleSimulate(plan.id)}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
                  >
                    {isLoading ? "Loading..." : (plan.id === "free" ? "Downgrade" : "Upgrade to " + plan.name)}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
