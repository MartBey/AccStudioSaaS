import { prisma } from "database";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import React from "react";

import { auth } from "@/auth";

import { BuilderClient } from "./BuilderClient";

export default async function BuilderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
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
