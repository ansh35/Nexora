import { aiProvider } from "./groq-provider"
import { schemas } from "./validators"

export async function executeTaskBreakdown(title: string, description: string) {
  const prompt = `Break down the following task into 3-5 smaller actionable subtasks.
  Task Title: ${title}
  Task Description: ${description}`
  
  return await aiProvider.generateStructuredResponse<{subtasks: {title: string, description: string}[]}>(
    prompt, 
    schemas.taskBreakdown
  )
}
