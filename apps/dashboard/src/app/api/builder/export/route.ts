import { NextResponse } from "next/server";
import { BuilderSiteSchema } from "web-builder/src/schema/builder-types";
import { exportSiteToHtml } from "web-builder/src/services/html-exporter";
import { z } from "zod";

import { auth } from "@/auth";

// Zod validasyon
const ExportRequestSchema = z.object({
  site: BuilderSiteSchema,
  title: z.string().max(200).optional(),
});

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

    // 2. Zod validasyonu
    const body = await req.json();
    const parsed = ExportRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { site, title } = parsed.data;

    // 3. HTML export servisi
    const html = exportSiteToHtml(site, {
      title: title || "AccStudio Site",
      includeFonts: true,
      responsive: true,
      includeReset: true,
    });

    // 4. HTML dosyasi olarak dondur
    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="${(title || "site").replace(/[^a-zA-Z0-9]/g, "_")}.html"`,
      },
    });
  } catch (error) {
    console.error("[Builder Export API Error]", error);
    return NextResponse.json({ error: "Failed to export site." }, { status: 500 });
  }
}
