"use server"

import { auth } from "@/../auth"
import prisma from "@/lib/prisma"
import { getCurrentOrganization } from "@/lib/org"
import { subDays, format, startOfDay } from "date-fns"

export type AnalyticsData = {
  overview: {
    totalTasks: number
    completedTasks: number
    completionRate: number
    activeProjects: number
  }
  productivity: {
    date: string
    completed: number
  }[]
  projectHealth: {
    name: string
    todo: number
    inProgress: number
    done: number
  }[]
  kanbanInsights: {
    name: string
    value: number
  }[]
  teamPerformance?: {
    name: string
    completed: number
  }[]
  workloadDistribution?: {
    name: string
    active: number
  }[]
}

export async function getAnalyticsData(): Promise<AnalyticsData | null> {
  const session = await auth()
  if (!session?.user) return null

  const org = await getCurrentOrganization()
  if (!org) return null

  const isMember = session.user.role === "MEMBER"
  
  // Base task query condition based on role
  const taskWhere = isMember 
    ? { organizationId: org.id, assigneeId: session.user.id }
    : { organizationId: org.id }

  // 1. Overview Metrics
  const totalTasks = await prisma.task.count({ where: taskWhere })
  const completedTasks = await prisma.task.count({ 
    where: { ...taskWhere, status: "DONE" } 
  })
  
  // Only count projects where user has tasks if member, else all projects
  const activeProjects = isMember 
    ? (await prisma.task.findMany({
        where: taskWhere,
        select: { projectId: true },
        distinct: ['projectId']
      })).length
    : await prisma.project.count({
        where: { organizationId: org.id, status: "ACTIVE" }
      })

  const overview = {
    totalTasks,
    completedTasks,
    completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    activeProjects
  }

  // 2. Productivity Insights (Last 7 Days)
  const sevenDaysAgo = startOfDay(subDays(new Date(), 6))
  
  const recentCompletedTasks = await prisma.task.findMany({
    where: {
      ...taskWhere,
      status: "DONE",
      updatedAt: { gte: sevenDaysAgo }
    },
    select: { updatedAt: true }
  })

  // Initialize last 7 days array
  const productivityMap = new Map<string, number>()
  for (let i = 6; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'MMM dd')
    productivityMap.set(date, 0)
  }

  recentCompletedTasks.forEach(task => {
    const dateStr = format(task.updatedAt, 'MMM dd')
    if (productivityMap.has(dateStr)) {
      productivityMap.set(dateStr, (productivityMap.get(dateStr) || 0) + 1)
    }
  })

  const productivity = Array.from(productivityMap.entries()).map(([date, completed]) => ({
    date,
    completed
  }))

  // 3. Project Health
  const projects = await prisma.project.findMany({
    where: { organizationId: org.id, status: "ACTIVE" },
    include: {
      tasks: {
        where: isMember ? { assigneeId: session.user.id } : undefined
      }
    }
  })

  const projectHealth = projects.map(p => {
    return {
      name: p.name,
      todo: p.tasks.filter(t => t.status === "TODO").length,
      inProgress: p.tasks.filter(t => t.status === "IN_PROGRESS").length,
      done: p.tasks.filter(t => t.status === "DONE").length,
    }
  }).filter(p => isMember ? (p.todo + p.inProgress + p.done > 0) : true)

  // 4. Kanban Insights
  const allTasks = await prisma.task.findMany({ where: taskWhere, select: { status: true } })
  const kanbanInsights = [
    { name: 'To Do', value: allTasks.filter(t => t.status === "TODO").length },
    { name: 'In Progress', value: allTasks.filter(t => t.status === "IN_PROGRESS").length },
    { name: 'Done', value: allTasks.filter(t => t.status === "DONE").length },
  ]

  let teamPerformance, workloadDistribution

  // 5 & 6. Admin Only Metrics
  if (!isMember) {
    const users = await prisma.user.findMany({
      where: { organizationId: org.id },
      include: {
        tasksAssigned: {
          where: { organizationId: org.id }
        }
      }
    })

    teamPerformance = users.map(u => ({
      name: u.name,
      completed: u.tasksAssigned.filter(t => t.status === "DONE").length
    }))

    workloadDistribution = users.map(u => ({
      name: u.name,
      active: u.tasksAssigned.filter(t => t.status !== "DONE").length
    }))
  }

  return {
    overview,
    productivity,
    projectHealth,
    kanbanInsights,
    ...(teamPerformance && { teamPerformance }),
    ...(workloadDistribution && { workloadDistribution })
  }
}
