import { redirect } from "next/navigation";

import { getMessageThreads } from "@/app/_actions/message-actions";
import MesajlarClient from "@/app/_components/mesajlar-client";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function MarkaMesajlarPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const threads = await getMessageThreads();

  return <MesajlarClient threads={threads} rolePrefix="/marka" />;
}
