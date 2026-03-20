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

export default function LandingPage() {
  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Güvenilir Platform",
      description: "Doğrulanmış freelancer ve ajanslarla çalışın. Şeffaflık garantisi.",
      accent: "var(--primary)",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "3'lü Ekosistem",
      description: "Markalar, ajanslar ve freelancer'lar tek platformda buluşuyor.",
      accent: "var(--secondary)",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Akıllı Analitik",
      description: "Proje ilerlemesi, bütçe takibi ve ROI analizleri gerçek zamanlı.",
      accent: "var(--primary)",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Hızlı İş Akışı",
      description: "İlan yayınla, teklif al, proje yönet — hepsi dakikalar içinde.",
      accent: "var(--tertiary)",
    },
  ];

  const stats = [
    { value: "3", label: "Rol Paneli", icon: <Building2 className="h-5 w-5" /> },
    { value: "15+", label: "Modül", icon: <Sparkles className="h-5 w-5" /> },
    { value: "∞", label: "Proje Kapasitesi", icon: <Globe className="h-5 w-5" /> },
    { value: "✓", label: "Doğrulama Sistemi", icon: <UserCheck className="h-5 w-5" /> },
  ];

  const roles = [
    {
      title: "Marka",
      desc: "Proje oluştur, ilan yayınla, teklifleri değerlendir. SEO ve AI araçlarıyla büyü.",
      href: "/login",
      icon: "🏢",
      accentVar: "--primary",
    },
    {
      title: "Ajans",
      desc: "Ekibini yönet, freelancer keşfet, müşteri projelerini takip et.",
      href: "/login",
      icon: "🏗️",
      accentVar: "--secondary",
    },
    {
      title: "Freelancer",
      desc: "İş ilanlarına başvur, görevlerini yönet, portföyünü oluştur.",
      href: "/login",
      icon: "💻",
      accentVar: "--tertiary",
    },
  ];

  return (
    // Base layer: surface (#0e0e0e)
    <main className="min-h-screen surface" style={{ fontFamily: "Inter, sans-serif" }}>

      {/* ── NAV BAR ── */}
      <nav
        className="glass sticky top-0 z-30 flex items-center justify-between px-8 py-4"
        style={{ borderBottom: "1px solid hsl(var(--outline-variant) / 0.15)" }}
      >
        <span
          className="font-manrope text-2xl font-extrabold tracking-tight"
          style={{ color: "hsl(var(--primary))" }}
        >
          AccStudio
        </span>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <button
              className="rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:brightness-125"
              style={{ color: "hsl(var(--on-surface-variant))" }}
            >
              Giriş Yap
            </button>
          </Link>
          <Link href="/register">
            <button
              className="gradient-primary rounded-lg px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:brightness-125"
            >
              Ücretsiz Başla
            </button>
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden px-6 pb-20 pt-28 text-center md:pb-28 md:pt-36">
        {/* Ambient glow blobs */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full opacity-10 blur-[120px]"
          style={{ background: "hsl(var(--primary))" }}
        />
        <div
          className="pointer-events-none absolute -left-32 top-40 h-72 w-72 rounded-full opacity-8 blur-[100px]"
          style={{ background: "hsl(var(--secondary))" }}
        />

        {/* Badge */}
        <div className="relative mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold"
          style={{
            background: "hsl(var(--primary-container))",
            color: "hsl(var(--primary))",
            border: "1px solid hsl(var(--primary) / 0.25)",
          }}
        >
          <Sparkles className="h-3.5 w-3.5" />
          AccStudio Platform v1.0
        </div>

        {/* Display Headline — Manrope 3.5rem */}
        <h1
          className="display-lg relative mx-auto mb-6 max-w-4xl"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, hsl(var(--primary)) 60%, hsl(var(--secondary)) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Dijital Hizmetlerin
          <br />
          Komuta Merkezi
        </h1>

        {/* Body text — on-surface-variant (#adaaaa) for dark comfort */}
        <p
          className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed"
          style={{ color: "hsl(var(--on-surface-variant))" }}
        >
          Markalar, ajanslar ve freelancer&apos;ları bir araya getiren{" "}
          <span className="font-semibold text-white">şeffaf</span> ve{" "}
          <span className="font-semibold text-white">güvenilir</span> iş platformu.
          Haksız rekabetle mücadele, doğrulanmış profesyonellerle çalışma garantisi.
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/register">
            <button
              className="gradient-primary flex items-center gap-2 rounded-lg px-8 py-3.5 text-base font-bold text-white shadow-ambient transition-all duration-200 hover:brightness-125"
              style={{ boxShadow: "0 0 32px hsl(var(--primary) / 0.25)" }}
            >
              Hemen Başla <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
          <Link href="/login">
            <button
              className="flex items-center gap-2 rounded-lg px-8 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:brightness-125"
              style={{
                border: "1px solid hsl(var(--outline-variant) / 0.30)",
                background: "hsl(var(--surface-high))",
              }}
            >
              Giriş Yap
            </button>
          </Link>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="rounded-xl p-6 text-center transition-all duration-200 hover:brightness-110"
              style={{
                background: "hsl(var(--surface-container))",
                // No divider lines — surface shift only
              }}
            >
              <div className="mb-3 flex justify-center" style={{ color: "hsl(var(--secondary))" }}>
                {stat.icon}
              </div>
              <div
                className="font-manrope mb-1 text-3xl font-extrabold"
                style={{ color: "hsl(var(--primary))" }}
              >
                {stat.value}
              </div>
              <div className="label-md" style={{ color: "hsl(var(--on-surface-variant))" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        {/* Editorial header — 2.5rem gap before body (no divider line) */}
        <div className="mb-16 text-center">
          <h2
            className="headline-md mb-10"
            style={{ color: "white" }}
          >
            Neden{" "}
            <span style={{ color: "hsl(var(--primary))" }}>AccStudio</span>?
          </h2>
          <p
            className="mx-auto max-w-xl text-base leading-relaxed"
            style={{ color: "hsl(var(--on-surface-variant))" }}
          >
            Sektördeki şeffaflık sorununu çözen, profesyonelleri doğrulayan platform.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="group rounded-xl p-8 transition-all duration-300"
              style={{
                // Component Layer: surface-container (#1a1a1a)
                background: "hsl(var(--surface-container))",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "hsl(var(--surface-high))";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "hsl(var(--surface-container))";
              }}
            >
              {/* Icon with luminous accent */}
              <div
                className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  background: `hsl(${f.accent} / 0.12)`,
                  color: `hsl(${f.accent})`,
                }}
              >
                {f.icon}
              </div>
              <h3
                className="font-manrope mb-3 text-base font-bold text-white"
              >
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--on-surface-variant))" }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ROLES ── */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="mb-16 text-center">
          <h2 className="headline-md text-white">Her Rol İçin Özel Panel</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {roles.map((role, i) => (
            <div
              key={i}
              className="group rounded-xl p-8 transition-all duration-300"
              style={{
                background: "hsl(var(--surface-container))",
                border: "1px solid hsl(var(--outline-variant) / 0.12)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "hsl(var(--surface-high))";
                (e.currentTarget as HTMLElement).style.borderColor = `hsl(var(${role.accentVar}) / 0.30)`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "hsl(var(--surface-container))";
                (e.currentTarget as HTMLElement).style.borderColor = "hsl(var(--outline-variant) / 0.12)";
              }}
            >
              <span className="mb-4 block text-4xl">{role.icon}</span>
              <h3
                className="font-manrope mb-2 text-xl font-bold text-white"
              >
                {role.title} Paneli
              </h3>
              {/* 2.5rem gap between headline and body via margin-top-10 */}
              <p
                className="mb-8 text-sm leading-relaxed"
                style={{ color: "hsl(var(--on-surface-variant))" }}
              >
                {role.desc}
              </p>
              <Link href={role.href}>
                <button
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 hover:brightness-125"
                  style={{
                    border: `1px solid hsl(var(${role.accentVar}) / 0.40)`,
                    color: `hsl(var(${role.accentVar}))`,
                    background: `hsl(var(${role.accentVar}) / 0.08)`,
                  }}
                >
                  Keşfet <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section
        className="mx-6 mb-16 rounded-2xl px-8 py-16 text-center"
        style={{
          // Elevated: surface-highest (#262626)
          background: "hsl(var(--surface-highest))",
          border: "1px solid hsl(var(--outline-variant) / 0.12)",
          boxShadow: "0 20px 40px -5px hsl(var(--on-surface) / 0.04)",
        }}
      >
        <h2
          className="headline-md mb-10 text-white"
        >
          Hemen Ücretsiz Kaydolun
        </h2>
        <p
          className="mx-auto mb-8 max-w-lg text-base leading-relaxed"
          style={{ color: "hsl(var(--on-surface-variant))" }}
        >
          Platformun tüm özelliklerinden faydalanmak için hemen hesap oluşturun.
        </p>
        <Link href="/register">
          <button
            className="gradient-primary mx-auto flex items-center gap-2 rounded-lg px-8 py-3.5 text-base font-bold text-white transition-all duration-200 hover:brightness-125"
            style={{ boxShadow: "0 0 40px hsl(var(--primary) / 0.3)" }}
          >
            Ücretsiz Kaydol <ArrowRight className="h-4 w-4" />
          </button>
        </Link>

        {/* Trust indicators */}
        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm"
          style={{ color: "hsl(var(--on-surface-variant))" }}
        >
          {["Ücretsiz başlangıç", "Kredi kartı gerekmez", "Anında erişim"].map((item) => (
            <span key={item} className="flex items-center gap-2">
              <CheckCircle2
                className="h-4 w-4"
                style={{ color: "hsl(var(--secondary))" }}
              />
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="px-8 py-8"
        style={{ borderTop: "1px solid hsl(var(--outline-variant) / 0.15)" }}
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between text-sm md:flex-row">
          <span
            className="font-manrope font-bold text-white"
          >
            AccStudio © 2026
          </span>
          <span style={{ color: "hsl(var(--on-surface-variant))" }}>
            Dijital hizmet profesyonellerinin güvenilir platformu
          </span>
        </div>
      </footer>
    </main>
  );
}
