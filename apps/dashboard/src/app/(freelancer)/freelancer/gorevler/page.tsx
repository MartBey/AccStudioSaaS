import { prisma } from "database";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import KanbanClient from "./_components/kanban-client";

export const dynamic = "force-dynamic";

export default async function FreelancerGorevlerPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Kullanıcının Freelancer profilini bul
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: { include: { freelancer: true } } },
  });

  const freelancerId = user?.profile?.freelancer?.id;

  // Freelancer'a atanmış görevleri çek
  const tasks = freelancerId
    ? await prisma.task.findMany({
        where: { freelancerId },
        include: {
          project: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  // Deadline hesaplaması
  const formatDeadline = (date: Date | null) => {
    if (!date) return "Tarih yok";
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return `${Math.abs(diffDays)} gün gecikti`;
    if (diffDays === 0) return "Bugün";
    if (diffDays === 1) return "Yarın";
    return `${diffDays} gün kaldı`;
  };

  // Client'a uygun formata dönüştür
  const formattedTasks = tasks.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description || "",
    status: t.status, // TODO, IN_PROGRESS, REVIEW, DONE
    projectName: t.project?.name || "Proje belirtilmemiş",
    earning: 0, // İleride proposal amount'tan hesaplanabilir
    deadline: formatDeadline(t.dueDate),
  }));

  return <KanbanClient tasks={formattedTasks} />;
}
