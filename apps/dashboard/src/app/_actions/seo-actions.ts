"use server";

import { auth } from "@/auth";
import { prisma } from "database";
import { analyzeWebsite } from "seo";
import { SeoRequest, SeoResponse } from "types";

export async function analyzeAndSaveWebsite(request: SeoRequest): Promise<SeoResponse> {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  try {
    const result = await analyzeWebsite(request);

    // Veritabanına kaydet (userId varsa)
    if (userId && !result.id.startsWith("fallback_")) {
      try {
        await prisma.seoAnalysis.create({
          data: {
            userId,
            url: result.url,
            keyword: result.keyword,
            performance: result.scores.performance,
            accessibility: result.scores.accessibility,
            bestPractices: result.scores.bestPractices,
            seo: result.scores.seo,
            issues: result.issues as any,
            wordCount: result.wordCount,
            loadTimeMs: result.loadTimeMs,
          },
        });
      } catch (dbError) {
        console.error("Failed to save SEO analysis:", dbError);
      }
    }

    return result;
  } catch (error) {
    console.error("SEO Analysis Action failed:", error);
    throw new Error("Analiz sırasında bir hata oluştu.");
  }
}

export async function getSeoHistory() {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  if (!userId) return [];

  try {
    return await prisma.seoAnalysis.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  } catch (error) {
    console.error("Failed to fetch SEO history:", error);
    return [];
  }
}
