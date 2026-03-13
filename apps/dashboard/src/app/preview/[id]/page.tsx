import React from "react";
import { getSiteById } from "@/app/_actions/site-actions";
import { notFound } from "next/navigation";
import { PreviewClient } from "./PreviewClient";

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const siteId = resolvedParams.id;

  const site = await getSiteById(siteId);

  if (!site) {
    notFound();
  }

  const initialState = site.content ? JSON.stringify(site.content) : undefined;
  const initialTheme = site.themeConfig ? JSON.stringify(site.themeConfig) : undefined;

  return (
    <PreviewClient 
      initialState={initialState} 
      initialTheme={initialTheme} 
    />
  );
}
