import { prisma } from "database";
import { notFound } from "next/navigation";
import React from "react";

import { auth } from "@/auth";

import { PreviewClient } from "./PreviewClient";

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const siteId = resolvedParams.id;

  const session = await auth();

  // Eğer kullanıcı giriş yapmışsa ownership kontrolü yap
  // Public preview için site'da bir `isPublic` flag'i eklenebilir
  const site = session?.user?.id
    ? await prisma.site.findUnique({
        where: {
          id: siteId,
          userId: session.user.id,
        },
      })
    : await prisma.site.findUnique({
        where: { id: siteId },
      });

  if (!site) {
    notFound();
  }

  const initialState = site.content ? JSON.stringify(site.content) : undefined;
  const initialTheme = site.themeConfig ? JSON.stringify(site.themeConfig) : undefined;

  return <PreviewClient initialState={initialState} initialTheme={initialTheme} />;
}
