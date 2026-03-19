"use server";

import { prisma } from "database";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";

// ── Types ──────────────────────────────────────────

export interface CreateSocialPostInput {
  content: string;
  platform: "INSTAGRAM" | "TWITTER" | "LINKEDIN" | "FACEBOOK" | "TIKTOK";
  scheduledFor?: Date;
  mediaUrls?: string[];
}

// ── Actions ────────────────────────────────────────

export async function getSocialPosts() {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  if (!userId) return [];

  return prisma.socialPost.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function getSocialPostsByStatus(status: string) {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  if (!userId) return [];

  return prisma.socialPost.findMany({
    where: { userId, status: status as any },
    orderBy: { scheduledFor: "asc" },
  });
}

export async function createSocialPost(input: CreateSocialPostInput) {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  if (!userId) throw new Error("Unauthorized");

  const status = input.scheduledFor && input.scheduledFor > new Date() ? "SCHEDULED" : "DRAFT";

  const post = await prisma.socialPost.create({
    data: {
      userId,
      content: input.content,
      platform: input.platform,
      status,
      scheduledFor: input.scheduledFor || null,
      mediaUrls: input.mediaUrls || [],
    },
  });

  revalidatePath("/marka/sosyal-medya");
  return { success: true, post };
}

export async function updateSocialPostStatus(postId: string, status: string) {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  if (!userId) throw new Error("Unauthorized");

  const existing = await prisma.socialPost.findUnique({
    where: { id: postId },
  });

  if (!existing || existing.userId !== userId) {
    throw new Error("Not found or unauthorized");
  }

  const updatedPost = await prisma.socialPost.update({
    where: { id: postId },
    data: {
      status: status as any,
      ...(status === "PUBLISHED" ? { publishedAt: new Date() } : {}),
    },
  });

  revalidatePath("/marka/sosyal-medya");
  return { success: true, post: updatedPost };
}

export async function deleteSocialPost(postId: string) {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  if (!userId) throw new Error("Unauthorized");

  await prisma.socialPost.delete({
    where: { id: postId },
  });

  revalidatePath("/marka/sosyal-medya");
  return { success: true };
}

export async function getSocialStats() {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  if (!userId) return null;

  const [total, scheduled, published, draft] = await Promise.all([
    prisma.socialPost.count({ where: { userId } }),
    prisma.socialPost.count({ where: { userId, status: "SCHEDULED" } }),
    prisma.socialPost.count({ where: { userId, status: "PUBLISHED" } }),
    prisma.socialPost.count({ where: { userId, status: "DRAFT" } }),
  ]);

  const byPlatform = await prisma.socialPost.groupBy({
    by: ["platform"],
    where: { userId },
    _count: { id: true },
  });

  return {
    total,
    scheduled,
    published,
    draft,
    byPlatform: byPlatform.map((p) => ({
      platform: p.platform,
      count: p._count.id,
    })),
  };
}
