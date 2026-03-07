export interface SeoRequest {
  url: string;
  keyword?: string;
}

export interface SeoScore {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
}

export interface SeoIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
}

export interface SeoResponse {
  id: string;
  url: string;
  keyword?: string;
  timestamp: Date;
  scores: SeoScore;
  issues: SeoIssue[];
  wordCount: number;
  loadTimeMs: number;
}
