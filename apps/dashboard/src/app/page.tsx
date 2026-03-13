"use client";

import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Globe,
  Shield,
  Sparkles,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge, Button, Card } from "ui";

export default function LandingPage() {
  const router = useRouter();

  const features = [
    {
      icon: <Shield className="h-6 w-6 text-blue-500" />,
      title: "Güvenilir Platform",
      description: "Doğrulanmış freelancer ve ajanslarla çalışın. Şeffaflık garantisi.",
    },
    {
      icon: <Users className="h-6 w-6 text-emerald-500" />,
      title: "3'lü Ekosistem",
      description: "Markalar, ajanslar ve freelancer'lar tek platformda buluşuyor.",
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-purple-500" />,
      title: "Akıllı Analitik",
      description: "Proje ilerlemesi, bütçe takibi ve ROI analizleri gerçek zamanlı.",
    },
    {
      icon: <Zap className="h-6 w-6 text-amber-500" />,
      title: "Hızlı İş Akışı",
      description: "İlan yayınla, teklif al, proje yönet — hepsi dakikalar içinde.",
    },
  ];

  const stats = [
    { value: "3", label: "Rol Paneli", icon: <Building2 className="h-5 w-5" /> },
    { value: "15+", label: "Modül", icon: <Sparkles className="h-5 w-5" /> },
    { value: "∞", label: "Proje Kapasitesi", icon: <Globe className="h-5 w-5" /> },
    { value: "✓", label: "Doğrulama Sistemi", icon: <UserCheck className="h-5 w-5" /> },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="bg-grid-pattern absolute inset-0 opacity-5"></div>
        <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-20 text-center">
          <Badge className="mb-6 border-primary/20 bg-primary/10 px-4 py-1.5 text-primary hover:bg-primary/15">
            🚀 AccStudio Platform v1.0
          </Badge>

          <h1 className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text pb-2 text-5xl font-extrabold tracking-tight text-transparent md:text-7xl">
            Dijital Hizmetlerin
            <br />
            Yeni Merkezi
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Markalar, ajanslar ve freelancer'ları bir araya getiren
            <strong className="text-foreground"> şeffaf</strong> ve
            <strong className="text-foreground"> güvenilir</strong> iş platformu. Haksız rekabetle
            mücadele, doğrulanmış profesyonellerle çalışma garantisi.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register">
              <Button
                size="lg"
                className="h-12 gap-2 px-8 text-base shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
              >
                Hemen Başla <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-12 gap-2 px-8 text-base">
                Giriş Yap
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto -mt-4 max-w-5xl px-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat, i) => (
            <Card
              key={i}
              className="bg-card/80 py-6 text-center backdrop-blur-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-2 flex justify-center text-muted-foreground">{stat.icon}</div>
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Neden <span className="text-primary">AccStudio</span>?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-muted-foreground">
            Sektördeki şeffaflık sorununu çözen, profesyonelleri doğrulayan platform.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Card
              key={i}
              className="group bg-card/80 p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted transition-transform group-hover:scale-110">
                {f.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Her Rol İçin Özel Panel</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              title: "Marka",
              desc: "Proje oluştur, ilan yayınla, teklifleri değerlendir. SEO ve AI araçlarıyla büyü.",
              href: "/login",
              color: "from-blue-500/20 to-blue-600/5",
              icon: "🏢",
            },
            {
              title: "Ajans",
              desc: "Ekibini yönet, freelancer keşfet, müşteri projelerini takip et.",
              href: "/login",
              color: "from-emerald-500/20 to-emerald-600/5",
              icon: "🏗️",
            },
            {
              title: "Freelancer",
              desc: "İş ilanlarına başvur, görevlerini yönet, portföyünü oluştur.",
              href: "/login",
              color: "from-purple-500/20 to-purple-600/5",
              icon: "💻",
            },
          ].map((role, i) => (
            <Card
              key={i}
              className={`bg-gradient-to-br ${role.color} p-6 transition-all hover:shadow-lg`}
            >
              <span className="text-4xl">{role.icon}</span>
              <h3 className="mt-3 text-xl font-bold">{role.title} Paneli</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{role.desc}</p>
              <Link href={role.href}>
                <Button variant="outline" size="sm" className="mt-4 gap-1">
                  Keşfet <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Hemen Ücretsiz Kaydolun</h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Platformun tüm özelliklerinden faydalanmak için hemen hesap oluşturun.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/register">
              <Button size="lg" className="h-12 gap-2 px-8 shadow-lg">
                Ücretsiz Kaydol <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Ücretsiz başlangıç
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Kredi kartı gerekmez
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Anında erişim
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between px-6 text-sm text-muted-foreground md:flex-row">
          <span className="font-semibold text-foreground">AccStudio © 2026</span>
          <span>Dijital hizmet profesyonellerinin güvenilir platformu</span>
        </div>
      </footer>
    </main>
  );
}
