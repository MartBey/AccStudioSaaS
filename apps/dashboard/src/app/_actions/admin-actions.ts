"use server";

import { prisma } from "database";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";

export type AuditLogFilters = {
  action?: string;
  entityType?: string;
  userId?: string;
  take?: number;
  page?: number;
};

// Admin: Tüm kullanıcıları getir
export async function getAdminUsers() {
  const session = await auth();
  if (!session?.user?.id) return [];

  // Sadece ADMIN kullanıcı görebilir
  const admin = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (admin?.role !== "ADMIN") return [];

  const users = await prisma.user.findMany({
    include: {
      profile: {
        include: {
          brand: { select: { companyName: true } },
          agency: { select: { agencyName: true } },
          freelancer: { select: { id: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return users.map((u) => ({
    id: u.id,
    name: u.name || "İsimsiz",
    email: u.email || "",
    role: u.role,
    createdAt: u.createdAt.toISOString(),
    companyName: u.profile?.brand?.companyName || u.profile?.agency?.agencyName || null,
    hasFreelancer: !!u.profile?.freelancer,
  }));
}

// Admin: Verification başvurularını getir
export async function getAdminVerifications() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const admin = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (admin?.role !== "ADMIN") return [];

  const verifications = await prisma.verification.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Prisma join yapmak yerine manuel username/email çekiyoruz, çünkü schema.prisma'da Verification modelinde User relation'ı yok. (ProfileId üzerinden bağlı)
  const profiles = await prisma.profile.findMany({
    where: { id: { in: verifications.map((v) => v.profileId) } },
    include: { user: true },
  });

  return verifications.map((v) => {
    const profile = profiles.find((p) => p.id === v.profileId);
    return {
      id: v.id,
      userName: profile?.user?.name || "İsimsiz",
      userEmail: profile?.user?.email || "",
      userRole: profile?.user?.role || "FREELANCER",
      status: v.status,
      documentUrl: v.documentUrl,
      notes: v.notes,
      createdAt: v.createdAt.toISOString(),
    };
  });
}

// Admin: Verification durumunu güncelle
export async function updateVerificationStatus(
  verificationId: string,
  status: "APPROVED" | "REJECTED"
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Oturum bulunamadı." };

  const admin = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (admin?.role !== "ADMIN") return { error: "Yetkiniz yok." };

  try {
    await prisma.verification.update({
      where: { id: verificationId },
      data: { status },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: `VERIFICATION_${status}`,
        entityType: "Verification",
        entityId: verificationId,
      },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error: unknown) {
    console.error("updateVerification error:", error);
    return { error: "İşlem başarısız." };
  }
}

// Admin: Platform istatistikleri
export async function getAdminStats() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const admin = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (admin?.role !== "ADMIN") return null;

  const [userCount, projectCount, taskCount, paymentAgg, pendingVerifications] = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.task.count(),
    prisma.payment.findMany({ where: { status: "PAID" } }),
    prisma.verification.count({ where: { status: "PENDING" } }),
  ]);

  const totalRevenue = paymentAgg.reduce((s: number, p: { amount: number }) => s + p.amount, 0);

  return {
    userCount,
    projectCount,
    taskCount,
    totalRevenue,
    pendingVerifications,
  };
}

// Admin: AuditLog kayıtlarını filtreleyerek getir
export async function getAuditLogs(filters: AuditLogFilters = {}) {
  const session = await auth();
  if (!session?.user?.id) return { logs: [], total: 0 };

  const admin = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (admin?.role !== "ADMIN") return { logs: [], total: 0 };

  const { action, entityType, userId, take = 50, page = 1 } = filters;
  const skip = (page - 1) * take;

  const where = {
    ...(action ? { action: { contains: action, mode: "insensitive" as const } } : {}),
    ...(entityType ? { entityType } : {}),
    ...(userId ? { userId } : {}),
  };

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take,
      skip,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    logs: logs.map((l) => ({
      id: l.id,
      action: l.action,
      entityType: l.entityType,
      entityId: l.entityId,
      details: l.details,
      createdAt: l.createdAt.toISOString(),
      user: l.user
        ? { id: l.user.id, name: l.user.name, email: l.user.email, role: l.user.role }
        : null,
    })),
    total,
  };
}

// Admin: Tek kullanıcının detaylı bilgisi
export async function getAdminUserDetail(userId: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const admin = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (admin?.role !== "ADMIN") return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: {
        include: {
          brand: { select: { companyName: true, industry: true } },
          agency: { select: { agencyName: true, teamSize: true } },
          freelancer: {
            select: {
              id: true,
              title: true,
              hourlyRate: true,
              proposals: {
                select: { id: true, status: true, amount: true },
                take: 5,
                orderBy: { createdAt: "desc" },
              },
              tasks: {
                select: { id: true, title: true, status: true, earning: true },
                take: 5,
                orderBy: { createdAt: "desc" },
              },
            },
          },
          verification: { select: { status: true, documentUrl: true, createdAt: true } },
          userSkills: { include: { skill: { select: { name: true } } } },
        },
      },
      auditLogs: {
        orderBy: { createdAt: "desc" },
        take: 20,
        select: { id: true, action: true, entityType: true, entityId: true, createdAt: true },
      },
      paymentsMade: { select: { amount: true, status: true }, take: 10 },
      paymentsReceived: { select: { amount: true, status: true }, take: 10 },
    },
  });

  if (!user) return null;

  const totalPaid = user.paymentsMade
    .filter((p) => p.status === "PAID")
    .reduce((s, p) => s + p.amount, 0);
  const totalReceived = user.paymentsReceived
    .filter((p) => p.status === "PAID")
    .reduce((s, p) => s + p.amount, 0);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
    bio: user.profile?.bio ?? null,
    location: user.profile?.location ?? null,
    website: user.profile?.website ?? null,
    brand: user.profile?.brand ?? null,
    agency: user.profile?.agency ?? null,
    freelancer: user.profile?.freelancer
      ? {
          id: user.profile.freelancer.id,
          title: user.profile.freelancer.title,
          hourlyRate: user.profile.freelancer.hourlyRate,
          recentProposals: user.profile.freelancer.proposals,
          recentTasks: user.profile.freelancer.tasks,
        }
      : null,
    verification: user.profile?.verification
      ? {
          status: user.profile.verification.status,
          documentUrl: user.profile.verification.documentUrl,
          createdAt: user.profile.verification.createdAt.toISOString(),
        }
      : null,
    skills: user.profile?.userSkills.map((us) => us.skill.name) ?? [],
    recentLogs: user.auditLogs.map((l) => ({
      id: l.id,
      action: l.action,
      entityType: l.entityType,
      entityId: l.entityId,
      createdAt: l.createdAt.toISOString(),
    })),
    totalPaid,
    totalReceived,
  };
}

