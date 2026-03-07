import { prisma } from "database";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import IlanDetayClient from "./_components/ilan-detay-client";

export const dynamic = "force-dynamic";

export default async function IlanDetayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  // İlanı DB'den çek
  const job = await prisma.jobListing.findUnique({
    where: { id },
    include: {
      project: {
        include: {
          brand: { include: { profile: { include: { verification: true } } } },
          agency: { include: { profile: { include: { verification: true } } } },
        }
      },
      proposals: { select: { id: true, freelancerId: true } }
    }
  });

  if (!job) notFound();

  // Freelancer ID'yi bul
  let freelancerId: string | null = null;
  let alreadyApplied = false;

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { profile: { include: { freelancer: true } } }
    });
    freelancerId = user?.profile?.freelancer?.id || null;

    if (freelancerId) {
      alreadyApplied = job.proposals.some(p => p.freelancerId === freelancerId);
    }
  }

  const brand = job.project?.brand;
  const agency = job.project?.agency;
  const companyName = brand?.companyName || agency?.agencyName || "Bilinmiyor";
  const verification = brand?.profile?.verification || agency?.profile?.verification;
  const isVerified = verification?.status === "APPROVED";

  const formattedJob = {
    id: job.id,
    title: job.title,
    description: job.description,
    budget: job.budget,
    companyName,
    isVerified,
    proposalCount: job.proposals.length,
    createdAt: job.createdAt.toISOString(),
    projectName: job.project?.name || "",
  };

  return (
    <IlanDetayClient 
      job={formattedJob} 
      alreadyApplied={alreadyApplied} 
      freelancerId={freelancerId} 
    />
  );
}
