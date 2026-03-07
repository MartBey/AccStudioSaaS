export interface GenerationParams {
  topic: string;
  tone: "professional" | "casual" | "persuasive";
  length: "short" | "medium" | "long";
}

export async function generateContent(params: GenerationParams): Promise<string> {
  // TODO: Implement OpenAI integration
  return `Bu içerik ${params.topic} konusu hakkında ${params.tone} bir tonda ve ${params.length} uzunluğunda AI tarafından üretilmiştir.`;
}
