"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

import { auth } from "@/auth";

import { extractGeminiTokens, withCostTracking } from "./lib/with-cost-tracking";

export interface JobDescriptionRequest {
  projectName: string;
  industry: string;
  skills: string[];
  budget?: string;
  duration?: string;
  additionalNotes?: string;
}

export interface JobDescriptionResponse {
  title: string;
  description: string;
  requirements: string[];
  niceToHave: string[];
  estimatedBudget: string;
  estimatedDuration: string;
  suggestedSkillTags: string[];
}

export interface FreelancerMatchRequest {
  projectDescription: string;
  requiredSkills: string[];
  budget?: string;
  availableFreelancers: {
    id: string;
    name: string;
    skills: string[];
    rating: number;
    hourlyRate: number;
    completedProjects: number;
    bio?: string;
  }[];
}

export interface FreelancerMatchResult {
  freelancerId: string;
  freelancerName: string;
  matchScore: number; // 0-100
  reasoning: string;
  strengths: string[];
  concerns: string[];
}

export interface FreelancerMatchResponse {
  matches: FreelancerMatchResult[];
  summary: string;
}

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY ortam değişkeni tanımlı değil.");
  }
  return new GoogleGenerativeAI(apiKey);
}

const MODEL_NAME = "gemini-2.0-flash";

// ─── AI İş Tanımı Oluşturma ─────────────────────────────

export async function generateJobDescription(
  request: JobDescriptionRequest
): Promise<JobDescriptionResponse> {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  const prompt = `Sen deneyimli bir İK ve Proje Yöneticisisin. Aşağıdaki bilgilere göre detaylı bir iş ilanı oluştur.

Proje Adı: ${request.projectName}
Sektör: ${request.industry}
İstenen Yetenekler: ${request.skills.join(", ")}
${request.budget ? `Bütçe: ${request.budget}` : ""}
${request.duration ? `Süre: ${request.duration}` : ""}
${request.additionalNotes ? `Ek Notlar: ${request.additionalNotes}` : ""}

Aşağıdaki JSON formatında yanıt ver. Sadece JSON döndür:
{
  "title": "<Dikkat çekici iş ilanı başlığı>",
  "description": "<En az 3 paragraf detaylı açıklama. HTML formatında <p> etiketleri ile>",
  "requirements": ["<zorunlu beceri 1>", "<zorunlu beceri 2>", ...],
  "niceToHave": ["<tercih edilen beceri 1>", "<tercih edilen beceri 2>", ...],
  "estimatedBudget": "<tahmini bütçe aralığı TL olarak>",
  "estimatedDuration": "<tahmini süre>",
  "suggestedSkillTags": ["<tag1>", "<tag2>", ...]
}`;

  const executeAICall = async () => {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    return result.response;
  };

  try {
    let response: any;

    if (userId) {
      response = await withCostTracking({
        userId,
        model: MODEL_NAME,
        action: "JOB_DESCRIPTION",
        metadata: { projectName: request.projectName, industry: request.industry },
        fn: executeAICall,
        extractTokens: extractGeminiTokens,
      });
    } else {
      response = await executeAICall();
    }

    const text = response.text();
    const cleanJson = text
      .replace(/^```json\n?/i, "")
      .replace(/^```\n?/i, "")
      .replace(/\n?```$/i, "")
      .trim();

    return JSON.parse(cleanJson);
  } catch (error: unknown) {
    console.error("AI Job Description error:", error);

    if (error instanceof Error && error.message.includes("GEMINI_API_KEY")) {
      return {
        title: `${request.projectName} — ${request.industry} Projesi`,
        description: "<p>⚠️ GEMINI_API_KEY tanımlanmadığı için demo iş tanımı gösteriliyor.</p>",
        requirements: request.skills,
        niceToHave: ["Portföy", "Referans"],
        estimatedBudget: request.budget || "Belirtilmedi",
        estimatedDuration: request.duration || "Belirtilmedi",
        suggestedSkillTags: request.skills,
      };
    }

    throw new Error("İş tanımı oluşturulamadı.");
  }
}

// ─── AI Freelancer Eşleştirme ────────────────────────────

export async function matchFreelancers(
  request: FreelancerMatchRequest
): Promise<FreelancerMatchResponse> {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  const freelancerList = request.availableFreelancers
    .map(
      (f) =>
        `ID: ${f.id}, İsim: ${f.name}, Beceriler: ${f.skills.join(", ")}, Puan: ${f.rating}/5, Saatlik Ücret: ${f.hourlyRate}₺, Tamamlanan Proje: ${f.completedProjects}${f.bio ? `, Bio: ${f.bio}` : ""}`
    )
    .join("\n");

  const prompt = `Sen profesyonel bir freelancer eşleştirme uzmanısın. Verilen proje ihtiyaçlarına göre en uygun freelancer'ları sırala ve değerlendir.

PROJE:
${request.projectDescription}

İSTENEN BECERİLER: ${request.requiredSkills.join(", ")}
${request.budget ? `BÜTÇE: ${request.budget}` : ""}

MEVCUT FREELANCERLAR:
${freelancerList}

Her freelancer'ı 0-100 arasında eşleşme puanıyla değerlendir. Aşağıdaki JSON formatında yanıt ver. Sadece JSON döndür:
{
  "matches": [
    {
      "freelancerId": "<id>",
      "freelancerName": "<isim>",
      "matchScore": <0-100>,
      "reasoning": "<neden bu puan verildi, kısa açıklama>",
      "strengths": ["<güçlü yön 1>", "<güçlü yön 2>"],
      "concerns": ["<risk/endişe 1>"]
    }
  ],
  "summary": "<genel değerlendirme özeti>"
}

En yüksek puanlıdan düşüğe doğru sırala. Tüm freelancer'ları değerlendir.`;

  const executeAICall = async () => {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    return result.response;
  };

  try {
    let response: any;

    if (userId) {
      response = await withCostTracking({
        userId,
        model: MODEL_NAME,
        action: "FREELANCER_MATCH",
        metadata: { freelancerCount: request.availableFreelancers.length },
        fn: executeAICall,
        extractTokens: extractGeminiTokens,
      });
    } else {
      response = await executeAICall();
    }

    const text = response.text();
    const cleanJson = text
      .replace(/^```json\n?/i, "")
      .replace(/^```\n?/i, "")
      .replace(/\n?```$/i, "")
      .trim();

    return JSON.parse(cleanJson);
  } catch (error: unknown) {
    console.error("AI Freelancer Match error:", error);

    if (error instanceof Error && error.message.includes("GEMINI_API_KEY")) {
      return {
        matches: request.availableFreelancers.map((f) => ({
          freelancerId: f.id,
          freelancerName: f.name,
          matchScore: 0,
          reasoning: "GEMINI_API_KEY tanımlı değil — demo modu.",
          strengths: f.skills.slice(0, 2),
          concerns: ["API key ekleyin"],
        })),
        summary: "⚠️ GEMINI_API_KEY olmadan eşleştirme yapılamadı.",
      };
    }

    throw new Error("Freelancer eşleştirmesi yapılamadı.");
  }
}
