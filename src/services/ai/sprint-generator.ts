import { aiProvider } from "./groq-provider"
import { schemas } from "./validators"

export async function executeSprintGenerator(tasksJson: string, focusArea: string) {
  const prompt = `Given the project focus area "${focusArea}" and the following backlog of tasks, suggest which tasks should be included in the next 2-week sprint.
  Tasks Backlog:
  ${tasksJson}`

  return await aiProvider.generateStructuredResponse<{sprintGoal: string, selectedTaskIds: string[]}>(
    prompt, 
    schemas.sprintGenerator
  )
}
