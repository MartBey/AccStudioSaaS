"use server";

import { prisma } from "database";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Slug generator
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Benzersiz slug oluştur
async function uniqueSlug(base: string): Promise<string> {
  let slug = slugify(base);
  let counter = 1;
  while (await prisma.vitrin.findUnique({ where: { slug } })) {
    slug = `${slugify(base)}-${counter}`;
    counter++;
  }
  return slug;
}

// Vitrin oluştur
export async function createVitrin(data: {
  slug?: string;
  headline?: string | null;
  about?: string | null;
  theme?: string;
  showEarnings?: boolean;
  showContact?: boolean;
  socialLinks?: Record<string, string> | null;
  techStack?: string | null;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Oturum bulunamadı." };

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: { include: { freelancer: true } } },
  });

  const freelancerId = user?.profile?.freelancer?.id;
  if (!freelancerId) return { error: "Freelancer profili bulunamadı." };

  // Slug oluştur
  const slug = data.slug 
    ? await uniqueSlug(data.slug) 
    : await uniqueSlug(user?.name || "freelancer");

  try {
    await prisma.vitrin.create({
      data: {
        freelancerId,
        slug,
        headline: data.headline || null,
        about: data.about || null,
        theme: data.theme || "default",
        showEarnings: data.showEarnings ?? false,
        showContact: data.showContact ?? true,
        socialLinks: data.socialLinks ? (data.socialLinks as any) : null,
        techStack: data.techStack !== undefined ? data.techStack : null,
      },
    });

    revalidatePath("/freelancer/vitrin");
    return { success: true, slug };
  } catch (error: unknown) {
    console.error("createVitrin error:", error);
    return { error: "Vitrin oluşturulurken hata." };
  }
}

// Vitrin güncelle
export async function updateVitrin(data: {
  slug?: string;
  headline?: string | null;
  about?: string | null;
  theme?: string;
  showEarnings?: boolean;
  showContact?: boolean;
  socialLinks?: Record<string, string> | null;
  techStack?: string | null;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Oturum bulunamadı." };

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    include: { freelancer: { include: { vitrin: true } } }
  });

  const vitrin = profile?.freelancer?.vitrin;
  if (!vitrin) return { error: "Vitrin bulunamadı." };

  try {
    await prisma.vitrin.update({
      where: { id: vitrin.id },
      data: {
        slug: data.slug ? slugify(data.slug) : undefined,
        headline: data.headline,
        about: data.about,
        theme: data.theme,
        showEarnings: data.showEarnings,
        showContact: data.showContact,
        socialLinks: data.socialLinks ? (data.socialLinks as any) : undefined,
        techStack: data.techStack !== undefined ? data.techStack : undefined,
      },
    });

    revalidatePath("/freelancer/vitrin");
    if (data.slug) revalidatePath(`/vitrin/${slugify(data.slug)}`);
    return { success: true };
  } catch (error: unknown) {
    console.error("updateVitrin error:", error);
    return { error: "Güncelleme başarısız." };
  }
}

// Kendi vitrinimi getir
export async function getMyVitrin() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: { include: { freelancer: { include: { vitrin: true } } } } },
  });

  return user?.profile?.freelancer?.vitrin || null;
}

// Public: Slug ile vitrin getir (SEO + public sayfa)
export async function getVitrinBySlug(slug: string) {
  const vitrin = await prisma.vitrin.findUnique({
    where: { slug },
    include: {
      freelancer: {
        include: {
          profile: {
            include: {
              user: { select: { name: true, image: true } },
              verification: { select: { status: true } },
            }
          },
          tasks: {
            where: { status: "DONE" },
            include: { project: { select: { name: true } } },
            take: 6,
            orderBy: { updatedAt: "desc" },
          },
          proposals: {
            where: { status: "ACCEPTED" },
            select: { amount: true },
          },
          portfolioItems: {
            orderBy: { date: "desc" },
          }
        }
      }
    },
  });

  if (!vitrin) return null;

  const freelancer = vitrin.freelancer;
  const profile = freelancer.profile;
  const totalEarnings = freelancer.proposals.reduce((s: number, p: { amount: number }) => s + p.amount, 0);
  const isVerified = profile?.verification?.status === "APPROVED";

  return {
    ...vitrin,
    freelancerName: profile?.user?.name || "Freelancer",
    freelancerImage: profile?.user?.image || null,
    freelancerTitle: freelancer.title || vitrin.headline || null,
    bio: profile?.bio || null,
    location: profile?.location || null,
    website: profile?.website || null,
    isVerified,
    totalEarnings: vitrin.showEarnings ? totalEarnings : null,
    skills: vitrin.techStack ? vitrin.techStack.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
    completedProjects: freelancer.tasks.map((t: { title: string; project?: { name: string } | null; earning?: number | null }) => ({
      title: t.title,
      projectName: t.project?.name || "",
      earning: t.earning || 0,
    })),
    portfolioItems: freelancer.portfolioItems.map((p: any) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      projectUrl: p.projectUrl,
      imageUrl: p.imageUrl,
      date: p.date,
      category: p.category,
    })),
  };
}
