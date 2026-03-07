// ==========================================
// AI Model Pricing Configuration (USD)
// ==========================================

export const AI_PRICING = {
  "gemini-2.0-flash": {
    inputPerMillion: 0.10,
    outputPerMillion: 0.40,
  },
  "gemini-1.5-pro": {
    inputPerMillion: 1.25,
    outputPerMillion: 5.00,
  },
  "gemini-1.5-flash": {
    inputPerMillion: 0.075,
    outputPerMillion: 0.30,
  },
} as const;

export type AIModel = keyof typeof AI_PRICING;

/**
 * Merkezi maliyet hesaplama. Tüm AI çağrılarında kullanılır.
 * Input ve output token fiyatları farklı olduğu için ayrı hesaplanır.
 */
export function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const price = AI_PRICING[model as AIModel];
  if (!price) return 0;
  return (
    (inputTokens / 1_000_000) * price.inputPerMillion +
    (outputTokens / 1_000_000) * price.outputPerMillion
  );
}
