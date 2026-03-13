"use server";

import { prisma } from "database";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";

const portfolioSchema = z.object({
  title: z.string().min(1, "Başlık zorunludur"),
  description: z.string().optional(),
  projectUrl: z.string().url("Geçerli bir URL giriniz").optional().or(z.literal("")),
  imageUrl: z.string().url("Geçerli bir görsel URL'si giriniz").optional().or(z.literal("")),
  date: z.string().optional(),
  category: z.enum(["VIDEO", "TASARIM", "YAZILIM", "DIGITAL_PAZARLAMA", "DIGER"]).default("DIGER"),
});

export type PortfolioItemData = z.infer<typeof portfolioSchema>;

export async function addPortfolioItem(data: PortfolioItemData) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Oturum açmanız gerekiyor");

    // Zod doğrulama
    const validatedData = portfolioSchema.parse(data);

    const freelancer = await prisma.freelancer.findFirst({
      where: { profile: { userId: session.user.id } },
    });

    if (!freelancer) throw new Error("Freelancer profili bulunamadı");

    await prisma.portfolioItem.create({
      data: {
        title: validatedData.title,
        description: validatedData.description || null,
        projectUrl: validatedData.projectUrl || null,
        imageUrl: validatedData.imageUrl || null,
        date: validatedData.date ? new Date(validatedData.date) : null,
        category: validatedData.category,
        freelancerId: freelancer.id,
      },
    });

    revalidatePath("/freelancer/portfolyo");
    return { success: true };
  } catch (error: any) {
    console.error("Portfolio ekleme hatası:", error);
    return { success: false, error: error.message || "Bir hata oluştu" };
  }
}

export async function deletePortfolioItem(itemId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Oturum açmanız gerekiyor");

    const freelancer = await prisma.freelancer.findFirst({
      where: { profile: { userId: session.user.id } },
    });

    if (!freelancer) throw new Error("Freelancer profili bulunamadı");

    const item = await prisma.portfolioItem.findFirst({
      where: { id: itemId, freelancerId: freelancer.id },
    });

    if (!item) throw new Error("Bu öğeyi silme yetkiniz yok veya öğe bulunamadı");

    await prisma.portfolioItem.delete({ where: { id: itemId } });

    revalidatePath("/freelancer/portfolyo");
    return { success: true };
  } catch (error: any) {
    console.error("Portfolio silme hatası:", error);
    return { success: false, error: error.message || "Bir hata oluştu" };
  }
}
