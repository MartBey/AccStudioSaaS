import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export interface SeoAnalysisRequest {
  siteJson: string; // The serialized Craft.js Canvas JSON
}

const SeoAnalysisResultSchema = z.object({
  score: z.number().describe("1 ile 100 arasında genel SEO skoru"),
  strengths: z.array(z.string()).describe("Sitenin SEO açısından güçlü yönleri"),
  weaknesses: z.array(z.string()).describe("Sitenin SEO açısından zayıf ve düzeltilmesi gereken yönleri"),
  recommendations: z.array(z.string()).describe("Hız puanını 95+ yapmak ve SEO'yu iyileştirmek için HTML/yapısal öneriler")
});

export type SeoAnalysisResult = z.infer<typeof SeoAnalysisResultSchema>;

export async function analyzeSiteSeo({ siteJson }: SeoAnalysisRequest): Promise<SeoAnalysisResult> {
  const systemPrompt = `Sen uzman bir Teknik SEO ve Performans (Core Web Vitals) analistisin. 
Sana bir web sitesinin yapısal JSON (Craft.js formatında bloklar) ağacını vereceğim.
Bu yapıyı incele ve:
1. Tahmini bir SEO / Performans skoru (1-100) ver.
2. Güçlü ve zayıf yönleri listele.
3. Hız puanını 95+ seviyesine çıkartmak ve Arama Motoru Optimizasyonunu (SEO) iyileştirmek için net öneriler sun (örn: Görsellerde alt etiket eksik, H1 hiyerarşisi yanlış, çok fazla JS bloğu var vb.).
Aşağıdaki site verisini dikkatlice analiz et.`;

  try {
    const { object } = await generateObject({
      model: google("gemini-1.5-pro"),
      system: systemPrompt,
      prompt: `Site JSON Verisi:\n${siteJson}`,
      schema: SeoAnalysisResultSchema,
    });

    return object;
  } catch (error) {
    console.error("SEO Analysis Error:", error);
    throw new Error("Failed to analyze site SEO.");
  }
}
