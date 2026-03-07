import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { analyzeSiteSeo } from "web-builder/src/services/seo-analyzer";

// Zod validasyon
const SeoRequestSchema = z.object({
  siteJson: z.string().min(2, "Site JSON verisi gerekli").max(500000, "Site JSON verisi cok buyuk"),
});

// Basit in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5; // Dakikada max istek (SEO analiz daha yoğun bir işlem)
const RATE_LIMIT_WINDOW = 60 * 1000;

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
    const parsed = SeoRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { siteJson } = parsed.data;

    // 4. SEO analiz servisini cagir
    const analysis = await analyzeSiteSeo({ siteJson });

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error("[Builder SEO API Error]", error);
    return NextResponse.json(
      { error: "Failed to analyze SEO." },
      { status: 500 }
    );
  }
}
