import { aiProvider } from "./groq-provider"
import { schemas } from "./validators"

export async function executeProjectPlan(name: string, description: string) {
  const prompt = `Create a high-level project plan for the following project.
  Name: ${name}
  Description: ${description}`

  return await aiProvider.generateStructuredResponse<{phases: {name: string, description: string, tasks: string[]}[]}>(
    prompt, 
    schemas.projectPlan
  )
}
