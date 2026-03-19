import { prisma } from "database";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import TeslimClient from "./_components/teslim-client";

export const dynamic = "force-dynamic";

export default async function GorevTeslimPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      project: { select: { name: true } },
    },
  });

  if (!task) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold text-muted-foreground">Görev bulunamadı</h2>
      </div>
    );
  }

  return (
    <TeslimClient
      task={{
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        earning: task.earning,
        deliveryUrl: task.deliveryUrl,
        deliveryNote: task.deliveryNote,
        deliveredAt: task.deliveredAt?.toISOString() || null,
        approvedAt: task.approvedAt?.toISOString() || null,
        revisionNote: task.revisionNote,
        projectName: task.project.name,
        dueDate: task.dueDate?.toISOString() || null,
      }}
    />
  );
}
