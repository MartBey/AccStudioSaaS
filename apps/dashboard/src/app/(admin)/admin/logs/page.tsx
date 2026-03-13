import { ActivitySquare } from "lucide-react";

import { getAuditLogs } from "@/app/_actions/admin-actions";

import { AdvancedAdminTable } from "./_components/advanced-admin-table";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

export default async function AdminLogsPage() {
  const { logs, total } = await getAuditLogs({ take: PAGE_SIZE, page: 1 });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 ring-1 ring-primary/20">
              <ActivitySquare className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Aktivite Akışı</h1>
          </div>
          <p className="ml-10.5 text-sm text-muted-foreground">
            Platformdaki her hareket anlık olarak burada görünür.
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold tabular-nums">{total}</p>
          <p className="text-xs text-muted-foreground">Toplam Log</p>
        </div>
      </div>

      {/* Table */}
      <AdvancedAdminTable initialLogs={logs as any} totalCount={total} pageSize={PAGE_SIZE} />
    </div>
  );
}
