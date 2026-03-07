import { getFinanceOverview } from "@/app/_actions/finance-actions";
import {
  BarChart3, TrendingUp, Clock, XCircle,
  DollarSign, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { cn } from "ui";

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
    { label: "Toplam GMV", value: `₺${data.totalGMV.toLocaleString("tr-TR")}`, icon: DollarSign, color: "text-primary", bg: "bg-primary/10 ring-primary/20", sub: `${data.paymentCount} işlem` },
    { label: "Ödenen", value: `₺${data.totalPaid.toLocaleString("tr-TR")}`, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10 ring-emerald-500/20", sub: `${data.paidCount} ödeme` },
    { label: "Bekleyen", value: `₺${data.totalPending.toLocaleString("tr-TR")}`, icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10 ring-yellow-500/20", sub: `${data.pendingCount} işlem` },
    { label: "İptal/İade", value: `₺${data.totalCancelled.toLocaleString("tr-TR")}`, icon: XCircle, color: "text-red-400", bg: "bg-red-500/10 ring-red-500/20", sub: "" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5 mb-1">
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
            <div className={cn("inline-flex h-9 w-9 items-center justify-center rounded-md ring-1 mb-3", s.bg)}>
              <s.icon className={cn("h-4 w-4", s.color)} />
            </div>
            <p className="text-2xl font-bold tabular-nums">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            {s.sub && <p className="text-[10px] text-muted-foreground/60 mt-0.5">{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* Monthly Revenue Chart */}
      <div className="rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Aylık Gelir (Son 12 Ay)</h3>
          <p className="text-xs text-muted-foreground">₺ bazlı ödenen tutar</p>
        </div>
        <div className="flex items-end gap-2 h-48">
          {data.monthlyData.map((m, i) => {
            const heightPercent = maxMonthly > 0 ? (m.amount / maxMonthly) * 100 : 0;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="relative w-full flex flex-col items-center" style={{ height: "176px" }}>
                  {/* Tooltip */}
                  <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-medium bg-foreground text-background rounded px-1.5 py-0.5 whitespace-nowrap z-10">
                    ₺{m.amount.toLocaleString("tr-TR")}
                  </div>
                  {/* Bar */}
                  <div
                    className="w-full max-w-[40px] rounded-t-md bg-primary/20 hover:bg-primary/40 transition-colors mt-auto"
                    style={{ height: `${Math.max(heightPercent, 2)}%` }}
                  />
                </div>
                <span className="text-[9px] text-muted-foreground truncate max-w-full">{m.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Payments Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <h3 className="text-sm font-semibold">Son Ödemeler</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Proje</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Ödeyen</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Alan</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Tutar</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Durum</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Tarih</th>
              </tr>
            </thead>
            <tbody>
              {data.recentPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground text-sm">
                    Henüz ödeme kaydı yok.
                  </td>
                </tr>
              ) : (
                data.recentPayments.map((p) => (
                  <tr key={p.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-2.5 text-sm font-medium">{p.project}</td>
                    <td className="px-4 py-2.5 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><ArrowUpRight className="h-3 w-3 text-red-400" />{p.payer}</span>
                    </td>
                    <td className="px-4 py-2.5 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><ArrowDownRight className="h-3 w-3 text-emerald-400" />{p.payee}</span>
                    </td>
                    <td className="px-4 py-2.5 text-sm font-semibold tabular-nums">₺{p.amount.toLocaleString("tr-TR")}</td>
                    <td className="px-4 py-2.5">
                      <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium", STATUS_COLORS[p.status] || "")}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString("tr-TR")}</td>
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
