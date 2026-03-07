"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "ui";
import {
  Search, AlertTriangle, CheckCircle2, Clock, User, Briefcase,
  FileText, MessageSquare, ChevronDown, X,
} from "lucide-react";
import { resolveDispute, updateDisputeStatus } from "@/app/_actions/dispute-actions";

// ---- types ----
interface DisputeItem {
  id: string;
  reason: string;
  status: string;
  adminNotes: string | null;
  resolution: string | null;
  createdAt: string;
  resolvedAt: string | null;
  raisedBy: { id: string; name: string | null; email: string | null; role: string };
  resolvedBy: { id: string; name: string | null } | null;
  project: { id: string; name: string; budget: number | null } | null;
  task: { id: string; title: string; status: string } | null;
}

// ---- helpers ----
const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  OPEN: { label: "Açık", color: "bg-red-500/10 text-red-400 ring-1 ring-red-500/20", icon: AlertTriangle },
  INVESTIGATING: { label: "İnceleniyor", color: "bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/20", icon: Search },
  RESOLVED_BRAND: { label: "Marka Lehine", color: "bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20", icon: CheckCircle2 },
  RESOLVED_FREELANCER: { label: "Freelancer Lehine", color: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20", icon: CheckCircle2 },
  CLOSED: { label: "Kapatıldı", color: "bg-muted text-muted-foreground ring-1 ring-border", icon: X },
};

const TABS = ["ALL", "OPEN", "INVESTIGATING", "RESOLVED_BRAND", "RESOLVED_FREELANCER", "CLOSED"] as const;
const TAB_LABELS: Record<string, string> = {
  ALL: "Tümü",
  OPEN: "Açık",
  INVESTIGATING: "İnceleniyor",
  RESOLVED_BRAND: "Marka Lehine",
  RESOLVED_FREELANCER: "Freelancer Lehine",
  CLOSED: "Kapalı",
};

export function DisputesClient({ disputes }: { disputes: DisputeItem[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState<string>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [resolution, setResolution] = useState("");

  const filtered = disputes.filter((d) => tab === "ALL" || d.status === tab);

  const handleInvestigate = (id: string) => {
    startTransition(async () => {
      await updateDisputeStatus(id, "INVESTIGATING");
      router.refresh();
    });
  };

  const handleResolve = (id: string, status: "RESOLVED_BRAND" | "RESOLVED_FREELANCER" | "CLOSED") => {
    if (!resolution.trim()) return;
    startTransition(async () => {
      await resolveDispute(id, status, resolution);
      setResolution("");
      setExpandedId(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-border pb-3 overflow-x-auto">
        {TABS.map((t) => {
          const count = t === "ALL" ? disputes.length : disputes.filter((d) => d.status === t).length;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap",
                tab === t ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {TAB_LABELS[t]} <span className="opacity-60 ml-1">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Items */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <AlertTriangle className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Bu kategoride uyuşmazlık bulunmuyor.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((d) => {
            const cfg = STATUS_CONFIG[d.status] || STATUS_CONFIG.OPEN;
            const StatusIcon = cfg.icon;
            const isExpanded = expandedId === d.id;
            const isOpen = d.status === "OPEN" || d.status === "INVESTIGATING";

            return (
              <div key={d.id} className={cn("rounded-xl border transition-colors", isOpen ? "border-red-500/30" : "border-border")}>
                {/* Header */}
                <div
                  className="p-4 cursor-pointer hover:bg-muted/20 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : d.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={cn("flex h-8 w-8 items-center justify-center rounded-md shrink-0", cfg.color.split(" ").slice(0, 1).join(" "))}>
                        <StatusIcon className={cn("h-4 w-4", cfg.color.split(" ").slice(1, 2).join(" "))} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium", cfg.color)}>
                            {cfg.label}
                          </span>
                          {d.project && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Briefcase className="h-3 w-3" /> {d.project.name}
                            </span>
                          )}
                          {d.task && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <FileText className="h-3 w-3" /> {d.task.title}
                            </span>
                          )}
                        </div>
                        <p className="text-sm line-clamp-2">{d.reason}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-1"><User className="h-3 w-3" />{d.raisedBy.name || d.raisedBy.email} ({d.raisedBy.role})</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(d.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronDown className={cn("h-4 w-4 text-muted-foreground shrink-0 transition-transform", isExpanded && "rotate-180")} />
                  </div>
                </div>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div className="border-t border-border p-4 bg-muted/10 space-y-4">
                    {/* Reason */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Şikayet Nedeni</p>
                      <p className="text-sm bg-background rounded-md border border-border p-3">{d.reason}</p>
                    </div>

                    {/* Project/Task info */}
                    {(d.project || d.task) && (
                      <div className="grid md:grid-cols-2 gap-3">
                        {d.project && (
                          <div className="rounded-md border border-border p-3">
                            <p className="text-xs font-medium text-muted-foreground mb-1">İlgili Proje</p>
                            <p className="text-sm font-medium">{d.project.name}</p>
                            {d.project.budget && <p className="text-xs text-muted-foreground">Bütçe: ₺{d.project.budget.toLocaleString("tr-TR")}</p>}
                          </div>
                        )}
                        {d.task && (
                          <div className="rounded-md border border-border p-3">
                            <p className="text-xs font-medium text-muted-foreground mb-1">İlgili Görev</p>
                            <p className="text-sm font-medium">{d.task.title}</p>
                            <p className="text-xs text-muted-foreground">Durum: {d.task.status}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Resolution (if resolved) */}
                    {d.resolution && (
                      <div className="rounded-md border border-emerald-500/20 bg-emerald-500/5 p-3">
                        <p className="text-xs font-medium text-emerald-400 mb-1">Karar</p>
                        <p className="text-sm">{d.resolution}</p>
                        {d.resolvedBy && <p className="text-[10px] text-muted-foreground mt-1">— {d.resolvedBy.name}, {d.resolvedAt && new Date(d.resolvedAt).toLocaleDateString("tr-TR")}</p>}
                      </div>
                    )}

                    {/* Actions for open disputes */}
                    {isOpen && (
                      <div className="space-y-3">
                        {d.status === "OPEN" && (
                          <button
                            onClick={() => handleInvestigate(d.id)}
                            disabled={isPending}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/20 hover:bg-yellow-500/20 transition-colors disabled:opacity-50"
                          >
                            <Search className="h-3.5 w-3.5" /> İncelemeye Al
                          </button>
                        )}

                        <div>
                          <label className="text-xs font-medium text-muted-foreground block mb-1">Karar Açıklaması</label>
                          <textarea
                            value={resolution}
                            onChange={(e) => setResolution(e.target.value)}
                            placeholder="Uyuşmazlık kararı ve gerekçenizi yazın…"
                            rows={3}
                            className="w-full rounded-md border border-border bg-background p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                          />
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => handleResolve(d.id, "RESOLVED_BRAND")}
                            disabled={isPending || !resolution.trim()}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20 hover:bg-purple-500/20 transition-colors disabled:opacity-50"
                          >
                            Marka Lehine Karar Ver
                          </button>
                          <button
                            onClick={() => handleResolve(d.id, "RESOLVED_FREELANCER")}
                            disabled={isPending || !resolution.trim()}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                          >
                            Freelancer Lehine Karar Ver
                          </button>
                          <button
                            onClick={() => handleResolve(d.id, "CLOSED")}
                            disabled={isPending || !resolution.trim()}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-muted text-muted-foreground ring-1 ring-border hover:bg-muted/80 transition-colors disabled:opacity-50"
                          >
                            Kapat (Geçersiz)
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
