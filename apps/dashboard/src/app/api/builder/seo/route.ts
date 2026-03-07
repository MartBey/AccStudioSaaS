import { NextResponse } from "next/server";
import { analyzeSiteSeo } from "web-builder/src/services/seo-analyzer";

export async function POST(req: Request) {
  try {
    const { siteJson } = await req.json();

    if (!siteJson) {
      return NextResponse.json({ error: "Site JSON data is required" }, { status: 400 });
    }

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
