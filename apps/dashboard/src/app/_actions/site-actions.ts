"use server";

import { auth } from "@/auth";
import { prisma } from "database";
import { revalidatePath } from "next/cache";
import { Site } from "types";

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

export async function getSiteById(
  siteId: string,
  requireOwnership = false
): Promise<Site | null> {
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

export async function saveSiteContent(siteId: string, contentJson: string, themeConfigJson?: string) {
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
