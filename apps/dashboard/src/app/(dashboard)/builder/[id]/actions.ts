"use server";

import { prisma } from "database";
import { revalidatePath } from "next/cache";

export async function saveSite(siteId: string, contentJson: string, themeConfigJson?: string) {
  try {
    // For demo/prototype purposes, we might not have a real User ID context unless we use NextAuth session.
    // In a real app we would get the session user ID and ensure they own the site or just update it if we assume it exists.
    // Since this is the builder, we assume the site is created somewhere else initially, and we just update its content.
    // Wait, since we are directly opening /builder/123, let's upsert to make testing easy.

    // Hardcoding a dummy user ID or skipping User relation for the 'upsert' might fail if user doesn't exist.
    // Let's just try to update. If it doesn't exist, we will create a dummy user first, or just create it.
    // Actually, Prisma requires `userId`. We will use a fallback or expect the site to be created properly in a real flow.

    // For now, let's just do an update, and catch error.
    await prisma.site.update({
      where: { id: siteId },
      data: {
        content: JSON.parse(contentJson),
        ...(themeConfigJson ? { themeConfig: JSON.parse(themeConfigJson) } : {}),
      },
    });

    revalidatePath(`/builder/${siteId}`);
    return { success: true };
  } catch (error) {
    console.error("[saveSite error]", error);
    // Fallback: If site doesn't exist, we try to create a dummy site (for easy local testing).
    try {
      const dummyUser = await prisma.user.findFirst();
      if (dummyUser) {
        await prisma.site.create({
          data: {
            id: siteId,
            name: "My Awesome Site",
            userId: dummyUser.id,
            content: JSON.parse(contentJson),
            ...(themeConfigJson ? { themeConfig: JSON.parse(themeConfigJson) } : {}),
          },
        });
        revalidatePath(`/builder/${siteId}`);
        return { success: true };
      }
    } catch (e) {
      return { success: false, error: "Failed to save or create site." };
    }
    return { success: false, error: "Failed to save site." };
  }
}

export async function getSite(siteId: string) {
  try {
    const site = await prisma.site.findUnique({
      where: { id: siteId },
    });
    return site;
  } catch (error) {
    console.error("[getSite error]", error);
    return null;
  }
}
