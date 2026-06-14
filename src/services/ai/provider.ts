export interface AiProvider {
  generateStructuredResponse<T>(prompt: string, schemaDescription: string): Promise<T>;
}
