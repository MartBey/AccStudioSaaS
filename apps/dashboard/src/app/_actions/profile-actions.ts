"use server";

import { prisma } from "database";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

// Profil bilgilerini güncelle
export async function updateProfile(data: {
  name?: string;
  bio?: string;
  location?: string;
  website?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Oturum bulunamadı.");

    // User adını güncelle
    if (data.name) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { name: data.name }
      });
    }

    // Profile bilgilerini güncelle
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { profile: true }
    });

    if (user?.profile) {
      await prisma.profile.update({
        where: { id: user.profile.id },
        data: {
          bio: data.bio ?? user.profile.bio,
          location: data.location ?? user.profile.location,
          website: data.website ?? user.profile.website,
        }
      });
    }

    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    console.error("updateProfile error:", error);
    if (error instanceof Error) return { error: error.message };
    return { error: "Profil güncellenirken hata oluştu." };
  }
}

// Şifre değiştir
export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Oturum bulunamadı.");

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user?.password) throw new Error("Bu hesap için şifre değiştirme desteklenmiyor.");

    // Mevcut şifre kontrolü
    const isValid = await bcrypt.compare(data.currentPassword, user.password);
    if (!isValid) throw new Error("Mevcut şifre yanlış.");

    // Yeni şifre hash
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword }
    });

    // AuditLog
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CHANGE_PASSWORD",
        entityType: "User",
        entityId: session.user.id,
      }
    });

    return { success: true };
  } catch (error: unknown) {
    console.error("changePassword error:", error);
    if (error instanceof Error) return { error: error.message };
    return { error: "Şifre değiştirilirken hata oluştu." };
  }
}
