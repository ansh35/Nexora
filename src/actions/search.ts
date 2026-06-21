"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/../auth"

export async function globalSearch(query: string) {
  const session = await auth()
  if (!session?.user?.organizationId) return { projects: [], tasks: [], members: [] }

  const q = query.toLowerCase().substring(0, 100)
  if (!q.trim()) return { projects: [], tasks: [], members: [] }

  const orgId = session.user.organizationId

  const projects = await prisma.project.findMany({
    where: {
      organizationId: orgId,
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } }
      ]
    },
    take: 5
  })

  const tasks = await prisma.task.findMany({
    where: {
      organizationId: orgId,
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } }
      ]
    },
    take: 5
  })

  const members = await prisma.user.findMany({
    where: {
      organizationId: orgId,
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } }
      ]
    },
    take: 5
  })

  return { projects, tasks, members }
}
