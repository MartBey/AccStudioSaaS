import { prisma } from "database";
import { redirect } from "next/navigation";

import ProjeDetayClient from "@/app/_components/proje-detay-client";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function MarkaProjeDetayPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      agency: true,
      tasks: {
        include: {
          freelancer: { include: { profile: { include: { user: { select: { name: true } } } } } },
        },
        orderBy: { createdAt: "desc" },
      },
      payments: true,
      messages: true,
    },
  });

  if (!project) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold text-muted-foreground">Proje bulunamadı</h2>
      </div>
    );
  }

  // Tasks
  const tasks = project.tasks.map((t) => ({
    id: t.id,
    title: t.title,
    status: t.status,
    freelancerName: t.freelancer?.profile?.user?.name || null,
    deliveryUrl: t.deliveryUrl,
    deliveredAt: t.deliveredAt?.toISOString() || null,
    approvedAt: t.approvedAt?.toISOString() || null,
    earning: t.earning,
  }));

  // Stats
  const completedTasks = project.tasks.filter((t) => t.status === "DONE").length;
  const totalBudget = project.tasks.reduce((s, t) => s + (t.earning || 0), 0);
  const paidAmount = project.payments
    .filter((p) => p.status === "PAID")
    .reduce((s, p) => s + p.amount, 0);
  const pendingAmount = project.payments
    .filter((p) => p.status === "PENDING")
    .reduce((s, p) => s + p.amount, 0);

  // Timeline
  const timeline = [
    { date: project.createdAt.toISOString(), label: "Proje oluşturuldu", type: "info" as const },
    ...project.tasks
      .filter((t) => t.deliveredAt)
      .map((t) => ({
        date: t.deliveredAt!.toISOString(),
        label: `"${t.title}" teslim edildi`,
        type: "warning" as const,
      })),
    ...project.tasks
      .filter((t) => t.approvedAt)
      .map((t) => ({
        date: t.approvedAt!.toISOString(),
        label: `"${t.title}" onaylandı`,
        type: "success" as const,
      })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <ProjeDetayClient
      project={{
        id: project.id,
        name: project.name,
        description: project.description,
        status: project.status,
        budget: project.budget,
        createdAt: project.createdAt.toISOString(),
        dueDate: project.dueDate?.toISOString() || null,
        agencyName: project.agency?.agencyName || null,
      }}
      tasks={tasks}
      timeline={timeline}
      stats={{
        totalTasks: project.tasks.length,
        completedTasks,
        totalBudget,
        paidAmount,
        pendingAmount,
        messageCount: project.messages.length,
      }}
      rolePrefix="/marka"
    />
  );
}
