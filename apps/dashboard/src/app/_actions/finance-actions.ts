"use server";

import { prisma } from "database";

import { auth } from "@/auth";

// ── Finance Overview ──
export async function getFinanceOverview() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const admin = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (admin?.role !== "ADMIN") return null;

  const payments = await prisma.payment.findMany({
    select: {
      amount: true,
      currency: true,
      status: true,
      paidAt: true,
      createdAt: true,
    },
  });

  // Toplam istatistikler
  const totalGMV = payments.reduce((s, p) => s + p.amount, 0);
  const paidPayments = payments.filter((p) => p.status === "PAID");
  const totalPaid = paidPayments.reduce((s, p) => s + p.amount, 0);
  const pendingPayments = payments.filter((p) => p.status === "PENDING");
  const totalPending = pendingPayments.reduce((s, p) => s + p.amount, 0);
  const cancelledPayments = payments.filter(
    (p) => p.status === "CANCELLED" || p.status === "REFUNDED"
  );
  const totalCancelled = cancelledPayments.reduce((s, p) => s + p.amount, 0);

  // Aylık bazda gelir (son 12 ay)
  const now = new Date();
  const monthlyData: { month: string; amount: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("tr-TR", { month: "short", year: "numeric" });
    const monthTotal = paidPayments
      .filter((p) => {
        const pd = p.paidAt || p.createdAt;
        return pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth();
      })
      .reduce((s, p) => s + p.amount, 0);
    monthlyData.push({ month: label, amount: monthTotal });
  }

  // Son 10 ödeme
  const recentPayments = await prisma.payment.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      payer: { select: { name: true, email: true } },
      payee: { select: { name: true, email: true } },
      project: { select: { name: true } },
    },
  });

  return {
    totalGMV,
    totalPaid,
    totalPending,
    totalCancelled,
    paymentCount: payments.length,
    paidCount: paidPayments.length,
    pendingCount: pendingPayments.length,
    monthlyData,
    recentPayments: recentPayments.map((p) => ({
      id: p.id,
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      payer: p.payer.name || p.payer.email || "—",
      payee: p.payee.name || p.payee.email || "—",
      project: p.project.name,
      createdAt: p.createdAt.toISOString(),
    })),
  };
}
