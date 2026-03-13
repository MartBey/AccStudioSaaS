import { AlertTriangle, Brain, CheckCircle2, TrendingUp, XCircle, Zap } from "lucide-react";
import { cn } from "ui";

import { getAICostSummary } from "@/app/_actions/admin-actions";

export const dynamic = "force-dynamic";

const ACTION_LABELS: Record<string, string> = {
  AI_JURI: "AI Jüri",
  JOB_DESCRIPTION: "İş Tanımı",
  FREELANCER_MATCH: "Freelancer Eşleştirme",
  CONTENT_GENERATION: "İçerik Üretimi",
};

const ACTION_COLORS: Record<string, string> = {
  AI_JURI: "bg-purple-500/10 text-purple-400 ring-purple-500/20",
  JOB_DESCRIPTION: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
  FREELANCER_MATCH: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  CONTENT_GENERATION: "bg-orange-500/10 text-orange-400 ring-orange-500/20",
};

export default async function AdminAICostsPage() {
  const data = await getAICostSummary();

  if (!data) return null;

  const STAT_CARDS = [
    {
      label: "Toplam AI Harcama",
      value: `$${data.totalCost.toFixed(4)}`,
      sub: `${data.totalTokens.toLocaleString("tr-TR")} token`,
      icon: Brain,
      color: "text-purple-400",
      bg: "bg-purple-500/10 ring-purple-500/20",
    },
    {
      label: "Bu Ay",
      value: `$${data.monthlyCost.toFixed(4)}`,
      sub: `${data.monthlyRequests} istek`,
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 ring-emerald-500/20",
    },
    {
      label: "Toplam İstek",
      value: data.totalRequests,
      sub: `${data.monthlyRequests} bu ay`,
      icon: Zap,
      color: "text-blue-400",
      bg: "bg-blue-500/10 ring-blue-500/20",
    },
    {
      label: "Hata Oranı",
      value: `%${data.errorRate.toFixed(1)}`,
      sub: "başarısız çağrı",
      icon: AlertTriangle,
      color: data.errorRate > 10 ? "text-red-400" : "text-yellow-400",
      bg:
        data.errorRate > 10
          ? "bg-red-500/10 ring-red-500/20"
          : "bg-yellow-500/10 ring-yellow-500/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="mb-1 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-500/10 ring-1 ring-purple-500/20">
            <Brain className="h-4 w-4 text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">AI Maliyet Takibi</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Tüm AI çağrılarının token kullanımı ve maliyet analizi.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map((s) => (
          <div key={s.label} className="rounded-xl border border-border p-4">
            <div
              className={cn(
                "mb-3 inline-flex h-9 w-9 items-center justify-center rounded-md ring-1",
                s.bg
              )}
            >
              <s.icon className={cn("h-4 w-4", s.color)} />
            </div>
            <p className="text-2xl font-bold tabular-nums">{s.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{s.label}</p>
            {s.sub && <p className="mt-0.5 text-[10px] text-muted-foreground/60">{s.sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Action Breakdown */}
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="border-b border-border bg-muted/30 px-4 py-3">
            <h3 className="text-sm font-semibold">Aksiyon Bazlı Dağılım</h3>
          </div>
          {data.actionBreakdown.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Henüz AI kullanım verisi yok.
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {data.actionBreakdown.map((a) => {
                const maxCost = Math.max(...data.actionBreakdown.map((x) => x.cost), 0.0001);
                const widthPercent = (a.cost / maxCost) * 100;
                return (
                  <div key={a.action} className="flex items-center gap-3 px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ring-1",
                        ACTION_COLORS[a.action] || "bg-muted text-muted-foreground ring-border"
                      )}
                    >
                      {ACTION_LABELS[a.action] || a.action}
                    </span>
                    <div className="flex-1">
                      <div className="h-2 overflow-hidden rounded-full bg-muted/50">
                        <div
                          className="h-full rounded-full bg-primary/40 transition-all"
                          style={{ width: `${Math.max(widthPercent, 2)}%` }}
                        />
                      </div>
                    </div>
                    <div className="min-w-[80px] text-right">
                      <p className="text-sm font-semibold tabular-nums">${a.cost.toFixed(4)}</p>
                      <p className="text-[10px] text-muted-foreground">{a.count} istek</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Users */}
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="border-b border-border bg-muted/30 px-4 py-3">
            <h3 className="text-sm font-semibold">En Çok Kullanan Kullanıcılar</h3>
          </div>
          {data.topUsers.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Henüz AI kullanım verisi yok.
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {data.topUsers.map((u, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{u.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {u.requestCount} istek ·{" "}
                      {(u.totalInputTokens + u.totalOutputTokens).toLocaleString("tr-TR")} token
                    </p>
                  </div>
                  <p className="text-sm font-semibold tabular-nums">${u.totalCost.toFixed(4)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent AI Calls */}
      <div className="overflow-hidden rounded-xl border border-border">
        <div className="border-b border-border bg-muted/30 px-4 py-3">
          <h3 className="text-sm font-semibold">Son AI Çağrıları</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                  Kullanıcı
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                  Aksiyon
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                  Model
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                  Token
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                  Maliyet
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                  Süre
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                  Durum
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                  Tarih
                </th>
              </tr>
            </thead>
            <tbody>
              {data.recentLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    Henüz AI çağrı kaydı yok.
                  </td>
                </tr>
              ) : (
                data.recentLogs.map((l) => (
                  <tr
                    key={l.id}
                    className="border-b border-border/50 transition-colors hover:bg-muted/20"
                  >
                    <td className="px-4 py-2.5 text-sm font-medium">{l.userName}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ring-1",
                          ACTION_COLORS[l.action] || "bg-muted text-muted-foreground ring-border"
                        )}
                      >
                        {ACTION_LABELS[l.action] || l.action}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                      {l.model}
                    </td>
                    <td className="px-4 py-2.5 text-sm tabular-nums">
                      {l.totalTokens.toLocaleString("tr-TR")}
                    </td>
                    <td className="px-4 py-2.5 text-sm font-semibold tabular-nums">
                      ${l.cost.toFixed(6)}
                    </td>
                    <td className="px-4 py-2.5 text-xs tabular-nums text-muted-foreground">
                      {l.durationMs ? `${(l.durationMs / 1000).toFixed(1)}s` : "—"}
                    </td>
                    <td className="px-4 py-2.5">
                      {l.success ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-400" />
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">
                      {new Date(l.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
