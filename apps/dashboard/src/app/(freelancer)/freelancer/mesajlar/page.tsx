import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getMessageThreads } from "@/app/_actions/message-actions";
import MesajlarClient from "@/app/_components/mesajlar-client";

export const dynamic = "force-dynamic";

export default async function FreelancerMesajlarPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const threads = await getMessageThreads();

  return <MesajlarClient threads={threads} rolePrefix="/freelancer" />;
}
