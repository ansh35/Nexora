import { z } from "zod";

export interface AiProvider {
  generateStructuredResponse<T>(
    prompt: string,
    schemaDescription: string,
    schema?: z.ZodType<T>
  ): Promise<T>;
}
