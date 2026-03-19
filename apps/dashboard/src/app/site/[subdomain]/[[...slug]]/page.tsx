import { prisma } from "database";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import React from "react";

import { PreviewClient } from "../../../preview/[id]/PreviewClient";

export default async function SitePage({
  params,
}: {
  params: Promise<{ subdomain: string; slug?: string[] }>;
}) {
  const resolvedParams = await params;
  const identifier = resolvedParams.subdomain;
  const headersList = await headers();

  // Middleware'den gelen header'a güveniyoruz, ancak subdomain parametresini de kullanabiliriz
  let siteId = headersList.get("x-site-id");

  // Eğer header'da yoksa (direkt erişim denendiyse) parametreden bulmaya çalış
  if (!siteId) {
    // Önce subdomain olarak ara
    const siteBySubdomain = await prisma.site.findFirst({
      where: { domain: identifier },
      select: { id: true },
    });

    if (siteBySubdomain) {
      siteId = siteBySubdomain.id;
    } else {
      // Eğer subdomain değilse belki direkt ID'dir? (Custom domain'lerde ID geçebiliriz)
      siteId = identifier;
    }
  }

  if (!siteId) {
    notFound();
  }

  const site = await prisma.site.findUnique({
    where: { id: siteId },
  });

  if (!site) {
    notFound();
  }

  const initialState = site.content ? JSON.stringify(site.content) : undefined;
  const initialTheme = site.themeConfig ? JSON.stringify(site.themeConfig) : undefined;

  return <PreviewClient initialState={initialState} initialTheme={initialTheme} />;
}
