import { prisma } from "database";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import MarkaDashboardClient from "./_components/dashboard-client";

export const dynamic = "force-dynamic";

export default async function MarkaDashboard() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: { include: { brand: true } } }
  });

  const brandId = user?.profile?.brand?.id;
  const brandName = user?.profile?.brand?.companyName || user?.name || "Marka";

  let stats = { activeProjects: 0, totalBudget: 0, agencyCount: 0, proposalCount: 0 };
  let recentProjects: { name: string; agency: string; status: string }[] = [];

  if (brandId) {
    const projects = await prisma.project.findMany({
      where: { brandId },
      include: {
        agency: true,
        jobListings: {
          include: { proposals: { select: { id: true } } }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const activeCount = projects.filter(p => p.status === "ACTIVE" || p.status === "IN_REVIEW").length;
    const totalBudget = projects.reduce((sum, p) => 
      sum + p.jobListings.reduce((s, jl) => s + (jl.budget || 0), 0), 0
    );
    const uniqueAgencies = new Set(projects.map(p => p.agencyId).filter(Boolean));
    const totalProposals = projects.reduce((sum, p) =>
      sum + p.jobListings.reduce((s, jl) => s + jl.proposals.length, 0), 0
    );

    stats = {
      activeProjects: activeCount,
      totalBudget,
      agencyCount: uniqueAgencies.size,
      proposalCount: totalProposals,
    };

    recentProjects = projects.slice(0, 5).map(p => ({
      name: p.name,
      agency: p.agency?.agencyName || "Atanmadı",
      status: p.status,
    }));
  }

  return (
    <MarkaDashboardClient
      brandName={brandName}
      stats={stats}
      recentProjects={recentProjects}
    />
  );
}
