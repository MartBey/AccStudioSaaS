import { ContentRequest, ContentResponse } from "types";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { calculateCost, AIModel, AI_PRICING } from "config";

// Gemini API istemcisi — env'den API key alır
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY ortam değişkeni tanımlı değil. .env dosyasına ekleyin.");
  }
  return new GoogleGenerativeAI(apiKey);
}

// İçerik türüne göre sistem prompt'u oluştur
function buildSystemPrompt(type: string, tone?: string): string {
  const toneMap: Record<string, string> = {
    professional: "profesyonel ve kurumsal",
    casual: "samimi ve sıcak",
    persuasive: "ikna edici ve aksiyona yönlendiren",
  };

  const toneDesc = toneMap[tone || "professional"] || "profesyonel";

  const typePrompts: Record<string, string> = {
    blog: `Sen deneyimli bir SEO uyumlu blog yazarısın. ${toneDesc} bir üslupla, HTML formatında blog yazısı oluştur.
Yazıda <h2> ve <h3> başlıkları, <p> paragrafları kullan. İçerik en az 3 bölüm olsun.
Anahtar kelimeleri doğal şekilde yerleştir.`,

    social: `Sen yaratıcı bir sosyal medya içerik uzmanısın. ${toneDesc} bir üslupla Instagram ve LinkedIn için gönderi oluştur.
Emoji kullan, dikkat çekici bir giriş yap, CTA (Call to Action) ekle. Hashtag öner.
Çıktı HTML formatında olmalı: <p> etiketleri kullan.`,

    email: `Sen profesyonel bir e-posta pazarlama uzmanısın. ${toneDesc} bir üslupla pazarlama e-postası yaz.
Konu satırı, selamlaşma, ana mesaj, CTA butonu metni ve kapanış içersin.
Çıktı HTML formatında olmalı.`,

    product: `Sen bir e-ticaret metin yazarı uzmanısın. ${toneDesc} bir üslupla, ürün özelliklerini vurgulayan etkileyici bir ürün açıklaması yaz.
Çıktı HTML formatında olmalı: <h3> ürün adı, <ul> teknik özellikler, <p> ise genel açıklama için kullanılmalı.`,

    ad: `Sen yüksek dönüşümlü reklam metinleri yazan bir metin yazarısın. ${toneDesc} bir üslupla, dikkat çekici, fayda odaklı ve güçlü bir CTA içeren reklam metni oluştur.
Çıktı HTML formatında olmalı.`,

    seo: `Sen bir SEO uzmanısın. Sağlanan içerik veya başlık için SEO uyumlu bir Meta Title (maks 60 karakter) ve Meta Description (maks 160 karakter) oluştur.
Çıktı HTML formatında olmalı: <p> etiketleri içinde 'Title: ...' ve 'Description: ...' şeklinde yaz.`,
  };

  return typePrompts[type] || typePrompts.blog;
}

export const CONTENT_AI_MODEL: AIModel = "gemini-2.0-flash";

export async function generateContent(request: ContentRequest): Promise<ContentResponse> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: CONTENT_AI_MODEL });

  const systemPrompt = buildSystemPrompt(request.type, request.tone);

  const prompt = `${systemPrompt}

Kullanıcının isteği: ${request.prompt}
${request.targetAudience ? `Hedef kitle: ${request.targetAudience}` : ""}

Lütfen HTML formatında içerik oluştur. Sadece body içeriği olsun, <html>, <head>, <body> etiketleri kullanma.
${request.language === "en" ? "Write in English." : "Türkçe yaz."}`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Markdown code block temizliği (Gemini bazen ```html ... ``` şeklinde döner)
    const cleanHtml = text
      .replace(/^```html\n?/i, "")
      .replace(/^```\n?/i, "")
      .replace(/\n?```$/i, "")
      .trim();

    // Token bilgileri — input/output ayrımı
    const usage = response.usageMetadata;
    const inputTokens = usage?.promptTokenCount || 0;
    const outputTokens = usage?.candidatesTokenCount || 0;
    const totalTokens = usage?.totalTokenCount || Math.ceil(cleanHtml.length / 4);
    const estimatedCostUsd = calculateCost(CONTENT_AI_MODEL, inputTokens, outputTokens);

    return {
      id: `gen_${Date.now().toString(36)}`,
      content: cleanHtml,
      tokens: totalTokens,
      inputTokens,
      outputTokens,
      estimatedCostUsd,
      type: request.type,
      createdAt: new Date(),
    };
  } catch (error: any) {
    console.error("Gemini API error:", error?.message || error);

    // API key yoksa veya hatalıysa fallback olarak mock veri dön
    if (error?.message?.includes("API_KEY") || error?.message?.includes("GEMINI_API_KEY")) {
      return generateFallbackContent(request);
    }

    throw new Error(`İçerik üretimi başarısız: ${error?.message || "Bilinmeyen hata"}`);
  }
}

// API key olmadığında veya hata durumunda fallback
function generateFallbackContent(request: ContentRequest): ContentResponse {
  const fallbackContent = `
    <div>
      <h2>⚠️ Demo Modu</h2>
      <p><strong>GEMINI_API_KEY</strong> tanımlanmadığı için demo içerik gösteriliyor.</p>
      <p>Gerçek AI içerik üretimi için <code>.env</code> dosyasına <code>GEMINI_API_KEY=your_key</code> ekleyin.</p>
      <hr/>
      <h3>İstek Detayları</h3>
      <p><strong>Konu:</strong> ${request.prompt}</p>
      <p><strong>Tür:</strong> ${request.type}</p>
      <p><strong>Ton:</strong> ${request.tone || "professional"}</p>
    </div>
  `;

  return {
    id: `demo_${Date.now().toString(36)}`,
    content: fallbackContent,
    tokens: 0,
    inputTokens: 0,
    outputTokens: 0,
    type: request.type,
    createdAt: new Date(),
  };
}
