import { getAdminUsers } from "@/app/_actions/admin-actions";
import { Users, Search } from "lucide-react";
import { UsersClient } from "./_components/users-client";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500/10 ring-1 ring-blue-500/20">
              <Users className="h-4 w-4 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Kullanıcılar</h1>
          </div>
          <p className="text-sm text-muted-foreground">Tüm kayıtlı kullanıcıları görüntüle ve yönet.</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold tabular-nums">{users.length}</p>
          <p className="text-xs text-muted-foreground">Toplam Kullanıcı</p>
        </div>
      </div>

      <UsersClient users={users} />
    </div>
  );
}
