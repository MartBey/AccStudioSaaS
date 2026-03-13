import React from "react";

import { getSiteById } from "@/app/_actions/site-actions";
import { BuilderClient } from "./BuilderClient";

export default async function BuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const siteId = resolvedParams.id;

  const site = await getSiteById(siteId);
  const initialState = site?.content ? JSON.stringify(site.content) : undefined;
  const initialTheme = site?.themeConfig ? JSON.stringify(site.themeConfig) : undefined;

  return <BuilderClient siteId={siteId} initialState={initialState} initialTheme={initialTheme} />;
}
