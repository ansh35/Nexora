export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  features: {
    maxProjects: number
    maxUsers: number
    maxAiRequests: number
  }
}

export const freePlan: SubscriptionPlan = {
  id: "free",
  name: "Free",
  description: "Basic features for individuals and small teams.",
  features: {
    maxProjects: 3,
    maxUsers: 5,
    maxAiRequests: 100,
  },
}

export const proPlan: SubscriptionPlan = {
  id: "pro",
  name: "Pro",
  description: "Advanced features and unlimited projects.",
  features: {
    maxProjects: Infinity,
    maxUsers: Infinity,
    maxAiRequests: 500,
  },
}

export const enterprisePlan: SubscriptionPlan = {
  id: "enterprise",
  name: "Enterprise",
  description: "Custom solutions for large organizations.",
  features: {
    maxProjects: Infinity,
    maxUsers: Infinity,
    maxAiRequests: Infinity,
  },
}

export const plans = [freePlan, proPlan, enterprisePlan]
