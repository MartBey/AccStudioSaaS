import React from "react";
import { BuilderClient } from "./BuilderClient";
import { getSite } from "./actions";

export default async function BuilderPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const siteId = resolvedParams.id;

  const site = await getSite(siteId);
  const initialState = site?.content ? JSON.stringify(site.content) : undefined;
  const initialTheme = site?.themeConfig ? JSON.stringify(site.themeConfig) : undefined;

  return <BuilderClient siteId={siteId} initialState={initialState} initialTheme={initialTheme} />;
}
