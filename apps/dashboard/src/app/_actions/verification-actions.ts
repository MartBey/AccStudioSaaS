"use server";

import { prisma } from "database";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Doğrulama başvurusu oluştur
export async function submitVerification(data: {
  documentUrl: string;
  notes?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Oturum bulunamadı.");

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { profile: { include: { verification: true } } }
    });

    if (!user?.profile) throw new Error("Profil bulunamadı.");

    // Zaten başvuru varsa hata
    if (user.profile.verification) {
      throw new Error("Zaten bir doğrulama başvurunuz bulunuyor.");
    }

    await prisma.verification.create({
      data: {
        profileId: user.profile.id,
        documentUrl: data.documentUrl,
        notes: data.notes || null,
        status: "PENDING",
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "SUBMIT_VERIFICATION",
        entityType: "Verification",
        entityId: user.profile.id,
      }
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    console.error("submitVerification error:", error);
    if (error instanceof Error) return { error: error.message };
    return { error: "Doğrulama başvurusu oluşturulurken hata oluştu." };
  }
}

// Doğrulama durumunu getir
export async function getVerificationStatus() {
  try {
    const session = await auth();
    if (!session?.user?.id) return null;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { profile: { include: { verification: true } } }
    });

    if (!user?.profile?.verification) return null;

    const v = user.profile.verification;
    return {
      status: v.status,
      documentUrl: v.documentUrl,
      notes: v.notes,
      verifiedAt: v.verifiedAt?.toISOString() || null,
      createdAt: v.createdAt.toISOString(),
    };
  } catch {
    return null;
  }
}
