import { GoogleGenerativeAI } from "@google/generative-ai";

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not defined.");
  }
  return new GoogleGenerativeAI(apiKey);
}

export const GEMINI_MODEL = "gemini-2.0-flash";

export interface JuryEvaluationParams {
  projectDescription: string;
  freelancerProfile: string;
  proposalContent: string;
}

export interface JuryEvaluationResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
}

export async function evaluateWithJury(params: JuryEvaluationParams): Promise<JuryEvaluationResult> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

  const prompt = `Sen bağımsız ve adil bir jürisin. Aşağıdaki projeyi ve frealancer'ı değerlendireceksin. 
Proje Tanımı:
${params.projectDescription}

Freelancer Profili:
${params.freelancerProfile}

Freelancer Teklifi:
${params.proposalContent}

Lütfen bu eşleşmeyi değerlendir. Cevabını SADECE JSON formatında ver, ekstra metin ekleme.
JSON formatı şöyle olmalıdır:
{
  "score": (0 ile 100 arası bir sayı),
  "strengths": ["güçlü yön 1", "güçlü yön 2"],
  "weaknesses": ["zayıf yön 1", "zayıf yön 2"],
  "recommendation": "Genel değerlendirme ve tavsiyeniz (max 2 cümle)"
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanJson = text
      .replace(/^```json\n?/i, "")
      .replace(/^```\n?/i, "")
      .replace(/\n?```$/i, "")
      .trim();

    return JSON.parse(cleanJson) as JuryEvaluationResult;
  } catch (error: any) {
    console.error("AI Jury generation failed:", error);
    // Fallback in case of failure
    return {
      score: 50,
      strengths: ["Değerlendirme yapılamadı"],
      weaknesses: ["Değerlendirme yapılamadı"],
      recommendation: "API hatası nedeniyle jüri işlemi gerçekleştirilemedi."
    };
  }
}

export interface SeoMetaParams {
  content: string;
  focusKeyword?: string;
}

export interface SeoMetaResult {
  title: string;
  description: string;
  keywords: string[];
}

export async function generateSeoMeta(params: SeoMetaParams): Promise<SeoMetaResult> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

  const prompt = `Aşağıdaki içerik için SEO uyumlu Meta Title, Meta Description ve Tag/Keyword listesi oluştur.
İçerik:
${params.content.slice(0, 3000)} // Metin çok uzunsa kırp.

${params.focusKeyword ? `Odak Anahtar Kelime: ${params.focusKeyword}` : ""}

Cevabını SADECE JSON formatında ver, ekstra metin ekleme.
JSON formatı şöyle olmalıdır:
{
  "title": "SEO Başlığı (max 60 karakter)",
  "description": "SEO Açıklaması (max 160 karakter)",
  "keywords": ["kelime1", "kelime2", "kelime3"]
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanJson = text
      .replace(/^```json\n?/i, "")
      .replace(/^```\n?/i, "")
      .replace(/\n?```$/i, "")
      .trim();

    return JSON.parse(cleanJson) as SeoMetaResult;
  } catch (error: any) {
    console.error("SEO Meta generation failed:", error);
    return {
      title: "Otomatik SEO Başlığı",
      description: "İçerik için otomatik oluşturulan SEO meta açıklaması.",
      keywords: ["SEO", "İçerik"]
    };
  }
}
