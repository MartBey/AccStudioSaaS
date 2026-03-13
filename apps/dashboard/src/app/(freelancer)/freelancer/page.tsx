import { prisma } from "database";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import FreelancerDashboardClient from "./_components/dashboard-client";

export const dynamic = "force-dynamic";

export default async function FreelancerDashboard() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: { include: { freelancer: true } } },
  });

  const freelancerId = user?.profile?.freelancer?.id;
  const userName = user?.name || "Yetenekli Biri";

  // İstatistikleri hesapla
  let stats = {
    pendingBalance: 0,
    completedEarnings: 0,
    activeTasks: 0,
    completedJobs: 0,
    successRate: 0,
  };
  let recentTasks: { title: string; project: string; deadline: string; urgent: boolean }[] = [];
  let suggestedJobs: { title: string; brand: string; budget: string }[] = [];

  if (freelancerId) {
    // Aktif görevler
    const tasks = await prisma.task.findMany({
      where: { freelancerId },
      include: { project: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    const activeTasks = tasks.filter(
      (t) => t.status === "TODO" || t.status === "IN_PROGRESS" || t.status === "REVISION"
    );
    const completedTasks = tasks.filter((t) => t.status === "DONE");
    const deliveredTasks = tasks.filter((t) => t.status === "DELIVERED");
    const totalTasks = tasks.length;
    const successRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

    // Kazanç hesaplama: DONE = tamamlanan, DELIVERED/IN_PROGRESS = bekleyen
    const completedEarnings = completedTasks.reduce((sum, t) => sum + (t.earning || 0), 0);
    const pendingBalance = [...activeTasks, ...deliveredTasks].reduce(
      (sum, t) => sum + (t.earning || 0),
      0
    );

    stats = {
      pendingBalance,
      completedEarnings,
      activeTasks: activeTasks.length,
      completedJobs: completedTasks.length,
      successRate,
    };

    // Son görevler
    recentTasks = activeTasks.slice(0, 3).map((t) => {
      const dueDate = t.dueDate;
      let deadline = "Tarih yok";
      let urgent = false;
      if (dueDate) {
        const diffDays = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        if (diffDays <= 1) {
          deadline = "Bugün";
          urgent = true;
        } else if (diffDays === 2) {
          deadline = "Yarın";
          urgent = true;
        } else deadline = `${diffDays} gün kaldı`;
      }
      return { title: t.title, project: t.project?.name || "", deadline, urgent };
    });

    // Önerilen ilanlar
    const openJobs = await prisma.jobListing.findMany({
      where: { status: "OPEN" },
      include: { project: { include: { brand: true } } },
      take: 3,
      orderBy: { createdAt: "desc" },
    });
    suggestedJobs = openJobs.map((j) => ({
      title: j.title,
      brand: j.project?.brand?.companyName || "Marka",
      budget: j.budget ? `₺${j.budget.toLocaleString("tr-TR")}` : "Belirtilmemiş",
    }));
  }

  return (
    <FreelancerDashboardClient
      userName={userName}
      stats={stats}
      recentTasks={recentTasks}
      suggestedJobs={suggestedJobs}
    />
  );
}
