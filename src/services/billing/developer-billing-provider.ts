import { BillingProvider } from "./provider"
import prisma from "@/lib/prisma"

export class DeveloperBillingProvider implements BillingProvider {
  async checkout(organizationId: string, planId: string): Promise<string> {
    await this.upgrade(organizationId, planId)
    return "/dashboard/billing?success=true"
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async portal(_organizationId: string): Promise<string> {
    return "/dashboard/billing?manage=true"
  }

  async upgrade(organizationId: string, planId: string): Promise<void> {
    await prisma.organization.update({
      where: { id: organizationId },
      data: {
        billingProvider: "developer",
        subscriptionPlan: planId,
        subscriptionStatus: "ACTIVE",
        subscriptionActivatedAt: new Date(),
        subscriptionExpiresAt: null,
      }
    })
  }

  async downgrade(organizationId: string, planId: string): Promise<void> {
    await prisma.organization.update({
      where: { id: organizationId },
      data: {
        billingProvider: "developer",
        subscriptionPlan: planId,
        subscriptionStatus: "ACTIVE",
        subscriptionActivatedAt: new Date(),
        subscriptionExpiresAt: null,
      }
    })
  }
}

export const billingProvider = new DeveloperBillingProvider()
