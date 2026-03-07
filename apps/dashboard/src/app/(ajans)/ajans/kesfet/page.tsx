import { prisma } from "database";
import KesfetClient from "./_components/kesfet-client";

export const dynamic = "force-dynamic";

export default async function AjansKesfetPage() {
  // Tüm freelancer'ları çek (skills ve verification dahil)
  const freelancers = await prisma.freelancer.findMany({
    include: {
      profile: {
        include: {
          user: { select: { name: true } },
          verification: true,
          userSkills: {
            include: { skill: true }
          }
        }
      },
      proposals: { where: { status: "ACCEPTED" }, select: { id: true } }
    }
  });

  // Client'a uygun formata dönüştür
  const formattedFreelancers = freelancers.map((f) => {
    const name = f.profile?.user?.name || "İsimsiz";
    const skills = f.profile?.userSkills?.map(us => us.skill.name) || [];
    const isVerified = f.profile?.verification?.status === "APPROVED";

    return {
      id: f.id,
      name,
      title: f.title || "Freelancer",
      avatar: name.charAt(0).toUpperCase(),
      skills,
      isVerified,
      hourlyRate: f.hourlyRate || 0,
      completedProjects: f.proposals?.length || 0,
      location: "Türkiye",
      available: true,
    };
  });

  // Mevcut skill tag'leri
  const allSkills = await prisma.skill.findMany({ take: 10 });
  const skillTags = allSkills.map(s => s.name);

  return (
    <KesfetClient 
      freelancers={formattedFreelancers} 
      skillTags={skillTags.length > 0 ? skillTags : ["React", "SEO", "Tasarım", "İçerik", "UI/UX", "Node.js"]} 
    />
  );
}
