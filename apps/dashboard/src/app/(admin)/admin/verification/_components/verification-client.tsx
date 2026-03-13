"use client";

import { CheckCircle2, Clock, ExternalLink, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { cn } from "ui";

import { updateVerificationStatus } from "@/app/_actions/admin-actions";

interface VerificationItem {
  id: string;
  userName: string;
  userEmail: string;
  userRole: string;
  status: string;
  documentUrl: string | null;
  notes: string | null;
  createdAt: string;
}

const ROLE_COLORS: Record<string, string> = {
  BRAND: "bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20",
  AGENCY: "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20",
  FREELANCER: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20",
  ADMIN: "bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/20",
  APPROVED: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20",
  REJECTED: "bg-red-500/10 text-red-400 ring-1 ring-red-500/20",
};

export function VerificationClient({ verifications }: { verifications: VerificationItem[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("PENDING");

  const filtered = verifications.filter((v) => filter === "ALL" || v.status === filter);

  const handleVerification = (id: string, status: "APPROVED" | "REJECTED") => {
    startTransition(async () => {
      await updateVerificationStatus(id, status);
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        {(["PENDING", "APPROVED", "REJECTED", "ALL"] as const).map((tab) => {
          const count =
            tab === "ALL"
              ? verifications.length
              : verifications.filter((v) => v.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                filter === tab
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {tab === "ALL"
                ? "Tümü"
                : tab === "PENDING"
                  ? "Bekleyen"
                  : tab === "APPROVED"
                    ? "Onaylı"
                    : "Reddedilen"}
              <span className="ml-1.5 text-xs opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Items */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          Bu kategoride başvuru bulunmuyor.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((v) => (
            <div
              key={v.id}
              className={cn(
                "rounded-xl border p-4 transition-colors",
                v.status === "PENDING" ? "border-yellow-500/30 bg-yellow-500/5" : "border-border"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {v.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold">{v.userName}</span>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                          ROLE_COLORS[v.userRole] || ""
                        )}
                      >
                        {v.userRole}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                          STATUS_COLORS[v.status] || ""
                        )}
                      >
                        {v.status === "PENDING"
                          ? "Bekliyor"
                          : v.status === "APPROVED"
                            ? "Onaylı"
                            : "Reddedildi"}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{v.userEmail}</p>
                    {v.notes && (
                      <p className="mt-1.5 rounded-md bg-muted/40 px-2 py-1 text-xs text-muted-foreground">
                        {v.notes}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-3">
                      {v.documentUrl && (
                        <a
                          href={v.documentUrl}
                          target="_blank"
                          rel="noopener"
                          className="flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" /> Belgeyi görüntüle
                        </a>
                      )}
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(v.createdAt).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                {v.status === "PENDING" && (
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => handleVerification(v.id, "APPROVED")}
                      disabled={isPending}
                      className="flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/20 transition-colors hover:bg-emerald-500/20 disabled:opacity-50"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Onayla
                    </button>
                    <button
                      onClick={() => handleVerification(v.id, "REJECTED")}
                      disabled={isPending}
                      className="flex items-center gap-1.5 rounded-md bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 ring-1 ring-red-500/20 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                    >
                      <XCircle className="h-3.5 w-3.5" /> Reddet
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
