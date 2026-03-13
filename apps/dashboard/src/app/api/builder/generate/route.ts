import { NextResponse } from "next/server";
import { generateSiteFromPrompt } from "web-builder/src/services/ai-generator";
import { z } from "zod";

import { auth } from "@/auth";

// Zod validasyon semalari
const GenerateRequestSchema = z.object({
  prompt: z
    .string()
    .min(3, "Prompt en az 3 karakter olmali")
    .max(2000, "Prompt en fazla 2000 karakter olabilir"),
  brandPersona: z.string().max(5000).optional(),
});

// Basit in-memory rate limiter (production'da @upstash/ratelimit kullanilmali)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 10; // Dakikada max istek
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 dakika

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

export async function POST(req: Request) {
  try {
    // 1. Auth kontrolu
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to use this feature." },
        { status: 401 }
      );
    }

    // 2. Rate limiting
    if (!checkRateLimit(session.user.id)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment before trying again." },
        { status: 429 }
      );
    }

    // 3. Zod validasyonu
    const body = await req.json();
    const parsed = GenerateRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { prompt, brandPersona } = parsed.data;

    // 4. AI servisini cagir
    const siteStructure = await generateSiteFromPrompt({ prompt, brandPersona });

    return NextResponse.json({ success: true, site: siteStructure });
  } catch (error) {
    console.error("[Builder Generate API Error]", error);
    return NextResponse.json({ error: "Failed to generate site structure." }, { status: 500 });
  }
}
