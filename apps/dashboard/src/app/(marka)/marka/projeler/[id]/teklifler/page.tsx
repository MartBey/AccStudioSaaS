import { prisma } from "database";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";

import TekliflerClient from "./_components/teklifler-client";

export const dynamic = "force-dynamic";

export default async function MarkaTekliflerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Proje ve teklifleri çek
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      jobListings: {
        include: {
          proposals: {
            include: {
              freelancer: {
                include: {
                  profile: { include: { user: { select: { name: true } } } },
                },
              },
            },
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  if (!project) notFound();

  // Tüm job listing'lerdeki teklifleri düzleştir
  const allProposals = project.jobListings.flatMap((jl) =>
    jl.proposals.map((p) => ({
      id: p.id,
      freelancerName: p.freelancer?.profile?.user?.name || "İsimsiz Freelancer",
      coverLetter: p.coverLetter,
      amount: p.amount,
      deliveryTime: p.deliveryTime ?? null,
      sampleUrl: p.sampleUrl ?? null,
      status: p.status,
      createdAt: p.createdAt.toISOString(),
    }))
  );

  return (
    <TekliflerClient projectName={project.name} projectId={project.id} proposals={allProposals} />
  );
}
