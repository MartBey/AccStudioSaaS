"use server";

import { ContentRequest, ContentResponse } from "types";
import { generateContent } from "./services/generate";

export async function generateContentAction(request: ContentRequest): Promise<ContentResponse> {
  // Here we would typically validate the session/role and apply rate-limits

  try {
    const result = await generateContent(request);
    return result;
  } catch (error) {
    console.error("Content AI generation failed:", error);
    throw new Error("Failed to generate content.");
  }
}
