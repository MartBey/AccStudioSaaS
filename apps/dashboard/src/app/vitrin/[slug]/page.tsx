import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getVitrinBySlug } from "@/app/_actions/vitrin-actions";

import VitrinView from "./_components/vitrin-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vitrin = await getVitrinBySlug(slug);
  if (!vitrin) return { title: "Vitrin Bulunamadı" };
  return {
    title: `${vitrin.freelancerName} — ${vitrin.headline || "Freelancer"} | AccStudio`,
    description: vitrin.about || vitrin.bio || `${vitrin.freelancerName} freelancer vitrini`,
    openGraph: {
      title: `${vitrin.freelancerName} | AccStudio Vitrin`,
      description: vitrin.headline || "Freelancer Profili",
    },
  };
}

export default async function PublicVitrinPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vitrin = await getVitrinBySlug(slug);
  const formattedVitrin = vitrin
    ? {
        ...vitrin,
        socialLinks: (vitrin.socialLinks || null) as Record<string, string> | null,
      }
    : null;

  if (!formattedVitrin) return notFound();

  return <VitrinView data={formattedVitrin} />;
}
