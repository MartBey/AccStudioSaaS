import { prisma } from "database";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import MusterilerClient from "./_components/musteriler-client";

export const dynamic = "force-dynamic";

export default async function AjansMusterilerPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Kullanıcının Agency profilini bul
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: { include: { agency: true } } },
  });

  const agencyId = user?.profile?.agency?.id;

  // Bu ajansa atanmış projeleri ve markalarını çek
  const projects = agencyId
    ? await prisma.project.findMany({
        where: { agencyId },
        include: {
          brand: true,
          jobListings: true,
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  // Markaları grupla
  const brandMap = new Map<
    string,
    {
      brandId: string;
      brandName: string;
      avatar: string;
      projects: { name: string; status: string }[];
      totalBudget: number;
      activeProjects: number;
    }
  >();

  for (const p of projects) {
    if (!p.brand) continue;
    const existing = brandMap.get(p.brand.id);
    const projBudget = p.jobListings.reduce((sum, jl) => sum + (jl.budget || 0), 0);
    const isActive = p.status === "ACTIVE" || p.status === "IN_REVIEW";

    if (existing) {
      existing.projects.push({ name: p.name, status: p.status });
      existing.totalBudget += projBudget;
      if (isActive) existing.activeProjects++;
    } else {
      brandMap.set(p.brand.id, {
        brandId: p.brand.id,
        brandName: p.brand.companyName || "İsimsiz Marka",
        avatar: (p.brand.companyName || "M").charAt(0).toUpperCase(),
        projects: [{ name: p.name, status: p.status }],
        totalBudget: projBudget,
        activeProjects: isActive ? 1 : 0,
      });
    }
  }

  const customers = Array.from(brandMap.values()).map((b) => ({
    id: b.brandId,
    brandName: b.brandName,
    avatar: b.avatar,
    projectCount: b.projects.length,
    activeProjects: b.activeProjects,
    totalBudget: b.totalBudget,
    projects: b.projects,
  }));

  return <MusterilerClient customers={customers} />;
}
