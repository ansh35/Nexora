import { Groq } from "groq-sdk"
import { z } from "zod"
import { AiProvider } from "./provider"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "dummy_groq",
})

export class GroqProvider implements AiProvider {
  async generateStructuredResponse<T>(
    prompt: string, 
    schemaDescription: string,
    schema?: z.ZodType<T>
  ): Promise<T> {
    const systemPrompt = `You are a senior AI Product Architect and productivity assistant. Analyze the given information and return ONLY valid JSON.
    
Expected JSON Schema (do not deviate):
${schemaDescription}`
    
    let content: string | null | undefined

    try {
      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      })

      content = response.choices[0]?.message?.content
    } catch (error: unknown) {
      console.error("Groq generation failed:", error)
      throw new Error(`AI Generation failed: ${error instanceof Error ? error.message : "Service request failed"}`)
    }

    if (!content) {
      throw new Error("AI Generation failed: Empty response received from model")
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(content)
    } catch (jsonErr: unknown) {
      console.error("Failed to parse AI response as JSON:", jsonErr)
      throw new Error("AI Generation failed: Model returned malformed or invalid JSON")
    }

    if (schema) {
      const validationResult = schema.safeParse(parsed)
      if (!validationResult.success) {
        console.error("AI response schema validation failed:", validationResult.error.format())
        throw new Error("AI Generation failed: Model output did not match expected structure")
      }
      return validationResult.data
    }

    return parsed as T
  }
}

export const aiProvider = new GroqProvider()
