"use server";

import { prisma } from "database";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Freelancer bir ilana başvuru yapar
export async function createProposal(data: {
  jobListingId: string;
  coverLetter: string;
  amount: number;
  deliveryTime?: number;
  sampleUrl?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Oturum bulunamadı.");

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { profile: { include: { freelancer: true } } }
    });

    const freelancerId = user?.profile?.freelancer?.id;
    if (!freelancerId) throw new Error("Yalnızca freelancer hesapları başvuru yapabilir.");

    // Daha önce başvuru yapılmış mı?
    const existing = await prisma.proposal.findFirst({
      where: { jobListingId: data.jobListingId, freelancerId }
    });
    if (existing) throw new Error("Bu ilana zaten başvuru yaptınız.");

    await prisma.proposal.create({
      data: {
        jobListingId: data.jobListingId,
        freelancerId,
        coverLetter: data.coverLetter,
        amount: data.amount,
        deliveryTime: data.deliveryTime || null,
        sampleUrl: data.sampleUrl || null,
        status: "PENDING",
      }
    });

    // AuditLog
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE_PROPOSAL",
        entityType: "Proposal",
        entityId: data.jobListingId,
        details: JSON.stringify({ amount: data.amount })
      }
    });

    revalidatePath(`/freelancer/ilanlar/${data.jobListingId}`);
    revalidatePath("/freelancer/ilanlar");
    return { success: true };
  } catch (error: unknown) {
    console.error("createProposal error:", error);
    if (error instanceof Error) return { error: error.message };
    return { error: "Başvuru oluşturulurken hata oluştu." };
  }
}

// Marka bir teklifi kabul eder
export async function acceptProposal(proposalId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Oturum bulunamadı.");

    const proposal = await prisma.proposal.update({
      where: { id: proposalId },
      data: { status: "ACCEPTED" },
      include: { jobListing: { select: { projectId: true } } }
    });

    // İlanın Task olarak freelancer'a ata + JobListing'i kapat
    if (proposal.jobListing?.projectId) {
      await prisma.task.create({
        data: {
          projectId: proposal.jobListing.projectId,
          freelancerId: proposal.freelancerId,
          title: `Kabul edilen teklif #${proposalId.slice(0, 8)}`,
          status: "TODO",
        }
      });

      // JobListing'i kapat
      await prisma.jobListing.update({
        where: { id: proposal.jobListingId },
        data: { status: "CLOSED" }
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "ACCEPT_PROPOSAL",
        entityType: "Proposal",
        entityId: proposalId,
      }
    });

    revalidatePath("/marka/projeler");
    return { success: true };
  } catch (error: unknown) {
    console.error("acceptProposal error:", error);
    if (error instanceof Error) return { error: error.message };
    return { error: "Teklif kabul edilirken hata oluştu." };
  }
}

// Marka bir teklifi reddeder
export async function rejectProposal(proposalId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Oturum bulunamadı.");

    await prisma.proposal.update({
      where: { id: proposalId },
      data: { status: "REJECTED" },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "REJECT_PROPOSAL",
        entityType: "Proposal",
        entityId: proposalId,
      }
    });

    revalidatePath("/marka/projeler");
    return { success: true };
  } catch (error: unknown) {
    console.error("rejectProposal error:", error);
    if (error instanceof Error) return { error: error.message };
    return { error: "Teklif reddedilirken hata oluştu." };
  }
}
