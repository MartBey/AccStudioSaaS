"use server";

import { calculateCost } from "config";
import { CONTENT_AI_MODEL, generateContent } from "content-ai";
import { prisma } from "database";
import { ContentRequest, ContentResponse } from "types";

import { auth } from "@/auth";

/**
 * Dashboard-level wrapper for content generation.
 * Adds cost tracking around the content-ai module's generateContent function.
 */
export async function generateContentWithTracking(
  request: ContentRequest
): Promise<ContentResponse> {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  const start = Date.now();

  try {
    const result = await generateContent(request);
    const durationMs = Date.now() - start;

    // UsageLog kaydı oluştur (userId varsa)
    if (userId && result.tokens > 0) {
      const inputTokens = result.inputTokens || 0;
      const outputTokens = result.outputTokens || 0;
      const cost = calculateCost(CONTENT_AI_MODEL, inputTokens, outputTokens);

      try {
        await prisma.usageLog.create({
          data: {
            userId,
            model: CONTENT_AI_MODEL,
            action: "CONTENT_GENERATION",
            inputTokens,
            outputTokens,
            totalTokens: result.tokens,
            cost,
            durationMs,
            success: true,
            metadata: {
              contentType: request.type,
              promptLength: request.prompt.length,
              tone: request.tone,
            },
          },
        });
      } catch (logError) {
        console.error("UsageLog write failed:", logError);
      }
    }

    return result;
  } catch (error) {
    const durationMs = Date.now() - start;
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    // Hata durumunda da logla
    if (userId) {
      try {
        await prisma.usageLog.create({
          data: {
            userId,
            model: CONTENT_AI_MODEL,
            action: "CONTENT_GENERATION",
            inputTokens: 0,
            outputTokens: 0,
            totalTokens: 0,
            cost: 0,
            durationMs,
            success: false,
            errorMessage,
            metadata: {
              contentType: request.type,
              promptLength: request.prompt.length,
            },
          },
        });
      } catch (logError) {
        console.error("UsageLog write failed:", logError);
      }
    }

    throw error;
  }
}
