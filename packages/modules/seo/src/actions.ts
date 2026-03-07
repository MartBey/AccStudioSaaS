"use server";

import { SeoRequest, SeoResponse } from "types";
import { analyzeWebsite } from "./services/analyze";

export async function analyzeWebsiteAction(request: SeoRequest): Promise<SeoResponse> {
  // Role checks, rate limiting, and plan validation would go here
  
  try {
    const result = await analyzeWebsite(request);
    return result;
  } catch (error) {
    console.error("SEO Module Analysis failed:", error);
    throw new Error("Failed to analyze website.");
  }
}
