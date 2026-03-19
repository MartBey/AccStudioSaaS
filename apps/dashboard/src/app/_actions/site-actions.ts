"use server";

import { prisma } from "database";
import { revalidatePath } from "next/cache";
import { Site } from "types";

import { auth } from "@/auth";

export async function getUserSites(): Promise<Site[]> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return [];

  const sites = await prisma.site.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  return sites as Site[];
}

export async function createSite(name: string): Promise<Site | null> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("Unauthorized");

  const site = await prisma.site.create({
    data: {
      name,
      userId,
      content: {}, // Default empty content
      themeConfig: {
        primary: "#0f172a",
        font: "Inter",
      },
    },
  });

  revalidatePath("/marka/siteler");
  return site as Site;
}

export async function getSiteById(siteId: string, requireOwnership = false): Promise<Site | null> {
  const session = await auth();
  const userId = session?.user?.id;

  if (requireOwnership && !userId) {
    return null;
  }

  const site =
    requireOwnership && userId
      ? await prisma.site.findUnique({
          where: {
            id: siteId,
            userId,
          },
        })
      : await prisma.site.findUnique({
          where: { id: siteId },
        });

  return site as Site | null;
}

export async function saveSiteContent(
  siteId: string,
  contentJson: string,
  themeConfigJson?: string
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("Unauthorized");

  // Verify ownership
  const existing = await prisma.site.findUnique({
    where: { id: siteId, userId },
  });

  if (!existing) throw new Error("Not Found or Unauthorized");

  await prisma.site.update({
    where: { id: siteId },
    data: {
      content: JSON.parse(contentJson),
      ...(themeConfigJson ? { themeConfig: JSON.parse(themeConfigJson) } : {}),
    },
  });

  revalidatePath(`/builder/${siteId}`);
  revalidatePath("/marka/siteler");
  return { success: true };
}

export async function deleteSite(siteId: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("Unauthorized");

  await prisma.site.delete({
    where: { id: siteId, userId },
  });

  revalidatePath("/marka/siteler");
  return { success: true };
}

/**
 * Site'yi yayınla: HTML oluştur, DB'ye kaydet, URL döndür.
 */
export async function publishSite(siteId: string, subdomain?: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Unauthorized");

  const site = await prisma.site.findUnique({
    where: { id: siteId, userId },
  });

  if (!site) throw new Error("Site not found");

  // Import html exporter
  const { exportSiteToHtml } = await import("web-builder");

  const siteContent = site.content as any;
  if (!siteContent || !siteContent.nodes || siteContent.nodes.length === 0) {
    return { success: false, error: "Site içeriği boş. Lütfen önce içerik ekleyin." };
  }

  const html = exportSiteToHtml(siteContent, {
    title: site.name,
    includeFonts: true,
    responsive: true,
    includeReset: true,
  });

  const finalSubdomain = subdomain || site.subdomain || siteId.slice(0, 12);
  const publishedUrl = `https://${finalSubdomain}.accstudio.site`;

  await prisma.site.update({
    where: { id: siteId },
    data: {
      publishedHtml: html,
      publishedUrl,
      publishedAt: new Date(),
      subdomain: finalSubdomain,
    },
  });

  revalidatePath(`/builder/${siteId}`);
  revalidatePath("/marka/siteler");

  return {
    success: true,
    url: publishedUrl,
    publishedAt: new Date(),
  };
}

/**
 * Site preview: HTML string'ini döndür, DB'ye kaydetme.
 */
export async function previewSite(siteId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Unauthorized");

  const site = await prisma.site.findUnique({
    where: { id: siteId, userId },
  });

  if (!site) throw new Error("Site not found");

  const { exportSiteToHtml } = await import("web-builder");

  const siteContent = site.content as any;
  if (!siteContent || !siteContent.nodes || siteContent.nodes.length === 0) {
    return { success: false, html: "", error: "Site içeriği boş." };
  }

  const html = exportSiteToHtml(siteContent, {
    title: `${site.name} — Preview`,
    includeFonts: true,
    responsive: true,
    includeReset: true,
  });

  return { success: true, html };
}

/**
 * Yayındaki site'nin statik HTML'ini döndür (public erişim).
 */
export async function getPublishedSiteHtml(subdomain: string) {
  const site = await prisma.site.findFirst({
    where: { subdomain },
    select: { publishedHtml: true, name: true, publishedAt: true },
  });

  if (!site || !site.publishedHtml) return null;

  return {
    html: site.publishedHtml,
    name: site.name,
    publishedAt: site.publishedAt,
  };
}

