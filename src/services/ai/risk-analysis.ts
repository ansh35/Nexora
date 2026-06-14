import { aiProvider } from "./groq-provider"
import { schemas } from "./validators"

export async function executeRiskAnalysis(tasksJson: string) {
  const prompt = `Analyze these tasks and identify potential risks to the project schedule, scope, or quality.
  Tasks:
  ${tasksJson}`

  return await aiProvider.generateStructuredResponse<{risks: {title: string, severity: string, mitigation: string}[]}>(
    prompt, 
    schemas.riskDetection
  )
}
