import { NextResponse } from "next/server";
import { generateSiteFromPrompt } from "web-builder/src/services/ai-generator";

export async function POST(req: Request) {
  try {
    const { prompt, brandPersona } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Call the AI Service
    const siteStructure = await generateSiteFromPrompt({ prompt, brandPersona });

    return NextResponse.json({ success: true, site: siteStructure });
  } catch (error) {
    console.error("[Builder Generate API Error]", error);
    return NextResponse.json(
      { error: "Failed to generate site structure." },
      { status: 500 }
    );
  }
}
