'use client';

import { Button, Card, Badge } from "ui";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowRight, Shield, Users, BarChart3, Zap, 
  CheckCircle2, Globe, Sparkles, Building2, UserCheck 
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  const features = [
    {
      icon: <Shield className="h-6 w-6 text-blue-500" />,
      title: "Güvenilir Platform",
      description: "Doğrulanmış freelancer ve ajanslarla çalışın. Şeffaflık garantisi."
    },
    {
      icon: <Users className="h-6 w-6 text-emerald-500" />,
      title: "3'lü Ekosistem",
      description: "Markalar, ajanslar ve freelancer'lar tek platformda buluşuyor."
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-purple-500" />,
      title: "Akıllı Analitik",
      description: "Proje ilerlemesi, bütçe takibi ve ROI analizleri gerçek zamanlı."
    },
    {
      icon: <Zap className="h-6 w-6 text-amber-500" />,
      title: "Hızlı İş Akışı",
      description: "İlan yayınla, teklif al, proje yönet — hepsi dakikalar içinde."
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
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center relative">
          <Badge className="mb-6 px-4 py-1.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
            🚀 AccStudio Platform v1.0
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent pb-2">
            Dijital Hizmetlerin
            <br />
            Yeni Merkezi
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Markalar, ajanslar ve freelancer'ları bir araya getiren 
            <strong className="text-foreground"> şeffaf</strong> ve 
            <strong className="text-foreground"> güvenilir</strong> iş platformu.
            Haksız rekabetle mücadele, doğrulanmış profesyonellerle çalışma garantisi.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="gap-2 text-base px-8 h-12 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                Hemen Başla <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="gap-2 text-base px-8 h-12">
                Giriş Yap
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-6 -mt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="text-center py-6 bg-card/80 backdrop-blur-sm hover:shadow-md transition-shadow">
              <div className="text-muted-foreground flex justify-center mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Neden <span className="text-primary">AccStudio</span>?
          </h2>
          <p className="mt-3 text-muted-foreground text-lg max-w-xl mx-auto">
            Sektördeki şeffaflık sorununu çözen, profesyonelleri doğrulayan platform.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <Card key={i} className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 bg-card/80 backdrop-blur-sm group">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="font-semibold text-lg mt-4">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight">Her Rol İçin Özel Panel</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Marka", desc: "Proje oluştur, ilan yayınla, teklifleri değerlendir. SEO ve AI araçlarıyla büyü.", href: "/login", color: "from-blue-500/20 to-blue-600/5", icon: "🏢" },
            { title: "Ajans", desc: "Ekibini yönet, freelancer keşfet, müşteri projelerini takip et.", href: "/login", color: "from-emerald-500/20 to-emerald-600/5", icon: "🏗️" },
            { title: "Freelancer", desc: "İş ilanlarına başvur, görevlerini yönet, portföyünü oluştur.", href: "/login", color: "from-purple-500/20 to-purple-600/5", icon: "💻" },
          ].map((role, i) => (
            <Card key={i} className={`bg-gradient-to-br ${role.color} p-6 hover:shadow-lg transition-all`}>
              <span className="text-4xl">{role.icon}</span>
              <h3 className="font-bold text-xl mt-3">{role.title} Paneli</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{role.desc}</p>
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
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Hemen Ücretsiz Kaydolun
          </h2>
          <p className="mt-3 text-muted-foreground text-lg">
            Platformun tüm özelliklerinden faydalanmak için hemen hesap oluşturun.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/register">
              <Button size="lg" className="gap-2 px-8 h-12 shadow-lg">
                Ücretsiz Kaydol <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Ücretsiz başlangıç</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Kredi kartı gerekmez</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Anında erişim</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">AccStudio © 2026</span>
          <span>Dijital hizmet profesyonellerinin güvenilir platformu</span>
        </div>
      </footer>
    </main>
  );
}
