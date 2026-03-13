import { redirect } from "next/navigation";

import { getVerificationStatus } from "@/app/_actions/verification-actions";
import DogrulamaClient from "@/app/_components/dogrulama-client";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function FreelancerDogrulamaPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const verification = await getVerificationStatus();

  return (
    <DogrulamaClient
      verification={verification}
      userName={session.user.name || ""}
      userRole={(session.user as any).role || "FREELANCER"}
    />
  );
}
