import { ShieldAlert } from "lucide-react";

import { getDisputes } from "@/app/_actions/dispute-actions";

import { DisputesClient } from "./_components/disputes-client";

export const dynamic = "force-dynamic";

export default async function AdminDisputesPage() {
  const disputes = await getDisputes();

  const openCount = disputes.filter(
    (d) => d.status === "OPEN" || d.status === "INVESTIGATING"
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-red-500/10 ring-1 ring-red-500/20">
              <ShieldAlert className="h-4 w-4 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Uyuşmazlıklar</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Kullanıcılar arası anlaşmazlıkları incele ve karara bağla.
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold tabular-nums">{openCount}</p>
          <p className="text-xs text-muted-foreground">Açık Uyuşmazlık</p>
        </div>
      </div>

      <DisputesClient disputes={disputes} />
    </div>
  );
}