// Admin: Kullanıcı rolünü değiştir (ban için ADMIN-olmayan rol koruması)
export async function changeUserRole(
  targetUserId: string,
  newRole: "BRAND" | "AGENCY" | "FREELANCER"
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Yetkisiz" };

  const admin = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (admin?.role !== "ADMIN") return { error: "Yetkisiz" };

  try {
    await prisma.user.update({ where: { id: targetUserId }, data: { role: newRole } });
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: `ADMIN_CHANGE_ROLE_TO_${newRole}`,
        entityType: "User",
        entityId: targetUserId,
      },
    });
    revalidatePath(`/admin/users/${targetUserId}`);
    revalidatePath("/admin/users");
    return { success: true };
  } catch {
    return { error: "İşlem başarısız" };
  }
}

// ── AI Cost Summary ──────────────────────────────────────

export async function getAICostSummary() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const admin = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (admin?.role !== "ADMIN") return null;

  // Bu ayın başı
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalAgg,
    monthlyAgg,
    totalRequests,
    monthlyRequests,
    failedCount,
    topUsers,
    actionBreakdown,
    recentLogs,
  ] = await Promise.all([
    prisma.usageLog.aggregate({ _sum: { cost: true, totalTokens: true } }),
    prisma.usageLog.aggregate({
      _sum: { cost: true },
      where: { createdAt: { gte: startOfMonth } },
    }),
    prisma.usageLog.count(),
    prisma.usageLog.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.usageLog.count({ where: { success: false } }),
    prisma.usageLog.groupBy({
      by: ["userId"],
      _sum: { cost: true, inputTokens: true, outputTokens: true },
      _count: true,
      orderBy: { _sum: { cost: "desc" } },
      take: 5,
    }),
    prisma.usageLog.groupBy({
      by: ["action"],
      _sum: { cost: true },
      _count: true,
    }),
    prisma.usageLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
      },
    }),
  ]);

  // Top user bilgilerini çek
  const userIds = topUsers.map((u) => u.userId);
  const users =
    userIds.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, name: true, email: true },
        })
      : [];

  return {
    totalCost: totalAgg._sum.cost || 0,
    totalTokens: totalAgg._sum.totalTokens || 0,
    monthlyCost: monthlyAgg._sum.cost || 0,
    totalRequests,
    monthlyRequests,
    errorRate: totalRequests > 0 ? (failedCount / totalRequests) * 100 : 0,
    topUsers: topUsers.map((u) => {
      const user = users.find((usr) => usr.id === u.userId);
      return {
        name: user?.name || user?.email || u.userId,
        totalCost: u._sum.cost || 0,
        requestCount: u._count,
        totalInputTokens: u._sum.inputTokens || 0,
        totalOutputTokens: u._sum.outputTokens || 0,
      };
    }),
    actionBreakdown: actionBreakdown.map((a) => ({
      action: a.action,
      cost: a._sum.cost || 0,
      count: a._count,
    })),
    recentLogs: recentLogs.map((l) => ({
      id: l.id,
      action: l.action,
      model: l.model,
      totalTokens: l.totalTokens,
      cost: l.cost,
      success: l.success,
      durationMs: l.durationMs,
      userName: l.user.name || l.user.email || "—",
      createdAt: l.createdAt.toISOString(),
    })),
  };
}
