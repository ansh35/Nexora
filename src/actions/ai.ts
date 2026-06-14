"use server"

import { auth } from "@/../auth"
import prisma from "@/lib/prisma"
import { checkAiQuota, incrementAiUsage } from "@/services/billing/usage-service"

import { executeTaskBreakdown } from "@/services/ai/task-breakdown"
import { executeProjectPlan } from "@/services/ai/planner"
import { executeMeetingParser } from "@/services/ai/meeting-parser"
import { executeSummarizer } from "@/services/ai/summarizer"
import { executeRiskAnalysis } from "@/services/ai/risk-analysis"
import { executeSprintGenerator } from "@/services/ai/sprint-generator"

async function verifyAccessAndQuota() {
  const session = await auth()
  if (!session?.user?.organizationId) throw new Error("Unauthorized")
  
  const hasQuota = await checkAiQuota(session.user.organizationId)
  if (!hasQuota) throw new Error("AI Quota Exceeded. Please upgrade your plan.")
  
  return { organizationId: session.user.organizationId, userId: session.user.id }
}

export async function generateTaskBreakdown(taskId: string) {
  try {
    const { organizationId, userId } = await verifyAccessAndQuota()
    
    const task = await prisma.task.findUnique({
      where: { id: taskId, organizationId }
    })
    if (!task) throw new Error("Task not found")
    
    const result = await executeTaskBreakdown(task.title, task.description || "N/A")
    await incrementAiUsage(organizationId, userId, "task_breakdown")
    
    return { success: true, data: result.subtasks }
  } catch (error: any) {
    return { error: error.message || "Failed to generate task breakdown" }
  }
}

export async function generateProjectPlan(name: string, description: string) {
  try {
    const { organizationId, userId } = await verifyAccessAndQuota()
    
    const result = await executeProjectPlan(name, description)
    await incrementAiUsage(organizationId, userId, "project_plan")
    
    return { success: true, data: result.phases }
  } catch (error: any) {
    return { error: error.message || "Failed to generate project plan" }
  }
}

export async function parseMeetingNotes(projectId: string, notes: string) {
  try {
    const { organizationId, userId } = await verifyAccessAndQuota()
    
    const project = await prisma.project.findUnique({
      where: { id: projectId, organizationId }
    })
    if (!project) throw new Error("Project not found")

    const result = await executeMeetingParser(notes)
    await incrementAiUsage(organizationId, userId, "meeting_parser")
    
    return { success: true, data: result.tasks }
  } catch (error: any) {
    return { error: error.message || "Failed to parse meeting notes" }
  }
}

export async function generateTaskSummaries(projectId: string) {
  try {
    const { organizationId, userId } = await verifyAccessAndQuota()
    
    const tasks = await prisma.task.findMany({
      where: { projectId, organizationId },
      select: { title: true, status: true, priority: true }
    })
    
    const result = await executeSummarizer(JSON.stringify(tasks, null, 2))
    await incrementAiUsage(organizationId, userId, "task_summaries")
    
    return { success: true, data: result }
  } catch (error: any) {
    return { error: error.message || "Failed to generate summary" }
  }
}

export async function detectProjectRisks(projectId: string) {
  try {
    const { organizationId, userId } = await verifyAccessAndQuota()
    
    const tasks = await prisma.task.findMany({
      where: { projectId, organizationId },
      select: { title: true, status: true, priority: true }
    })
    
    const result = await executeRiskAnalysis(JSON.stringify(tasks, null, 2))
    await incrementAiUsage(organizationId, userId, "risk_detection")
    
    return { success: true, data: result.risks }
  } catch (error: any) {
    return { error: error.message || "Failed to detect risks" }
  }
}

export async function generateSprint(projectId: string, focusArea: string) {
  try {
    const { organizationId, userId } = await verifyAccessAndQuota()
    
    const tasks = await prisma.task.findMany({
      where: { projectId, organizationId, status: "TODO" },
      select: { id: true, title: true, priority: true }
    })
    
    const result = await executeSprintGenerator(JSON.stringify(tasks, null, 2), focusArea)
    await incrementAiUsage(organizationId, userId, "sprint_generator")
    
    const selectedTasks = tasks.filter(t => result.selectedTaskIds.includes(t.id))
    
    return { success: true, data: { sprintGoal: result.sprintGoal, tasks: selectedTasks } }
  } catch (error: any) {
    return { error: error.message || "Failed to generate sprint" }
  }
}
