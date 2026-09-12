import { z } from "zod";

export const schemas = {
  taskBreakdown: `
  {
    "subtasks": [
      {
        "title": "Short title",
        "description": "Brief description"
      }
    ]
  }`,
  projectPlan: `
  {
    "phases": [
      {
        "name": "Phase Name",
        "description": "Phase Description",
        "tasks": ["Task 1", "Task 2"]
      }
    ]
  }`,
  meetingNotes: `
  {
    "tasks": [
      {
        "title": "Task title",
        "description": "Task description",
        "priority": "HIGH" | "MEDIUM" | "LOW"
      }
    ]
  }`,
  taskSummaries: `
  {
    "summary": "A 2-3 sentence overview of project progress.",
    "blockers": ["List of potential blockers inferred"],
    "nextSteps": ["List of high priority next steps"]
  }`,
  riskDetection: `
  {
    "risks": [
      {
        "title": "Risk title",
        "severity": "HIGH" | "MEDIUM" | "LOW",
        "mitigation": "Suggested mitigation strategy"
      }
    ]
  }`,
  sprintGenerator: `
  {
    "sprintGoal": "One sentence describing the goal of this sprint",
    "selectedTaskIds": ["id1", "id2"]
  }`,
  titleEnhancement: `
  {
    "title": "A concise, professional, actionable title under 12 words"
  }`,
  descriptionGeneration: `
  {
    "description": "A clear, concise, enterprise-appropriate description"
  }`
}

export const zodSchemas = {
  taskBreakdown: z.object({
    subtasks: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    ),
  }),
  projectPlan: z.object({
    phases: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        tasks: z.array(z.string()),
      })
    ),
  }),
  meetingNotes: z.object({
    tasks: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        priority: z.string(),
      })
    ),
  }),
  taskSummaries: z.object({
    summary: z.string(),
    blockers: z.array(z.string()),
    nextSteps: z.array(z.string()),
  }),
  riskDetection: z.object({
    risks: z.array(
      z.object({
        title: z.string(),
        severity: z.string(),
        mitigation: z.string(),
      })
    ),
  }),
  sprintGenerator: z.object({
    sprintGoal: z.string(),
    selectedTaskIds: z.array(z.string()),
  }),
  titleEnhancement: z.object({
    title: z.string(),
  }),
  descriptionGeneration: z.object({
    description: z.string(),
  }),
};
