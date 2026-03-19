import { prisma } from "database";
import { redirect } from "next/navigation";
import { DeliveryManagement } from "ui";

import { approveDelivery, requestRevision } from "@/app/_actions/delivery-actions";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function MarkaTeslimatPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      tasks: {
        include: {
          freelancer: {
            include: {
              profile: {
                include: { user: { select: { name: true } } },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!project) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold text-muted-foreground">Proje bulunamadı</h2>
      </div>
    );
  }

  const deliveries = project.tasks.map((t) => ({
    taskId: t.id,
    taskTitle: t.title,
    status: t.status,
    earning: t.earning,
    deliveryUrl: t.deliveryUrl,
    deliveryNote: t.deliveryNote,
    deliveredAt: t.deliveredAt?.toISOString() || null,
    approvedAt: t.approvedAt?.toISOString() || null,
    freelancerName: t.freelancer?.profile?.user?.name || "İsimsiz Freelancer",
  }));

  return (
    <DeliveryManagement
      projectTitle={project.name}
      deliveries={deliveries}
      onApprove={(id) => approveDelivery(id) as any}
      onRevision={(taskId, revisionNote) => requestRevision({ taskId, revisionNote }) as any}
    />
  );
}
