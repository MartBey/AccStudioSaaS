import { SeoRequest, SeoResponse, SeoIssue } from "types";

const PAGESPEED_API_URL = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

interface LighthouseAudit {
  id: string;
  title: string;
  description: string;
  score: number | null;
  scoreDisplayMode: string;
}

interface PageSpeedResult {
  lighthouseResult: {
    categories: {
      performance: { score: number };
      accessibility: { score: number };
      "best-practices": { score: number };
      seo: { score: number };
    };
    audits: Record<string, LighthouseAudit>;
  };
  loadingExperience?: {
    metrics?: {
      LARGEST_CONTENTFUL_PAINT_MS?: { percentile: number };
      FIRST_INPUT_DELAY_MS?: { percentile: number };
    };
  };
}

// PageSpeed Insights API'den gerçek veri çek
async function fetchPageSpeedData(url: string, apiKey?: string): Promise<PageSpeedResult> {
  const params = new URLSearchParams({
    url,
    strategy: "MOBILE",
    locale: "tr",
  });

  // Birden fazla category eklenmesi gerektiğinde append kullanılır
  params.append("category", "PERFORMANCE");
  params.append("category", "ACCESSIBILITY");
  params.append("category", "BEST_PRACTICES");
  params.append("category", "SEO");

  // API key varsa ekle (opsiyonel — key olmadan da çalışır ama rate limit var)
  if (apiKey) {
    params.append("key", apiKey);
  }

  const response = await fetch(`${PAGESPEED_API_URL}?${params.toString()}`);

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`PageSpeed API hatası (${response.status}): ${errorData}`);
  }

  return response.json();
}

// Lighthouse audit'lerinden SEO sorunlarını çıkart
function extractIssues(audits: Record<string, LighthouseAudit>): SeoIssue[] {
  const issues: SeoIssue[] = [];

  const criticalAudits = [
    "meta-description",
    "document-title",
    "http-status-code",
    "image-alt",
    "link-text",
    "crawlable-anchors",
    "robots-txt",
    "canonical",
    "hreflang",
    "font-size",
    "tap-targets",
    "is-crawlable",
    "structured-data",
    "viewport",
    "render-blocking-resources",
    "uses-responsive-images",
    "uses-optimized-images",
    "uses-text-compression",
    "largest-contentful-paint",
    "total-blocking-time",
    "cumulative-layout-shift",
  ];

  for (const auditId of criticalAudits) {
    const audit = audits[auditId];
    if (!audit || audit.score === null || audit.score === 1) continue;

    let type: "error" | "warning" | "info" = "info";
    if (audit.score === 0) type = "error";
    else if (audit.score < 0.9) type = "warning";

    issues.push({
      id: audit.id,
      type,
      title: audit.title,
      description: audit.description.replace(/\[.*?\]\(.*?\)/g, "").trim(), // Markdown linkleri temizle
    });
  }

  return issues.slice(0, 10); // En fazla 10 sorun göster
}

export async function analyzeWebsite(request: SeoRequest): Promise<SeoResponse> {
  const apiKey = process.env.PAGESPEED_API_KEY;

  try {
    const data = await fetchPageSpeedData(request.url, apiKey);

    const categories = data.lighthouseResult.categories;
    const audits = data.lighthouseResult.audits;

    // Core Web Vitals'dan load time hesapla
    const lcpMs = data.loadingExperience?.metrics?.LARGEST_CONTENTFUL_PAINT_MS?.percentile;
    const loadTimeMs = lcpMs || Math.round((audits["largest-contentful-paint"]?.score || 0.5) * 5000);

    // Kelime sayısı tahmini (DOM audit'inden)
    const domSizeAudit = audits["dom-size"];
    const wordCount = domSizeAudit?.score 
      ? Math.round(domSizeAudit.score * 2000 + 300) 
      : 800;

    return {
      id: `scan_${Date.now().toString(36)}`,
      url: request.url,
      keyword: request.keyword,
      timestamp: new Date(),
      scores: {
        performance: Math.round((categories.performance?.score || 0) * 100),
        accessibility: Math.round((categories.accessibility?.score || 0) * 100),
        bestPractices: Math.round((categories["best-practices"]?.score || 0) * 100),
        seo: Math.round((categories.seo?.score || 0) * 100),
      },
      issues: extractIssues(audits),
      wordCount,
      loadTimeMs,
    };
  } catch (error: any) {
    console.error("PageSpeed API error:", error?.message || error);

    // Fallback: API çalışmazsa mock veri dön
    return generateFallbackAnalysis(request, error?.message);
  }
}

function generateFallbackAnalysis(request: SeoRequest, errorMessage?: string): SeoResponse {
  return {
    id: `fallback_${Date.now().toString(36)}`,
    url: request.url,
    keyword: request.keyword,
    timestamp: new Date(),
    scores: {
      performance: 0,
      accessibility: 0,
      bestPractices: 0,
      seo: 0,
    },
    issues: [
      {
        id: "api-error",
        type: "error",
        title: "PageSpeed API Bağlantı Hatası",
        description: errorMessage || "PageSpeed API'ye bağlanılamadı. URL'in doğruluğunu kontrol edin veya daha sonra tekrar deneyin.",
      },
    ],
    wordCount: 0,
    loadTimeMs: 0,
  };
}
