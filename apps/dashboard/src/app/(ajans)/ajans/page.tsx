import { prisma } from "database";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AjansDashboardClient from "./_components/dashboard-client";

export const dynamic = "force-dynamic";

export default async function AjansDashboard() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: { include: { agency: true } } }
  });

  const agencyId = user?.profile?.agency?.id;
  const agencyName = user?.profile?.agency?.agencyName || user?.name || "Ajans";

  let stats = { activeClients: 0, teamSize: 0, openTasks: 0, completedProjects: 0 };
  let activeProjectsList: { client: string; project: string; status: string }[] = [];

  if (agencyId) {
    // Projeler ve müşteriler
    const projects = await prisma.project.findMany({
      where: { agencyId },
      include: { brand: true }
    });

    const uniqueBrands = new Set(projects.map(p => p.brandId).filter(Boolean));
    const completedProjects = projects.filter(p => p.status === "COMPLETED").length;

    // Ekip üye sayısı
    const employeeCount = await prisma.employee.count({ where: { agencyId } });

    // Açık görevler (ajansın projelerine bağlı)
    const projectIds = projects.map(p => p.id);
    const openTaskCount = projectIds.length > 0
      ? await prisma.task.count({
          where: { projectId: { in: projectIds }, status: { in: ["TODO", "IN_PROGRESS"] } }
        })
      : 0;

    stats = {
      activeClients: uniqueBrands.size,
      teamSize: employeeCount,
      openTasks: openTaskCount,
      completedProjects,
    };

    // Aktif projeler listesi
    activeProjectsList = projects
      .filter(p => p.status === "ACTIVE" || p.status === "IN_REVIEW")
      .slice(0, 5)
      .map(p => ({
        client: p.brand?.companyName || "Marka",
        project: p.name,
        status: p.status === "ACTIVE" ? "Devam Ediyor" : "İncelemede",
      }));
  }

  return (
    <AjansDashboardClient
      agencyName={agencyName}
      stats={stats}
      activeProjects={activeProjectsList}
    />
  );
}
