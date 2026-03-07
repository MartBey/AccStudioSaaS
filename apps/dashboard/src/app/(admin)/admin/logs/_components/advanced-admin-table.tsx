"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "ui";
import {
  Search,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  Tag,
  ArrowUpDown,
} from "lucide-react";
import { getAuditLogs } from "@/app/_actions/admin-actions";

// ---- types ----
interface LogUser {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
}

interface AuditLogRow {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string | null;
  createdAt: string;
  user: LogUser | null;
}

interface Props {
  initialLogs: AuditLogRow[];
  totalCount: number;
  pageSize: number;
}

// ---- helpers ----
const ENTITY_TYPES = [
  "Tüm Entityler",
  "Proposal",
  "Project",
  "Task",
  "Verification",
  "User",
  "Payment",
];

function getActionBadgeStyle(action: string) {
  if (action.startsWith("CREATE") || action.includes("SUBMIT"))
    return "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20";
  if (action.startsWith("DELETE") || action.includes("CANCEL") || action.includes("REJECTED"))
    return "bg-red-500/10 text-red-400 ring-1 ring-red-500/20";
  if (action.startsWith("UPDATE") || action.includes("APPROVED") || action.includes("ACCEPT"))
    return "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20";
  if (action.includes("LOGIN") || action.includes("AUTH"))
    return "bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/20";
  return "bg-muted text-muted-foreground ring-1 ring-border";
}

function getRoleBadge(role: string) {
  const map: Record<string, string> = {
    BRAND: "bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20",
    AGENCY: "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20",
    FREELANCER: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20",
    ADMIN: "bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20",
  };
  return map[role] || "bg-muted text-muted-foreground";
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ---- component ----
export function AdvancedAdminTable({ initialLogs, totalCount, pageSize }: Props) {
  const router = useRouter();
  const [logs, setLogs] = useState<AuditLogRow[]>(initialLogs);
  const [total, setTotal] = useState(totalCount);
  const [isPending, startTransition] = useTransition();

  const [searchAction, setSearchAction] = useState("");
  const [entityTypeFilter, setEntityTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const totalPages = Math.ceil(total / pageSize);

  const fetchLogs = useCallback(
    (newPage: number, action: string, entityType: string) => {
      startTransition(async () => {
        const result = await getAuditLogs({
          action: action || undefined,
          entityType: entityType && entityType !== "Tüm Entityler" ? entityType : undefined,
          page: newPage,
          take: pageSize,
        });
        setLogs(result.logs as AuditLogRow[]);
        setTotal(result.total);
        setPage(newPage);
      });
    },
    [pageSize]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs(1, searchAction, entityTypeFilter);
  };

  const handleReset = () => {
    setSearchAction("");
    setEntityTypeFilter("");
    fetchLogs(1, "", "");
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <form onSubmit={handleSearch} className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Aksiyon ara… (örn. CREATE_PROPOSAL)"
            value={searchAction}
            onChange={(e) => setSearchAction(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <select
            value={entityTypeFilter}
            onChange={(e) => setEntityTypeFilter(e.target.value)}
            className="pl-9 pr-6 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 appearance-none"
          >
            {ENTITY_TYPES.map((t) => (
              <option key={t} value={t === "Tüm Entityler" ? "" : t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
        >
          Filtrele
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="p-2 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Sıfırla"
        >
          <RefreshCw className={cn("h-4 w-4", isPending && "animate-spin")} />
        </button>

        <span className="ml-auto text-xs text-muted-foreground">
          {total} kayıt bulundu
        </span>
      </form>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" /> Aksiyon</span>
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Entity</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> Kullanıcı</span>
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Tarih</span>
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Detay</th>
              </tr>
            </thead>
            <tbody>
              {isPending ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/50 animate-pulse">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-muted rounded w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-muted-foreground text-sm">
                    Kayıt bulunamadı.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <>
                    <tr
                      key={log.id}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => setExpandedRow(expandedRow === log.id ? null : log.id)}
                    >
                      <td className="px-4 py-3">
                        <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", getActionBadgeStyle(log.action))}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        <span className="font-medium text-foreground/80">{log.entityType}</span>
                        <span className="text-xs text-muted-foreground ml-1.5 font-mono">
                          #{log.entityId.slice(0, 8)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {log.user ? (
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                              {(log.user.name || "?").charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-medium truncate">{log.user.name || "İsimsiz"}</p>
                              <span className={cn("inline-flex items-center rounded-full px-1.5 py-0 text-[10px] font-medium", getRoleBadge(log.user.role))}>
                                {log.user.role}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Sistem</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {formatTime(log.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        {log.details ? (
                          <ArrowUpDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", expandedRow === log.id && "rotate-180")} />
                        ) : (
                          <span className="text-muted-foreground/40 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                    {expandedRow === log.id && log.details && (
                      <tr key={`${log.id}-detail`} className="border-b border-border/50 bg-muted/20">
                        <td colSpan={5} className="px-4 py-3">
                          <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono bg-background/50 rounded-md p-3 border border-border/50 max-h-40 overflow-auto">
                            {(() => {
                              try { return JSON.stringify(JSON.parse(log.details), null, 2); }
                              catch { return log.details; }
                            })()}
                          </pre>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Sayfa {page} / {totalPages || 1}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchLogs(page - 1, searchAction, entityTypeFilter)}
            disabled={page <= 1 || isPending}
            className="p-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => fetchLogs(pageNum, searchAction, entityTypeFilter)}
                disabled={isPending}
                className={cn(
                  "h-7 w-7 text-xs rounded-md border transition-colors",
                  page === pageNum
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => fetchLogs(page + 1, searchAction, entityTypeFilter)}
            disabled={page >= totalPages || isPending}
            className="p-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
