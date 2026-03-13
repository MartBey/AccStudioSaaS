import { prisma } from "database";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import PortfoyClient from "./_components/portfolyo-client";

export const dynamic = "force-dynamic";

export default async function FreelancerPortfoyPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: {
        include: {
          freelancer: {
            include: {
              tasks: {
                where: { status: "DONE" },
                include: { project: { select: { name: true } } },
                orderBy: { updatedAt: "desc" },
                take: 10,
              },
              proposals: {
                select: { sampleUrl: true, amount: true, jobListing: { select: { title: true } } },
              },
              portfolioItems: {
                orderBy: { date: "desc" },
              },
            },
          },
        },
      },
    },
  });

  const freelancer = user?.profile?.freelancer;
  const profile = user?.profile;

  const completedProjects =
    freelancer?.tasks.map((t: any) => ({
      title: t.title,
      projectName: t.project?.name || "",
      earning: t.earning || 0,
      completedAt: t.updatedAt.toISOString(),
      deliveryUrl: t.deliveryUrl || null,
    })) || [];

  const totalEarnings = completedProjects.reduce((s: number, p: any) => s + p.earning, 0);
  const sampleWorks =
    freelancer?.proposals
      .filter((p: any) => p.sampleUrl)
      .map((p: any) => ({ url: p.sampleUrl!, title: p.jobListing.title })) || [];

  const portfolioItems =
    freelancer?.portfolioItems?.map((p: any) => ({
      id: p.id,
      title: p.title || "İsimsiz Proje",
      description: p.description,
      projectUrl: p.projectUrl,
      imageUrl: p.imageUrl,
      date: p.date ? new Date(p.date) : null,
      category: p.category,
    })) || [];

  return (
    <PortfoyClient
      profile={{
        name: user?.name || "Freelancer",
        bio: profile?.bio || null,
        location: profile?.location || null,
        website: profile?.website || null,
        image: user?.image || null,
        joinedAt: user?.createdAt.toISOString() || "",
      }}
      skills={[]}
      completedProjects={completedProjects}
      sampleWorks={sampleWorks}
      portfolioItems={portfolioItems}
      stats={{
        totalEarnings,
        completedCount: completedProjects.length,
        successRate: freelancer?.tasks.length
          ? Math.round((completedProjects.length / freelancer.tasks.length) * 100)
          : 0,
      }}
    />
  );
}
