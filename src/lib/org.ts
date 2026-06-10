import { auth } from "@/../auth"
import prisma from "@/lib/prisma"

/**
 * Retrieves the current organization based on the session's organizationId
 */
export async function getCurrentOrganization() {
  const session = await auth()
  
  if (!session?.user?.organizationId) {
    return null
  }
  
  const org = await prisma.organization.findUnique({
    where: { id: session.user.organizationId }
  })
  
  return org
}

/**
 * Checks if the current authenticated user is a member of the given organizationId
 */
export async function checkOrganizationMembership(organizationId: string) {
  const session = await auth()
  
  if (!session?.user?.organizationId || session.user.organizationId !== organizationId) {
    return false
  }
  
  return true
}
