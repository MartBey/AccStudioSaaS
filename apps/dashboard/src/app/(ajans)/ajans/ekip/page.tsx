import { prisma } from "database";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import EkipClient from "./_components/ekip-client";

export const dynamic = "force-dynamic";

export default async function AjansEkipPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Kullanıcının Agency profilini bul
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: { include: { agency: true } } }
  });

  const agencyId = user?.profile?.agency?.id;

  // Ajans çalışanlarını çek
  const employees = agencyId
    ? await prisma.employee.findMany({
        where: { agencyId },
      })
    : [];

  const formattedMembers = employees.map((e) => ({
    id: e.id,
    name: e.name || "İsimsiz",
    role: e.role || "Çalışan",
    email: e.email || "",
    projectCount: 0,
    joinedAt: e.createdAt.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }),
  }));

  return <EkipClient members={formattedMembers} />;
}
