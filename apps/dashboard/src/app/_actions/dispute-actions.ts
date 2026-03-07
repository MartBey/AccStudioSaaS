"use server";

import { prisma } from "database";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// ── Disputes List ──
export async function getDisputes(statusFilter?: string) {
  const session = await auth();
  if (!session?.user?.id) return [];

  const admin = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (admin?.role !== "ADMIN") return [];

  const where = statusFilter && statusFilter !== "ALL" ? { status: statusFilter as any } : {};

  const disputes = await prisma.dispute.findMany({
    where,
    include: {
      raisedBy: { select: { id: true, name: true, email: true, role: true } },
      resolvedBy: { select: { id: true, name: true } },
      project: { select: { id: true, name: true, budget: true } },
      task: { select: { id: true, title: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return disputes.map((d) => ({
    id: d.id,
    reason: d.reason,
    status: d.status,
    adminNotes: d.adminNotes,
    resolution: d.resolution,
    createdAt: d.createdAt.toISOString(),
    resolvedAt: d.resolvedAt?.toISOString() ?? null,
    raisedBy: d.raisedBy,
    resolvedBy: d.resolvedBy,
    project: d.project,
    task: d.task,
  }));
}

// ── Resolve Dispute ──
export async function resolveDispute(
  disputeId: string,
  status: "RESOLVED_BRAND" | "RESOLVED_FREELANCER" | "CLOSED",
  resolution: string,
  adminNotes?: string
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Yetkisiz" };

  const admin = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (admin?.role !== "ADMIN") return { error: "Yetkisiz" };

  try {
    await prisma.dispute.update({
      where: { id: disputeId },
      data: {
        status,
        resolution,
        adminNotes: adminNotes || undefined,
        resolvedById: session.user.id,
        resolvedAt: new Date(),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: `DISPUTE_${status}`,
        entityType: "Dispute",
        entityId: disputeId,
        details: JSON.stringify({ resolution }),
      },
    });

    revalidatePath("/admin/disputes");
    return { success: true };
  } catch {
    return { error: "İşlem başarısız" };
  }
}

// ── Update Dispute Status (Investigating) ──
export async function updateDisputeStatus(disputeId: string, status: "INVESTIGATING") {
  const session = await auth();
  if (!session?.user?.id) return { error: "Yetkisiz" };

  const admin = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (admin?.role !== "ADMIN") return { error: "Yetkisiz" };

  try {
    await prisma.dispute.update({
      where: { id: disputeId },
      data: { status },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "DISPUTE_INVESTIGATING",
        entityType: "Dispute",
        entityId: disputeId,
      },
    });

    revalidatePath("/admin/disputes");
    return { success: true };
  } catch {
    return { error: "İşlem başarısız" };
  }
}
