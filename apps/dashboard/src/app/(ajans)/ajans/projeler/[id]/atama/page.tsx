import { prisma } from "database";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import GorevAtamaClient from "./_components/gorev-atama-client";

export const dynamic = "force-dynamic";

export default async function AjansGorevAtamaPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Ajans profili
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: { include: { agency: true } } },
  });

  const agencyId = user?.profile?.agency?.id;
  if (!agencyId) redirect("/ajans");

  // Proje ve görevleri
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      tasks: {
        include: {
          freelancer: { include: { profile: { include: { user: { select: { name: true } } } } } },
          employee: { select: { name: true } },
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

  // Ajansın çalışanları
  const employees = await prisma.employee.findMany({
    where: { agencyId, status: "ACTIVE" },
  });

  const tasks = project.tasks.map((t: any) => ({
    id: t.id,
    title: t.title,
    status: t.status,
    assignedEmployeeName: t.employee?.name || null,
    freelancerName: t.freelancer?.profile?.user?.name || null,
  }));

  const employeeList = employees.map((e) => ({
    id: e.id,
    name: e.name,
    role: e.role,
  }));

  return <GorevAtamaClient projectTitle={project.name} tasks={tasks} employees={employeeList} />;
}
