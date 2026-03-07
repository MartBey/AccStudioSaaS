"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "ui";
import {
  Mail, Calendar, MapPin, Globe,
  ShieldCheck, TrendingUp, TrendingDown,
  Briefcase, FileText, Clock,
  ChevronDown,
} from "lucide-react";
import { changeUserRole } from "@/app/_actions/admin-actions";

// ---- types ----
interface RecentLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: string;
}

interface AdminUserDetail {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: string;
  bio: string | null;
  location: string | null;
  website: string | null;
  brand: { companyName: string; industry: string | null } | null;
  agency: { agencyName: string; teamSize: number } | null;
  freelancer: {
    id: string;
    title: string | null;
    hourlyRate: number | null;
    recentProposals: { id: string; status: string; amount: number }[];
    recentTasks: { id: string; title: string; status: string; earning: number | null }[];
  } | null;
  verification: { status: string; documentUrl: string | null; createdAt: string } | null;
  skills: string[];
  recentLogs: RecentLog[];
  totalPaid: number;
  totalReceived: number;
}

// ---- helpers ----
const ROLE_COLORS: Record<string, string> = {
  BRAND: "bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20",
  AGENCY: "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20",
  FREELANCER: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20",
  ADMIN: "bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20",
};

const ACTION_COLORS: Record<string, string> = {
  CREATE: "bg-emerald-500/10 text-emerald-400",
  DELETE: "bg-red-500/10 text-red-400",
  UPDATE: "bg-blue-500/10 text-blue-400",
  ADMIN: "bg-orange-500/10 text-orange-400",
};

function getActionColor(action: string) {
  const prefix = Object.keys(ACTION_COLORS).find((k) => action.startsWith(k));
  return prefix ? ACTION_COLORS[prefix] : "bg-muted text-muted-foreground";
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

// ---- main component ----
export function UserDetailClient({ user }: { user: AdminUserDetail }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const handleRoleChange = (newRole: "BRAND" | "AGENCY" | "FREELANCER") => {
    setShowRoleMenu(false);
    startTransition(async () => {
      await changeUserRole(user.id, newRole);
      router.refresh();
    });
  };

  const display = user.brand?.companyName || user.agency?.agencyName || user.freelancer?.title || "—";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-border p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary ring-2 ring-primary/20">
              {(user.name || "?").charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold">{user.name || "İsimsiz"}</h1>
                <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", ROLE_COLORS[user.role] || "")}>
                  {user.role}
                </span>
                {user.verification && (
                  <span className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                    user.verification.status === "APPROVED"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : user.verification.status === "PENDING"
                      ? "bg-yellow-500/10 text-yellow-400"
                      : "bg-red-500/10 text-red-400"
                  )}>
                    <ShieldCheck className="h-3 w-3" />
                    {user.verification.status === "APPROVED" ? "Doğrulandı" : user.verification.status === "PENDING" ? "Beklemede" : "Reddedildi"}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{user.email}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(user.createdAt).toLocaleDateString("tr-TR")}</span>
                {user.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{user.location}</span>}
                {user.website && (
                  <a href={user.website} target="_blank" rel="noopener" className="flex items-center gap-1 text-primary hover:underline">
                    <Globe className="h-3.5 w-3.5" />{user.website}
                  </a>
                )}
              </div>
              {display !== "—" && (
                <p className="text-xs text-muted-foreground mt-0.5">{display}</p>
              )}
            </div>
          </div>

          {/* Rol Değiştir */}
          {user.role !== "ADMIN" && (
            <div className="relative shrink-0">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                disabled={isPending}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
              >
                Rol Değiştir <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {showRoleMenu && (
                <div className="absolute right-0 top-full mt-1 z-10 rounded-md border border-border bg-popover shadow-md overflow-hidden min-w-[120px]">
                  {(["BRAND", "AGENCY", "FREELANCER"] as const)
                    .filter((r) => r !== user.role)
                    .map((role) => (
                      <button
                        key={role}
                        onClick={() => handleRoleChange(role)}
                        className="flex w-full items-center px-3 py-2 text-xs hover:bg-muted transition-colors"
                      >
                        {role}
                      </button>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="mt-3 text-sm text-muted-foreground border-t border-border pt-3">{user.bio}</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span className="text-xs">Toplam Ödedi</span>
          </div>
          <p className="text-xl font-bold">₺{user.totalPaid.toLocaleString("tr-TR")}</p>
        </div>
        <div className="rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <TrendingDown className="h-4 w-4 text-blue-400" />
            <span className="text-xs">Toplam Aldı</span>
          </div>
          <p className="text-xl font-bold">₺{user.totalReceived.toLocaleString("tr-TR")}</p>
        </div>
        <div className="rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Briefcase className="h-4 w-4 text-purple-400" />
            <span className="text-xs">Teklif Sayısı</span>
          </div>
          <p className="text-xl font-bold">{user.freelancer?.recentProposals.length ?? "—"}</p>
        </div>
        <div className="rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <FileText className="h-4 w-4 text-orange-400" />
            <span className="text-xs">Son Log</span>
          </div>
          <p className="text-xl font-bold">{user.recentLogs.length}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Skills */}
        {user.skills.length > 0 && (
          <Section title="Yetenekler">
            <div className="flex flex-wrap gap-1.5">
              {user.skills.map((s) => (
                <span key={s} className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">{s}</span>
              ))}
            </div>
          </Section>
        )}

        {/* Recent proposals (freelancer only) */}
        {user.freelancer?.recentProposals && user.freelancer.recentProposals.length > 0 && (
          <Section title="Son Teklifler">
            <div className="space-y-2">
              {user.freelancer.recentProposals.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium",
                    p.status === "ACCEPTED" ? "bg-emerald-500/10 text-emerald-400" :
                    p.status === "REJECTED" ? "bg-red-500/10 text-red-400" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {p.status}
                  </span>
                  <span className="font-medium">₺{p.amount.toLocaleString("tr-TR")}</span>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>

      {/* Recent Audit Logs */}
      <Section title={`Son Aktiviteler (${user.recentLogs.length})`}>
        {user.recentLogs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Aktivite bulunamadı.</p>
        ) : (
          <div className="space-y-1">
            {user.recentLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between py-1.5 border-b border-border/40 last:border-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium shrink-0", getActionColor(log.action))}>
                    {log.action}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {log.entityType} <span className="font-mono opacity-50">#{log.entityId.slice(0, 8)}</span>
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(log.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                </span>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
