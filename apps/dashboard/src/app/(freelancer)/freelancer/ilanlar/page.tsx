import { prisma } from "database";

import JobBoardClient from "./_components/job-board-client";

// Bu sayfa her istekte dinamik olarak render edilir (DB bağlantısı gerektirir)
export const dynamic = "force-dynamic";

// Filtre kategorileri (mock olarak kalabilir veya Skill tablosundan çekilebilir)
const filterCategories = [
  "Web Geliştirme",
  "Mobil Uygulama",
  "UI/UX Tasarım",
  "SEO & Dijital Pazarlama",
  "İçerik Üretimi",
  "Video & Animasyon",
  "Sosyal Medya Yönetimi",
  "E-Ticaret",
];

export default async function JobBoardPage() {
  const jobs = await prisma.jobListing.findMany({
    where: { status: "OPEN" },
    include: {
      project: {
        include: {
          brand: {
            include: {
              profile: {
                include: {
                  verification: true,
                },
              },
            },
          },
          agency: {
            include: {
              profile: {
                include: {
                  verification: true,
                },
              },
            },
          },
        },
      },
      proposals: {
        select: { id: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Veriyi client component'e uygun formata dönüştür
  const formattedJobs = jobs.map((job) => {
    const brand = job.project?.brand;
    const agency = job.project?.agency;
    const companyName = brand?.companyName || agency?.agencyName || "Bilinmiyor";
    const verification = brand?.profile?.verification || agency?.profile?.verification;
    const isVerified = verification?.status === "APPROVED";

    return {
      id: job.id,
      title: job.title,
      description: job.description,
      budget: job.budget,
      status: job.status,
      companyName,
      isVerified,
      proposalCount: job.proposals.length,
      createdAt: job.createdAt.toISOString(),
      projectName: job.project?.name || "",
    };
  });

  return <JobBoardClient jobs={formattedJobs} filterCategories={filterCategories} />;
}
