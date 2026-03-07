import { getAdminStats } from "@/app/_actions/admin-actions";
import { Users, Briefcase, FileText, TrendingUp, ShieldCheck, ActivitySquare } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const stats = await getAdminStats();

  if (!stats) return null;

  const STAT_CARDS = [
    {
      label: "Toplam Kullanıcı",
      value: stats.userCount,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10 ring-blue-500/20",
    },
    {
      label: "Toplam Proje",
      value: stats.projectCount,
      icon: Briefcase,
      color: "text-purple-400",
      bg: "bg-purple-500/10 ring-purple-500/20",
    },
    {
      label: "Toplam Görev",
      value: stats.taskCount,
      icon: FileText,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 ring-emerald-500/20",
    },
    {
      label: "Toplam Gelir",
      value: `₺${stats.totalRevenue.toLocaleString("tr-TR")}`,
      icon: TrendingUp,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10 ring-yellow-500/20",
    },
    {
      label: "Bekleyen Doğrulama",
      value: stats.pendingVerifications,
      icon: ShieldCheck,
      color: "text-orange-400",
      bg: "bg-orange-500/10 ring-orange-500/20",
      href: "/admin/verification",
      alert: stats.pendingVerifications > 0,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Genel Bakış</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Platformun anlık durumu
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {STAT_CARDS.map((s) => (
          <div
            key={s.label}
            className={`relative rounded-xl border p-4 transition-all hover:shadow-sm ${s.alert ? "border-orange-400/40" : "border-border"}`}
          >
            {s.alert && (
              <span className="absolute -top-1.5 -right-1.5 h-3 w-3 rounded-full bg-orange-400 ring-2 ring-background animate-pulse" />
            )}
            <div className={`inline-flex h-9 w-9 items-center justify-center rounded-md ring-1 mb-3 ${s.bg}`}>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold tabular-nums">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            {s.href && (
              <Link href={s.href} className="absolute inset-0 rounded-xl" aria-label={s.label} />
            )}
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/admin/logs"
          className="group rounded-xl border border-border p-5 hover:border-primary/40 hover:bg-primary/5 transition-all"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 ring-1 ring-primary/20 group-hover:bg-primary/20 transition-colors">
              <ActivitySquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">Aktivite Akışı</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Platformdaki tüm olayları filtreli şekilde izle
              </p>
            </div>
          </div>
        </Link>
        <Link
          href="/admin/verification"
          className="group rounded-xl border border-border p-5 hover:border-primary/40 hover:bg-primary/5 transition-all"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-orange-500/10 ring-1 ring-orange-500/20 group-hover:bg-orange-500/20 transition-colors">
              <ShieldCheck className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">Doğrulama Talepleri</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {stats.pendingVerifications > 0
                  ? `${stats.pendingVerifications} bekleyen talep var`
                  : "Bekleyen talep yok"}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
