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
  /**
   * Tahmini maliyet (USD) — AI çağrılarının fiyatlandırılması için kullanılır.
   */
  estimatedCostUsd?: number;
  type: ContentType;
  createdAt: Date;
}
