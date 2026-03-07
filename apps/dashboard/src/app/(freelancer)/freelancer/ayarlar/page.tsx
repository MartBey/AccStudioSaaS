import { prisma } from "database";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AyarlarClient from "@/app/_components/ayarlar-client";

export const dynamic = "force-dynamic";

export default async function FreelancerAyarlarPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true }
  });

  if (!user) redirect("/login");

  return (
    <AyarlarClient 
      profile={{
        name: user.name || "",
        email: user.email || "",
        role: user.role,
        bio: user.profile?.bio || "",
        location: user.profile?.location || "",
        website: user.profile?.website || "",
        joinDate: user.createdAt.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }),
      }}
    />
  );
}
