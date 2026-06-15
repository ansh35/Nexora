import { Groq } from "groq-sdk"
import { AiProvider } from "./provider"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "dummy_groq",
})

export class GroqProvider implements AiProvider {
  async generateStructuredResponse<T>(prompt: string, schemaDescription: string): Promise<T> {
    const systemPrompt = `You are a senior AI Product Architect and productivity assistant. Analyze the given information and return ONLY valid JSON.
    
Expected JSON Schema (do not deviate):
${schemaDescription}`
    
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

      const content = response.choices[0]?.message?.content
      if (!content) throw new Error("Empty response from Groq")

      return JSON.parse(content) as T
    } catch (error: unknown) {
      console.error("Groq generation failed:", error)
      throw new Error(`AI Generation failed: ${error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error)}`)
    }
  }
}

export const aiProvider = new GroqProvider()
