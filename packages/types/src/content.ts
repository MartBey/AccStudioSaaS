export type ContentType = "blog" | "social" | "email" | "product" | "ad" | "seo";

export interface ContentRequest {
  prompt: string;
  type: ContentType;
  tone?: string;
  targetAudience?: string;
  language?: "tr" | "en";
}

export interface ContentResponse {
  id: string;
  content: string;
  tokens: number;
  inputTokens?: number;
  outputTokens?: number;
  type: ContentType;
  createdAt: Date;
}
