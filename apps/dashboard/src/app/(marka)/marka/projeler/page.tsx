import { prisma } from "database";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import ProjelerClient from "./_components/projeler-client";

export const dynamic = "force-dynamic";

export default async function MarkaProjelerPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Kullanıcının Brand profilini bul
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: { include: { brand: true } } },
  });

  const brandId = user?.profile?.brand?.id;

  // Eğer brand profili yoksa boş göster
  const projects = brandId
    ? await prisma.project.findMany({
        where: { brandId },
        include: {
          agency: true,
          jobListings: {
            include: {
              proposals: { select: { id: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  // Client'a uygun formata dönüştür
  const formattedProjects = projects.map((p) => {
    const totalBudget = p.jobListings.reduce((sum, jl) => sum + (jl.budget || 0), 0);
    const proposalCount = p.jobListings.reduce((sum, jl) => sum + jl.proposals.length, 0);

    return {
      id: p.id,
      name: p.name,
      description: p.description || "",
      status: p.status,
      budget: totalBudget || null,
      agencyName: p.agency?.agencyName || null,
      jobCount: p.jobListings.length,
      proposalCount,
      createdAt: p.createdAt.toISOString(),
    };
  });

  return <ProjelerClient projects={formattedProjects} />;
}
