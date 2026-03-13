"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

import { auth } from "@/auth";

import { extractGeminiTokens, withCostTracking } from "./lib/with-cost-tracking";

export interface JuriRequest {
  content: string;
  contentType: "blog" | "social" | "email" | "general";
  evaluationCriteria?: string;
}

export interface JuriScore {
  category: string;
  score: number; // 0-100
  feedback: string;
}

export interface JuriResponse {
  overallScore: number;
  verdict: string;
  scores: JuriScore[];
  improvements: string[];
  improvedVersion: string;
  modelUsed: string;
  evaluatedAt: Date;
}

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY ortam değişkeni tanımlı değil.");
  }
  return new GoogleGenerativeAI(apiKey);
}

export async function evaluateWithAIJuri(request: JuriRequest): Promise<JuriResponse> {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  const typeLabels: Record<string, string> = {
    blog: "Blog Yazısı",
    social: "Sosyal Medya Gönderisi",
    email: "Pazarlama E-postası",
    general: "Genel İçerik",
  };

  const prompt = `Sen profesyonel bir içerik jürisi ve editörsün. Aşağıdaki ${typeLabels[request.contentType] || "içeriği"} detaylı olarak değerlendir.

${request.evaluationCriteria ? `Değerlendirme odağı: ${request.evaluationCriteria}` : ""}

İÇERİK:
---
${request.content}
---

Aşağıdaki JSON formatında yanıt ver. Sadece JSON döndür, başka bir şey yazma:
{
  "overallScore": <0-100 arası genel puan>,
  "verdict": "<Tek cümlelik genel değerlendirme>",
  "scores": [
    {"category": "Dil ve Akıcılık", "score": <0-100>, "feedback": "<kısa açıklama>"},
    {"category": "SEO Uyumu", "score": <0-100>, "feedback": "<kısa açıklama>"},
    {"category": "Hedef Kitle Uyumu", "score": <0-100>, "feedback": "<kısa açıklama>"},
    {"category": "İkna Gücü ve CTA", "score": <0-100>, "feedback": "<kısa açıklama>"},
    {"category": "Özgünlük", "score": <0-100>, "feedback": "<kısa açıklama>"}
  ],
  "improvements": [
    "<iyileştirme önerisi 1>",
    "<iyileştirme önerisi 2>",
    "<iyileştirme önerisi 3>"
  ],
  "improvedVersion": "<İçeriğin iyileştirilmiş, optimize edilmiş versiyonu - HTML formatında>"
}`;

  const MODEL_NAME = "gemini-2.0-flash";

  const executeAICall = async () => {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    return result.response;
  };

  try {
    let response: any;

    // userId varsa cost tracking ile çalıştır, yoksa direkt çağır
    if (userId) {
      response = await withCostTracking({
        userId,
        model: MODEL_NAME,
        action: "AI_JURI",
        metadata: { contentType: request.contentType, contentLength: request.content.length },
        fn: executeAICall,
        extractTokens: extractGeminiTokens,
      });
    } else {
      response = await executeAICall();
    }

    const text = response.text();

    // JSON'u temizle ve parse et
    const cleanJson = text
      .replace(/^```json\n?/i, "")
      .replace(/^```\n?/i, "")
      .replace(/\n?```$/i, "")
      .trim();

    const parsed = JSON.parse(cleanJson);

    return {
      overallScore: parsed.overallScore,
      verdict: parsed.verdict,
      scores: parsed.scores,
      improvements: parsed.improvements,
      improvedVersion: parsed.improvedVersion,
      modelUsed: "Gemini 2.0 Flash",
      evaluatedAt: new Date(),
    };
  } catch (error: any) {
    console.error("AI Jüri evaluation error:", error?.message || error);

    // Fallback
    if (error?.message?.includes("API_KEY") || error?.message?.includes("GEMINI_API_KEY")) {
      return {
        overallScore: 0,
        verdict: "⚠️ GEMINI_API_KEY tanımlanmadığı için değerlendirme yapılamadı.",
        scores: [],
        improvements: [".env dosyasına GEMINI_API_KEY ekleyin."],
        improvedVersion: "",
        modelUsed: "Demo Modu",
        evaluatedAt: new Date(),
      };
    }

    throw new Error(`AI Jüri değerlendirmesi başarısız: ${error?.message || "Bilinmeyen hata"}`);
  }
}
