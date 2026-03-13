"use server";

import { prisma } from "database";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";

export async function applyToJob(jobId: string, coverLetter: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Oturum bulunamadı. Lütfen giriş yapın.");
    }

    // Kullanıcının Freelancer profilini bul
    const userWithProfile = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: {
          include: {
            freelancer: true,
          },
        },
      },
    });

    const freelancerId = userWithProfile?.profile?.freelancer?.id;

    if (!freelancerId) {
      throw new Error("Yalnızca freelancer hesapları ilanlara başvurabilir.");
    }

    // Daha önce bu ilana başvurulmuş mu kontrol et
    const existingProposal = await prisma.proposal.findFirst({
      where: {
        jobListingId: jobId,
        freelancerId: freelancerId,
      },
    });

    if (existingProposal) {
      throw new Error("Bu ilana zaten başvuru yaptınız.");
    }

    // Başvuruyu (Proposal) oluştur
    await prisma.proposal.create({
      data: {
        jobListingId: jobId,
        freelancerId: freelancerId,
        coverLetter: coverLetter,
        amount: 0,
        status: "PENDING",
      },
    });

    // AuditLog kaydı at
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE_PROPOSAL",
        entityType: "JobListing",
        entityId: jobId,
        details: JSON.stringify({ message: "Freelancer ilana başvurdu" }),
      },
    });

    revalidatePath("/freelancer/ilanlar");
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("applyToJob_error:", error.message);
      throw new Error(error.message);
    }
    throw new Error("Başvuru sırasında bir hata oluştu");
  }
}
