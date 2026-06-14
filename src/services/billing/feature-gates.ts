import { getOrganizationSubscription } from "./subscription-service"

export async function checkFeatureGate(
  organizationId: string, 
  featureName: 'advanced_analytics' | 'real_time_collaboration'
): Promise<boolean> {
  const sub = await getOrganizationSubscription(organizationId)
  if (sub.isEnterprise) return true
  if (sub.isPro) return true
  
  return false
}
