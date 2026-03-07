import { prisma } from "database";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import TeslimatYonetimClient from "./_components/teslimat-client";

export const dynamic = "force-dynamic";

export default async function MarkaTeslimatPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      tasks: {
        include: {
          freelancer: {
            include: {
              profile: {
                include: { user: { select: { name: true } } }
              }
            }
          }
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!project) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-muted-foreground">Proje bulunamadı</h2>
      </div>
    );
  }

  const deliveries = project.tasks.map(t => ({
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
    <TeslimatYonetimClient 
      projectTitle={project.name} 
      deliveries={deliveries}
    />
  );
}
