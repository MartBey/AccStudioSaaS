"use server";

import { prisma } from "database";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";

// Marka: Proje bazlı ödemeler listesi
export async function getPaymentsForBrand() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const payments = await prisma.payment.findMany({
    where: { payerId: session.user.id },
    include: {
      project: { select: { name: true } },
      payee: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return payments.map((p) => ({
    id: p.id,
    projectName: p.project?.name || "Bilinmiyor",
    freelancerName: p.payee?.name || "Freelancer",
    amount: p.amount,
    currency: p.currency,
    status: p.status,
    description: p.description,
    paidAt: p.paidAt?.toISOString() || null,
    createdAt: p.createdAt.toISOString(),
  }));
}

// Freelancer: Kazanç listesi
export async function getPaymentsForFreelancer() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const payments = await prisma.payment.findMany({
    where: { payeeId: session.user.id },
    include: {
      project: { select: { name: true } },
      payer: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return payments.map((p) => ({
    id: p.id,
    projectName: p.project?.name || "Bilinmiyor",
    brandName: p.payer?.name || "Marka",
    amount: p.amount,
    currency: p.currency,
    status: p.status,
    description: p.description,
    paidAt: p.paidAt?.toISOString() || null,
    createdAt: p.createdAt.toISOString(),
  }));
}

// Ödeme oluştur (teslimat onaylandığında çağrılır)
export async function createPayment(data: {
  projectId: string;
  payeeId: string;
  amount: number;
  description?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Oturum bulunamadı." };

  try {
    await prisma.payment.create({
      data: {
        projectId: data.projectId,
        payerId: session.user.id,
        payeeId: data.payeeId,
        amount: data.amount,
        description: data.description || null,
        status: "PENDING",
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    console.error("createPayment error:", error);
    return { error: "Ödeme oluşturulurken hata." };
  }
}

// Ödeme durumunu güncelle
export async function updatePaymentStatus(paymentId: string, status: "PAID" | "CANCELLED") {
  const session = await auth();
  if (!session?.user?.id) return { error: "Oturum bulunamadı." };

  try {
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status,
        paidAt: status === "PAID" ? new Date() : null,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    console.error("updatePaymentStatus error:", error);
    return { error: "İşlem başarısız." };
  }
}

// Finansal özet (Dashboard widget)
export async function getFinancialSummary(role: "BRAND" | "FREELANCER") {
  const session = await auth();
  if (!session?.user?.id) return { totalPaid: 0, totalPending: 0, total: 0 };

  const where = role === "BRAND" ? { payerId: session.user.id } : { payeeId: session.user.id };

  const payments = await prisma.payment.findMany({ where });

  const totalPaid = payments
    .filter((p: { status: string; amount: number }) => p.status === "PAID")
    .reduce((s: number, p: { amount: number }) => s + p.amount, 0);
  const totalPending = payments
    .filter((p: { status: string; amount: number }) => p.status === "PENDING")
    .reduce((s: number, p: { amount: number }) => s + p.amount, 0);

  return { totalPaid, totalPending, total: totalPaid + totalPending };
}
