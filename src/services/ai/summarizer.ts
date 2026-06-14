import { aiProvider } from "./groq-provider"
import { schemas } from "./validators"

export async function executeSummarizer(tasksJson: string) {
  const prompt = `Summarize the current progress and state of the project based on these tasks.
  Tasks:
  ${tasksJson}`

  return await aiProvider.generateStructuredResponse<{summary: string, blockers: string[], nextSteps: string[]}>(
    prompt, 
    schemas.taskSummaries
  )
}
