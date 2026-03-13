import React from "react";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "database";
import { BuilderClient } from "./BuilderClient";

export default async function BuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const resolvedParams = await params;
  const siteId = resolvedParams.id;

  // Ownership kontrolü ile site'i al
  const site = await prisma.site.findUnique({
    where: {
      id: siteId,
      userId: session.user.id,
    },
  });

  if (!site) {
    notFound();
  }

  const initialState = site.content ? JSON.stringify(site.content) : undefined;
  const initialTheme = site.themeConfig ? JSON.stringify(site.themeConfig) : undefined;

  return <BuilderClient siteId={siteId} initialState={initialState} initialTheme={initialTheme} />;
}
