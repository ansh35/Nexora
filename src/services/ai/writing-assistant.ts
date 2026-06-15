import { aiProvider } from "./groq-provider"
import { schemas } from "./validators"

export async function executeTitleEnhancement(currentTitle: string, context: string) {
  const prompt = `You are a Senior AI Product Engineer acting as an intelligent writing assistant. 
  Improve the following title to be professional, actionable, and under 12 words.
  
  Context: ${context}
  Current Title: ${currentTitle}
  
  Return ONLY valid JSON matching the exact schema. Do not include markdown formatting or extra text.`
  
  return await aiProvider.generateStructuredResponse<{title: string}>(
    prompt, 
    schemas.titleEnhancement
  )
}

export async function executeDescriptionGeneration(title: string, context: string) {
  const prompt = `You are a Senior AI Product Engineer acting as an intelligent writing assistant. 
  Generate a clear, concise, and enterprise-appropriate description based on the title.
  
  Context: ${context}
  Title: ${title}
  
  Return ONLY valid JSON matching the exact schema. Do not include markdown formatting or extra text.`
  
  return await aiProvider.generateStructuredResponse<{description: string}>(
    prompt, 
    schemas.descriptionGeneration
  )
}
