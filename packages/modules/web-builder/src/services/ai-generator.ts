import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { BuilderSiteSchema, BuilderSite } from "../schema/builder-types";

export interface GenerateSiteRequest {
  prompt: string;
  brandPersona?: string; // Phase 2: AI Content Agent entegrasyonu için
}

export async function generateSiteFromPrompt({
  prompt,
  brandPersona,
}: GenerateSiteRequest): Promise<BuilderSite> {
  // Sistem talimatları (Gelişmiş Aşama 3)
  let systemPrompt = `Sen profesyonel bir web tasarımcısısın ve AccStudio Web Builder için sayfalar inşa ediyorsun. 
Kullanıcının isteğine uygun modern, kullanıcı dostu bir web sitesinin yapısal şemasını (JSON) oluşturacaksın.
Aşağıdaki BlockType bileşen havuzunu kullanarak yukarıdan aşağıya mantıklı bir landing page dizilimi yarat:

[Mevcut BlockType Havuzu]:
- "Hero": Sayfanın dikkat çekici giriş bölümü (Başlık, alt başlık, CTA butonu).
- "Features": Ürün/Hizmet özelliklerini grid yapısında listelemek için.
- "Pricing": Fiyatlandırma planlarını göstermek için.
- "Testimonial": Müşteri yorumlarını göstermek için.
- "Contact": İletişim formu ve bilgileri için.
- "VideoReview": UGC/Kullanıcı tanıtım videolarını eklemek için.
- "Text", "Image", "Button": İnce ayar yapı taşları.
- "Container": Özel kutular ve boşluklu yapı elemanları.
- "Footer": Sitenin alt kısım bilgisi.

Kurallar:
1. Her section tasarımı geniş, ferah ve modern olmalı.
2. Renk kodları HEX formatında ve aralıklar Tailwind standartlarında olmalı.
3. Çıktı kesinlikle Zod şemasına (%100) uymalıdır.`;

  if (brandPersona) {
    systemPrompt += `\n\nMARKA TİPİ VE SES TONU KURALLARI (Brand Persona):\n${brandPersona}\nLütfen üreteceğin metinlerde ve seçeceğin renk tonlarında bu marka kurallarına sıkı sıkıya bağlı kal.`;
  }

  try {
    const { object } = await generateObject({
      model: google("gemini-1.5-pro"),
      system: systemPrompt,
      prompt: prompt,
      schema: BuilderSiteSchema,
    });

    return object;
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to generate site structure from prompt.");
  }
}
