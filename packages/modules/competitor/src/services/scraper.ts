import { analyzeUrl, SeoReport } from "seo";

export interface CompetitorAnalysis {
  competitorUrl: string;
  seoMetrics: SeoReport;
  sharedKeywords: string[];
}

export async function analyzeCompetitor(url: string): Promise<CompetitorAnalysis> {
  const seoMetrics = await analyzeUrl(url);
  
  return {
    competitorUrl: url,
    seoMetrics,
    sharedKeywords: ["marketing", "b2b", "saas"]
  };
}
