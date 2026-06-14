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
  }`
}
