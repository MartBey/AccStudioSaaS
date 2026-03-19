/* eslint-disable simple-import-sort/imports */
import { NextResponse } from "next/server";
import { prisma } from "database";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const hostname = searchParams.get("hostname");

  if (!hostname) {
    return NextResponse.json({ error: "hostname required" }, { status: 400 });
  }

  try {
    // 1. Subdomain kontrolü (production)
    if (process.env.NODE_ENV === "production" && hostname.endsWith(".accstudio.co")) {
      const subdomain = hostname.split(".accstudio.co")[0];
      if (subdomain && !subdomain.includes(".")) {
        // admin veya accounts değilse
        // Şemada 'subdomain' alanı yoksa 'domain' alanı üzerinden bakıyoruz
        const site = await prisma.site.findFirst({
          where: {
            OR: [{ domain: subdomain }, { domain: hostname }],
          },
          select: { id: true, domain: true },
        });
        if (site) {
          return NextResponse.json({ siteId: site.id, subdomain: site.domain });
        }
      }
    }

    // 2. Subdomain kontrolü (development)
    if (
      process.env.NODE_ENV === "development" ||
      hostname.includes("localhost") ||
      hostname.includes(".local")
    ) {
      if (hostname.endsWith(".accstudio.local")) {
        const subdomain = hostname.split(".accstudio.local")[0];
        if (subdomain && !subdomain.includes(".")) {
          const site = await prisma.site.findFirst({
            where: {
              OR: [{ domain: subdomain }, { domain: hostname }],
            },
            select: { id: true, domain: true },
          });
          if (site) {
            return NextResponse.json({ siteId: site.id, subdomain: site.domain });
          }
        }
      }
    }

    // 3. Custom domain kontrolü
    const site = await prisma.site.findFirst({
      where: { domain: hostname },
      select: { id: true, domain: true },
    });

    if (site) {
      return NextResponse.json({ siteId: site.id, subdomain: site.domain });
    }

    // Bulunamadı
    return NextResponse.json(null, { status: 404 });
  } catch (error) {
    console.error("Site by domain error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
