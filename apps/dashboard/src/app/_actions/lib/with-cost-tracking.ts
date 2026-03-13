// ── Lib Wrapper ────────────────────────────────────────────

import { calculateCost } from "config";
import { prisma } from "database";

// ── Types ──────────────────────────────────────────────────

type TokenInfo = {
  input: number;
  output: number;
  total: number;
};

type AICallOptions<T> = {
  userId: string;
  model: string;
  action: string;
  metadata?: Record<string, any>;
  fn: () => Promise<T>;
  extractTokens: (result: T) => TokenInfo;
};

// ── withCostTracking ───────────────────────────────────────

/**
 * Her AI çağrısını saran wrapper fonksiyon.
 * - Token bilgisini extractTokens callback'i ile çıkarır
 * - Maliyeti merkezi calculateCost ile hesaplar
 * - UsageLog kaydı oluşturur (başarılı ve başarısız çağrılar dahil)
 */
export async function withCostTracking<T>({
  userId,
  model,
  action,
  metadata,
  fn,
  extractTokens,
}: AICallOptions<T>): Promise<T> {
  const start = Date.now();

  try {
    const result = await fn();
    const durationMs = Date.now() - start;
    const tokens = extractTokens(result);
    const cost = calculateCost(model, tokens.input, tokens.output);

    // Başarılı çağrıyı logla
    await prisma.usageLog.create({
      data: {
        userId,
        model,
        action,
        inputTokens: tokens.input,
        outputTokens: tokens.output,
        totalTokens: tokens.total,
        cost,
        durationMs,
        success: true,
        metadata: metadata ? (metadata as any) : undefined,
      },
    });

    return result;
  } catch (error) {
    const durationMs = Date.now() - start;
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    // Başarısız çağrıyı da logla (maliyet 0)
    try {
      await prisma.usageLog.create({
        data: {
          userId,
          model,
          action,
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
          cost: 0,
          durationMs,
          success: false,
          errorMessage,
          metadata: metadata ? (metadata as any) : undefined,
        },
      });
    } catch (logError) {
      // Loglama hatası AI çağrısını engellememelidir
      console.error("UsageLog write failed:", logError);
    }

    throw error;
  }
}

// ── Gemini Token Extractor ─────────────────────────────────

/**
 * Gemini API response'undan token bilgisini çıkarır.
 * Tüm Gemini çağrılarında tekrar kullanılır.
 */
export function extractGeminiTokens(response: any): TokenInfo {
  const usage = response?.usageMetadata;
  return {
    input: usage?.promptTokenCount || 0,
    output: usage?.candidatesTokenCount || 0,
    total: usage?.totalTokenCount || 0,
  };
}
