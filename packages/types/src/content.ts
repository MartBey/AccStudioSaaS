export type ContentType = 'blog' | 'social' | 'email';

export interface ContentRequest {
  prompt: string;
  type: ContentType;
  tone?: string;
  targetAudience?: string;
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
