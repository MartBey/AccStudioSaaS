import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Clock,
  DollarSign,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { cn } from "ui";

import { getFinanceOverview } from "@/app/_actions/finance-actions";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  PAID: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20",
  PENDING: "bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/20",
  CANCELLED: "bg-red-500/10 text-red-400 ring-1 ring-red-500/20",
  REFUNDED: "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20",
};

export default async function AdminFinancePage() {
  const data = await getFinanceOverview();

  if (!data) return null;

  const maxMonthly = Math.max(...data.monthlyData.map((m) => m.amount), 1);

  const STAT_CARDS = [
    {
      label: "Toplam GMV",
      value: `₺${data.totalGMV.toLocaleString("tr-TR")}`,
      icon: DollarSign,
      color: "text-primary",
      bg: "bg-primary/10 ring-primary/20",
      sub: `${data.paymentCount} işlem`,
    },
    {
      label: "Ödenen",
      value: `₺${data.totalPaid.toLocaleString("tr-TR")}`,
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 ring-emerald-500/20",
      sub: `${data.paidCount} ödeme`,
    },
    {
      label: "Bekleyen",
      value: `₺${data.totalPending.toLocaleString("tr-TR")}`,
      icon: Clock,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10 ring-yellow-500/20",
      sub: `${data.pendingCount} işlem`,
    },
    {
      label: "İptal/İade",
      value: `₺${data.totalCancelled.toLocaleString("tr-TR")}`,
      icon: XCircle,
      color: "text-red-400",
      bg: "bg-red-500/10 ring-red-500/20",
      sub: "",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="mb-1 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500/10 ring-1 ring-emerald-500/20">
            <BarChart3 className="h-4 w-4 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Finansal İzleme</h1>
        </div>
        <p className="text-sm text-muted-foreground">Platform geliri ve ödeme akışları.</p>
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

      {/* Monthly Revenue Chart */}
      <div className="rounded-xl border border-border p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Aylık Gelir (Son 12 Ay)</h3>
          <p className="text-xs text-muted-foreground">₺ bazlı ödenen tutar</p>
        </div>
        <div className="flex h-48 items-end gap-2">
          {data.monthlyData.map((m, i) => {
            const heightPercent = maxMonthly > 0 ? (m.amount / maxMonthly) * 100 : 0;
            return (
              <div key={i} className="group flex flex-1 flex-col items-center gap-1">
                <div
                  className="relative flex w-full flex-col items-center"
                  style={{ height: "176px" }}
                >
                  {/* Tooltip */}
                  <div className="absolute -top-6 z-10 whitespace-nowrap rounded bg-foreground px-1.5 py-0.5 text-[10px] font-medium text-background opacity-0 transition-opacity group-hover:opacity-100">
                    ₺{m.amount.toLocaleString("tr-TR")}
                  </div>
                  {/* Bar */}
                  <div
                    className="mt-auto w-full max-w-[40px] rounded-t-md bg-primary/20 transition-colors hover:bg-primary/40"
                    style={{ height: `${Math.max(heightPercent, 2)}%` }}
                  />
                </div>
                <span className="max-w-full truncate text-[9px] text-muted-foreground">
                  {m.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Payments Table */}
      <div className="overflow-hidden rounded-xl border border-border">
        <div className="border-b border-border bg-muted/30 px-4 py-3">
          <h3 className="text-sm font-semibold">Son Ödemeler</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                  Proje
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                  Ödeyen
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                  Alan
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                  Tutar
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
              {data.recentPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    Henüz ödeme kaydı yok.
                  </td>
                </tr>
              ) : (
                data.recentPayments.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-border/50 transition-colors hover:bg-muted/20"
                  >
                    <td className="px-4 py-2.5 text-sm font-medium">{p.project}</td>
                    <td className="px-4 py-2.5 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ArrowUpRight className="h-3 w-3 text-red-400" />
                        {p.payer}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ArrowDownRight className="h-3 w-3 text-emerald-400" />
                        {p.payee}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-sm font-semibold tabular-nums">
                      ₺{p.amount.toLocaleString("tr-TR")}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium",
                          STATUS_COLORS[p.status] || ""
                        )}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">
                      {new Date(p.createdAt).toLocaleDateString("tr-TR")}
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
