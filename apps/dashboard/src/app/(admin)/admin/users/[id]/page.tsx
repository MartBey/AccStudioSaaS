import { notFound } from "next/navigation";
import { getAdminUserDetail } from "@/app/_actions/admin-actions";
import { UserDetailClient } from "./_components/user-detail-client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminUserDetailPage({ params }: Props) {
  const { id } = await params;
  const user = await getAdminUserDetail(id);

  if (!user) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/users"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kullanıcılara Dön
        </Link>
      </div>
      <UserDetailClient user={user} />
    </div>
  );
}
