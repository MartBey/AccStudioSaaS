"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "database";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";

import { extractGeminiTokens, withCostTracking } from "./lib/with-cost-tracking";

// ── Types ──────────────────────────────────────────

export interface CreatePersonaInput {
  name: string;
  description?: string;
  toneOfVoice: string;
  targetAudience?: string;
  brandValues?: string;
  doList?: string;
  dontList?: string;
  exampleContent?: string;
  isDefault?: boolean;
}

export interface GenerateWithPersonaInput {
  personaId: string;
  prompt: string;
  contentType: "blog" | "social" | "email" | "ad" | "general";
}

export interface PersonaGenerationResult {
  content: string;
  personaName: string;
  modelUsed: string;
}

// ── CRUD Actions ───────────────────────────────────

export async function getPersonas() {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  if (!userId) return [];

  return prisma.brandPersona.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
  });
}

export async function getDefaultPersona() {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  if (!userId) return null;

  return prisma.brandPersona.findFirst({
    where: { userId, isDefault: true },
  });
}

export async function createPersona(input: CreatePersonaInput) {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  if (!userId) throw new Error("Unauthorized");

  // Eğer isDefault true ise, diğerlerini false yap
  if (input.isDefault) {
    await prisma.brandPersona.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  const persona = await prisma.brandPersona.create({
    data: {
      userId,
      name: input.name,
      description: input.description,
      toneOfVoice: input.toneOfVoice,
      targetAudience: input.targetAudience,
      brandValues: input.brandValues,
      doList: input.doList,
      dontList: input.dontList,
      exampleContent: input.exampleContent,
      isDefault: input.isDefault || false,
    },
  });

  revalidatePath("/marka/persona");
  return { success: true, persona };
}

export async function updatePersona(personaId: string, input: Partial<CreatePersonaInput>) {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  if (!userId) throw new Error("Unauthorized");

  if (input.isDefault) {
    await prisma.brandPersona.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  const persona = await prisma.brandPersona.update({
    where: { id: personaId },
    data: input,
  });

  revalidatePath("/marka/persona");
  return { success: true, persona };
}

export async function deletePersona(personaId: string) {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  if (!userId) throw new Error("Unauthorized");

  await prisma.brandPersona.delete({
    where: { id: personaId },
  });

  revalidatePath("/marka/persona");
  return { success: true };
}

// ── AI Generation with Persona ─────────────────────

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY ortam değişkeni tanımlı değil.");
  return new GoogleGenerativeAI(apiKey);
}

const MODEL_NAME = "gemini-2.0-flash";

export async function generateWithPersona(
  input: GenerateWithPersonaInput
): Promise<PersonaGenerationResult> {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  if (!userId) throw new Error("Unauthorized");

  const persona = await prisma.brandPersona.findUnique({
    where: { id: input.personaId },
  });

  if (!persona || persona.userId !== userId) {
    throw new Error("Persona bulunamadı.");
  }

  const typeLabels: Record<string, string> = {
    blog: "Blog Yazısı",
    social: "Sosyal Medya Gönderisi",
    email: "E-posta",
    ad: "Reklam Metni",
    general: "Genel İçerik",
  };

  const prompt = `Sen bir marka iletişim uzmanısın. Aşağıda tanımlanan marka persona'sına göre içerik üret.

## MARKA PERSONA: ${persona.name}
${persona.description ? `Açıklama: ${persona.description}` : ""}
Ses Tonu: ${persona.toneOfVoice}
${persona.targetAudience ? `Hedef Kitle: ${persona.targetAudience}` : ""}
${persona.brandValues ? `Marka Değerleri: ${persona.brandValues}` : ""}
${persona.doList ? `Yapılması Gerekenler:\n${persona.doList}` : ""}
${persona.dontList ? `Kaçınılması Gerekenler:\n${persona.dontList}` : ""}
${persona.exampleContent ? `Örnek İçerik Referansı:\n${persona.exampleContent}` : ""}

## İSTENEN İÇERİK
Tür: ${typeLabels[input.contentType] || "Genel İçerik"}
Konu/Talimat: ${input.prompt}

Yukarıdaki persona'ya tam uygun şekilde, HTML formatında içerik üret. Sadece body içeriği olsun.
Persona'nın ses tonuna, değerlerine ve kurallarına kesinlikle uy.`;

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
        action: "BRAND_PERSONA_GENERATION",
        metadata: {
          personaId: persona.id,
          personaName: persona.name,
          contentType: input.contentType,
        },
        fn: executeAICall,
        extractTokens: extractGeminiTokens,
      });
    } else {
      response = await executeAICall();
    }

    const text = response.text();
    const cleanHtml = text
      .replace(/^```html\n?/i, "")
      .replace(/^```\n?/i, "")
      .replace(/\n?```$/i, "")
      .trim();

    return {
      content: cleanHtml,
      personaName: persona.name,
      modelUsed: "Gemini 2.0 Flash",
    };
  } catch (error: any) {
    console.error("Brand Persona AI error:", error?.message || error);

    if (error?.message?.includes("GEMINI_API_KEY")) {
      return {
        content: `<div><h2>⚠️ Demo Modu</h2><p>GEMINI_API_KEY tanımlanmadığı için persona tabanlı içerik üretilemedi.</p><p><strong>Persona:</strong> ${persona.name}</p><p><strong>Konu:</strong> ${input.prompt}</p></div>`,
        personaName: persona.name,
        modelUsed: "Demo Modu",
      };
    }

    throw new Error(`Persona tabanlı içerik üretimi başarısız: ${error?.message || "Bilinmeyen hata"}`);
  }
}
