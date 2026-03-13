import { redirect } from "next/navigation";

import { getMyVitrin } from "@/app/_actions/vitrin-actions";
import { auth } from "@/auth";

import VitrinEditor from "./_components/vitrin-editor";

export const dynamic = "force-dynamic";

export default async function FreelancerVitrinPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const vitrin = await getMyVitrin();

  const formattedVitrin = vitrin
    ? {
        ...vitrin,
        socialLinks: vitrin.socialLinks
          ? (vitrin.socialLinks as unknown as Record<string, string>)
          : null,
      }
    : null;

  return <VitrinEditor initialData={formattedVitrin} />;
}
