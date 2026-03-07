import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getNotifications } from "@/app/_actions/notification-actions";
import BildirimlerClient from "@/app/_components/bildirimler-client";

export const dynamic = "force-dynamic";

export default async function FreelancerBildirimlerPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { notifications, unreadCount } = await getNotifications();

  return <BildirimlerClient notifications={notifications} unreadCount={unreadCount} />;
}
