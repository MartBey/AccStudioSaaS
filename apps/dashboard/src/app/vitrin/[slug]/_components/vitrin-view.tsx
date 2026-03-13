"use client";

import {
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  Code2,
  DollarSign,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Sparkles,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ============ TECH STACK ICONS ============ */
const techIcons: Record<string, { icon: string; color: string }> = {
  react: { icon: "⚛️", color: "from-cyan-400 to-blue-500" },
  nextjs: { icon: "▲", color: "from-gray-200 to-white" },
  typescript: { icon: "TS", color: "from-blue-400 to-blue-600" },
  javascript: { icon: "JS", color: "from-yellow-400 to-amber-500" },
  nodejs: { icon: "⬢", color: "from-green-400 to-emerald-600" },
  python: { icon: "🐍", color: "from-blue-400 to-yellow-400" },
  tailwind: { icon: "🌊", color: "from-cyan-400 to-teal-500" },
  figma: { icon: "🎨", color: "from-purple-400 to-pink-500" },
  docker: { icon: "🐳", color: "from-blue-400 to-cyan-500" },
  git: { icon: "🔀", color: "from-orange-400 to-red-500" },
  mongodb: { icon: "🍃", color: "from-green-400 to-green-600" },
  postgresql: { icon: "🐘", color: "from-blue-400 to-indigo-500" },
  aws: { icon: "☁️", color: "from-orange-400 to-amber-500" },
  graphql: { icon: "◆", color: "from-pink-400 to-purple-500" },
  vue: { icon: "🟢", color: "from-green-400 to-emerald-500" },
  angular: { icon: "🅰️", color: "from-red-400 to-red-600" },
  sass: { icon: "💅", color: "from-pink-400 to-pink-600" },
  redis: { icon: "🔴", color: "from-red-400 to-red-600" },
  firebase: { icon: "🔥", color: "from-yellow-400 to-orange-500" },
  flutter: { icon: "💙", color: "from-blue-400 to-cyan-400" },
};

/* ============ THEME CONFIG ============ */
const themeConfig: Record<
  string,
  {
    bg: string;
    cardBg: string;
    cardBorder: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    accentGradient: string;
    btnBg: string;
    btnText: string;
    gridColor: string;
    glowColor1: string;
    glowColor2: string;
    loadingBg: string;
    loadingAccent: string;
  }
> = {
  default: {
    bg: "#fafafa",
    cardBg: "bg-white",
    cardBorder: "border-gray-200/60",
    textPrimary: "text-gray-900",
    textSecondary: "text-gray-600",
    textMuted: "text-gray-400",
    accentGradient: "from-blue-600 to-indigo-600",
    btnBg: "bg-gradient-to-r from-blue-600 to-indigo-600",
    btnText: "text-white",
    gridColor: "rgba(0,0,0,0.03)",
    glowColor1: "#6366f1",
    glowColor2: "#3b82f6",
    loadingBg: "#fafafa",
    loadingAccent: "#6366f1",
  },
  dark: {
    bg: "#030014",
    cardBg: "bg-white/[0.04]",
    cardBorder: "border-white/[0.08]",
    textPrimary: "text-white",
    textSecondary: "text-gray-300",
    textMuted: "text-gray-500",
    accentGradient: "from-purple-400 to-blue-400",
    btnBg: "bg-gradient-to-r from-purple-500 to-blue-500",
    btnText: "text-white",
    gridColor: "rgba(255,255,255,0.03)",
    glowColor1: "#a855f7",
    glowColor2: "#6366f1",
    loadingBg: "#030014",
    loadingAccent: "#a855f7",
  },
  ocean: {
    bg: "#001220",
    cardBg: "bg-white/[0.05]",
    cardBorder: "border-cyan-400/10",
    textPrimary: "text-white",
    textSecondary: "text-cyan-100",
    textMuted: "text-cyan-600",
    accentGradient: "from-cyan-400 to-blue-500",
    btnBg: "bg-gradient-to-r from-cyan-500 to-blue-600",
    btnText: "text-white",
    gridColor: "rgba(0,180,220,0.04)",
    glowColor1: "#06b6d4",
    glowColor2: "#3b82f6",
    loadingBg: "#001220",
    loadingAccent: "#06b6d4",
  },
  sunset: {
    bg: "#1a0a00",
    cardBg: "bg-white/[0.05]",
    cardBorder: "border-orange-400/10",
    textPrimary: "text-white",
    textSecondary: "text-orange-100",
    textMuted: "text-orange-600",
    accentGradient: "from-orange-400 to-pink-500",
    btnBg: "bg-gradient-to-r from-orange-500 to-pink-600",
    btnText: "text-white",
    gridColor: "rgba(255,120,0,0.04)",
    glowColor1: "#f97316",
    glowColor2: "#ec4899",
    loadingBg: "#1a0a00",
    loadingAccent: "#f97316",
  },
};

/* ============ ANIMATION HOOK ============ */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

function AnimatedSection({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, isVisible } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ============ TYPES ============ */
interface VitrinViewProps {
  data: {
    freelancerName: string;
    freelancerImage: string | null;
    headline: string | null;
    about: string | null;
    theme: string;
    showEarnings: boolean;
    showContact: boolean;
    socialLinks: Record<string, string> | null;
    isVerified: boolean;
    totalEarnings: number | null;
    location: string | null;
    bio: string | null;
    freelancerTitle: string | null;
    completedProjects: { title: string; projectName: string; earning: number }[];
    portfolioItems?: {
      id: string;
      title: string;
      description: string | null;
      projectUrl: string | null;
      imageUrl: string | null;
      date: Date | null;
      category: string;
    }[];
    skills: string[];
  };
}

/* ============ MAIN COMPONENT ============ */
export default function VitrinView({ data }: VitrinViewProps) {
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const t = themeConfig[data.theme] || themeConfig.dark;

  // Loading animation
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 80);
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  const hasSocials = data.socialLinks && Object.values(data.socialLinks).some((v) => v);

  // Parse skills into tech stack
  const skills = data.skills || [];

  /* ====== LOADING SCREEN ====== */
  if (loading) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center"
        style={{ background: t.loadingBg }}
      >
        {/* Spinning Logo */}
        <div className="relative mb-8">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-2xl text-3xl font-bold"
            style={{
              background: `linear-gradient(135deg, ${t.glowColor1}, ${t.glowColor2})`,
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          >
            <span className="text-white">{data.freelancerName.charAt(0).toUpperCase()}</span>
          </div>
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${t.glowColor1}, ${t.glowColor2})`,
              filter: "blur(20px)",
              opacity: 0.4,
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
        </div>

        {/* Progress Bar */}
        <div
          className="h-1 w-48 overflow-hidden rounded-full"
          style={{ background: `${t.glowColor1}20` }}
        >
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{
              width: `${Math.min(loadingProgress, 100)}%`,
              background: `linear-gradient(90deg, ${t.glowColor1}, ${t.glowColor2})`,
            }}
          />
        </div>
        <p className={`mt-4 text-sm ${t.textMuted}`} style={{ animation: "fadeInUp 0.5s ease" }}>
          Vitrin yükleniyor...
        </p>

        <style>{`
          @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
          @keyframes fadeInUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        `}</style>
      </div>
    );
  }

  /* ====== MAIN VITRIN ====== */
  return (
    <div className={`min-h-screen ${t.textPrimary} overflow-hidden`} style={{ background: t.bg }}>
      {/* Grid Pattern */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: `linear-gradient(${t.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${t.gridColor} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow Orbs */}
      <div
        className="pointer-events-none fixed left-[-10%] top-[-20%] h-[500px] w-[500px] rounded-full opacity-20 blur-[120px]"
        style={{ background: `linear-gradient(135deg, ${t.glowColor1}, ${t.glowColor2})` }}
      />
      <div
        className="pointer-events-none fixed bottom-[-20%] right-[-10%] h-[400px] w-[400px] rounded-full opacity-15 blur-[100px]"
        style={{ background: `linear-gradient(135deg, ${t.glowColor2}, ${t.glowColor1})` }}
      />

      {/* Floating Navbar */}
      <nav
        className="sticky top-0 z-40 border-b backdrop-blur-xl"
        style={{ background: `${t.bg}cc`, borderColor: `${t.glowColor1}10` }}
      >
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${t.glowColor1}, ${t.glowColor2})` }}
            >
              {data.freelancerName.charAt(0)}
            </div>
            <span className="text-sm font-semibold">{data.freelancerName}</span>
            {data.isVerified && <CheckCircle2 className="h-4 w-4 text-blue-400" />}
          </div>
          <div className="flex items-center gap-2">
            {data.socialLinks?.github && (
              <a
                href={data.socialLinks.github}
                target="_blank"
                rel="noopener"
                className={`rounded-lg p-2 transition-colors hover:bg-white/10 ${t.textMuted} hover:${t.textSecondary}`}
              >
                <Github className="h-4 w-4" />
              </a>
            )}
            {data.socialLinks?.linkedin && (
              <a
                href={data.socialLinks.linkedin}
                target="_blank"
                rel="noopener"
                className={`rounded-lg p-2 transition-colors hover:bg-white/10 ${t.textMuted} hover:${t.textSecondary}`}
              >
                <Linkedin className="h-4 w-4" />
              </a>
            )}
            {data.socialLinks?.twitter && (
              <a
                href={data.socialLinks.twitter}
                target="_blank"
                rel="noopener"
                className={`rounded-lg p-2 transition-colors hover:bg-white/10 ${t.textMuted} hover:${t.textSecondary}`}
              >
                <Twitter className="h-4 w-4" />
              </a>
            )}
            {data.socialLinks?.website && (
              <a
                href={data.socialLinks.website}
                target="_blank"
                rel="noopener"
                className={`rounded-lg p-2 transition-colors hover:bg-white/10 ${t.textMuted} hover:${t.textSecondary}`}
              >
                <Globe className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </nav>

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16">
        {/* ====== HERO ====== */}
        <AnimatedSection className="mb-16 text-center">
          <div className="relative mb-6 inline-block">
            <div
              className={`h-32 w-32 rounded-full ${t.cardBg} border-2 backdrop-blur-sm ${t.cardBorder} flex items-center justify-center overflow-hidden text-5xl font-bold shadow-2xl`}
            >
              {data.freelancerImage ? (
                <img
                  src={data.freelancerImage}
                  alt={data.freelancerName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span
                  style={{
                    background: `linear-gradient(135deg, ${t.glowColor1}, ${t.glowColor2})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {data.freelancerName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {data.isVerified && (
              <div
                className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-4 bg-blue-500 shadow-lg"
                style={{ borderColor: t.bg }}
              >
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
            )}
          </div>

          <h1
            className="mb-3 text-5xl font-bold tracking-tight md:text-6xl"
            style={{ animation: "fadeInUp 0.8s ease 0.2s both" }}
          >
            {data.freelancerName}
          </h1>
          {data.headline && (
            <p
              className="mb-3 text-xl font-medium md:text-2xl"
              style={{
                background: `linear-gradient(90deg, ${t.glowColor1}, ${t.glowColor2})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "fadeInUp 0.8s ease 0.4s both",
              }}
            >
              {data.headline}
            </p>
          )}
          {data.location && (
            <p
              className={`${t.textMuted} flex items-center justify-center gap-1.5 text-sm`}
              style={{ animation: "fadeInUp 0.8s ease 0.6s both" }}
            >
              <MapPin className="h-4 w-4" /> {data.location}
            </p>
          )}

          <style>{`@keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>
        </AnimatedSection>

        {/* ====== STATS ====== */}
        <AnimatedSection className="mb-14 grid grid-cols-2 gap-4 md:grid-cols-3" delay={0.1}>
          {[
            {
              icon: <Briefcase className="h-6 w-6" />,
              value: data.completedProjects.length,
              label: "Tamamlanan Proje",
              color: t.glowColor1,
            },
            ...(data.totalEarnings !== null
              ? [
                  {
                    icon: <DollarSign className="h-6 w-6" />,
                    value: `₺${data.totalEarnings.toLocaleString("tr-TR")}`,
                    label: "Toplam Kazanç",
                    color: t.glowColor2,
                  },
                ]
              : []),
            {
              icon: <CheckCircle2 className="h-6 w-6" />,
              value: "%100",
              label: "Başarı Oranı",
              color: "#22c55e",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`group ${t.cardBg} border backdrop-blur-sm ${t.cardBorder} cursor-default rounded-2xl p-6 text-center transition-all duration-300 hover:scale-[1.03]`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="mb-2 flex justify-center" style={{ color: stat.color }}>
                {stat.icon}
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className={`text-xs ${t.textMuted} mt-1`}>{stat.label}</p>
            </div>
          ))}
        </AnimatedSection>

        {/* ====== ABOUT ====== */}
        {data.about && (
          <AnimatedSection className="mb-14" delay={0.2}>
            <h2
              className={`text-xs font-semibold uppercase tracking-[0.2em] ${t.textMuted} mb-4 flex items-center gap-2`}
            >
              <Sparkles className="h-4 w-4" /> Hakkımda
            </h2>
            <div className={`${t.cardBg} border backdrop-blur-sm ${t.cardBorder} rounded-2xl p-8`}>
              <p className={`${t.textSecondary} whitespace-pre-wrap text-base leading-relaxed`}>
                {data.about}
              </p>
            </div>
          </AnimatedSection>
        )}

        {/* ====== TECH STACK ====== */}
        {skills.length > 0 && (
          <AnimatedSection className="mb-14" delay={0.25}>
            <h2
              className={`text-xs font-semibold uppercase tracking-[0.2em] ${t.textMuted} mb-4 flex items-center gap-2`}
            >
              <Code2 className="h-4 w-4" /> Tech Stack
            </h2>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, i) => {
                const key = skill.toLowerCase().replace(/[^a-z]/g, "");
                const tech = techIcons[key];
                return (
                  <div
                    key={i}
                    className={`group ${t.cardBg} border backdrop-blur-sm ${t.cardBorder} flex cursor-default items-center gap-2 rounded-xl px-4 py-2.5 transition-all duration-200 hover:scale-105`}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    {tech ? (
                      <span className="text-sm">{tech.icon}</span>
                    ) : (
                      <span className="flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br from-gray-400 to-gray-600 text-[8px] font-bold text-white">
                        {skill.charAt(0).toUpperCase()}
                      </span>
                    )}
                    <span className="text-sm font-medium">{skill}</span>
                  </div>
                );
              })}
            </div>
          </AnimatedSection>
        )}

        {/* ====== EXTERNAL PORTFOLIO ====== */}
        {data.portfolioItems && data.portfolioItems.length > 0 && (
          <AnimatedSection className="mb-14" delay={0.28}>
            <h2
              className={`text-xs font-semibold uppercase tracking-[0.2em] ${t.textMuted} mb-4 flex items-center gap-2`}
            >
              <Code2 className="h-4 w-4" /> Portfolyo & Çalışmalar
            </h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {data.portfolioItems.map((item, i) => (
                <div
                  key={item.id}
                  className={`group relative overflow-hidden rounded-2xl border ${t.cardBorder} ${t.cardBg} backdrop-blur-sm transition-all duration-500 hover:shadow-2xl`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {item.imageUrl ? (
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/5">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {item.projectUrl && (
                          <a
                            href={item.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md transition-colors hover:bg-white/30"
                          >
                            Projeyi İncele <ArrowUpRight className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="relative flex aspect-[4/3] w-full flex-col items-center justify-center overflow-hidden border-b border-white/5 bg-black/5">
                      <div
                        className="pointer-events-none absolute inset-0 bg-gradient-to-br opacity-20"
                        style={{
                          backgroundImage: `linear-gradient(135deg, ${t.glowColor1}, ${t.glowColor2})`,
                        }}
                      />
                      <Code2 className={`mb-3 h-10 w-10 opacity-40 ${t.textPrimary}`} />
                      {item.projectUrl && (
                        <a
                          href={item.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative z-10 inline-flex items-center gap-1.5 rounded-full bg-black/10 px-3 py-1.5 text-xs font-medium backdrop-blur-md transition-colors hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
                        >
                          Projeyi İncele <ArrowUpRight className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  )}

                  <div className="p-5">
                    <div className="mb-2.5 flex items-start justify-between gap-3">
                      <h3
                        className={`line-clamp-1 text-lg font-semibold transition-colors duration-300 group-hover:bg-clip-text group-hover:text-transparent`}
                        style={{
                          backgroundImage: `linear-gradient(90deg, ${t.glowColor1}, ${t.glowColor2})`,
                        }}
                      >
                        {item.title}
                      </h3>
                      <span className="shrink-0 rounded-md bg-black/5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider dark:bg-white/10">
                        {item.category.replace("_", " ")}
                      </span>
                    </div>
                    {item.description && (
                      <p className={`text-sm ${t.textSecondary} line-clamp-2 leading-relaxed`}>
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        )}

        {/* ====== PLATFORM PROJECTS ====== */}
        {data.completedProjects.length > 0 && (
          <AnimatedSection className="mb-14" delay={0.3}>
            <h2
              className={`text-xs font-semibold uppercase tracking-[0.2em] ${t.textMuted} mb-4 flex items-center gap-2`}
            >
              <Briefcase className="h-4 w-4" /> Platform Üzerinde Tamamlanan Projeler
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {data.completedProjects.map((p, i) => (
                <div
                  key={i}
                  className={`group ${t.cardBg} border backdrop-blur-sm ${t.cardBorder} rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-base font-semibold">{p.title}</h3>
                      <p className={`text-sm ${t.textMuted} mt-0.5`}>{p.projectName}</p>
                    </div>
                    {p.earning > 0 && (
                      <span
                        className="ml-3 flex-shrink-0 text-sm font-bold"
                        style={{
                          background: `linear-gradient(90deg, ${t.glowColor1}, ${t.glowColor2})`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        ₺{p.earning.toLocaleString("tr-TR")}
                      </span>
                    )}
                  </div>
                  <div className={`mt-3 flex items-center gap-2 ${t.textMuted} text-xs`}>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Başarıyla tamamlandı</span>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        )}

        {/* ====== CTA ====== */}
        {data.showContact && (
          <AnimatedSection className="mb-16" delay={0.4}>
            <div
              className={`${t.cardBg} border backdrop-blur-sm ${t.cardBorder} relative overflow-hidden rounded-2xl p-10 text-center`}
            >
              {/* Background glow */}
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  background: `radial-gradient(circle at center, ${t.glowColor1}, transparent 70%)`,
                }}
              />
              <div className="relative z-10">
                <h2 className="mb-2 text-2xl font-bold">Birlikte Çalışalım</h2>
                <p className={`${t.textSecondary} mb-6 text-sm`}>
                  Yeni bir projeniz mi var? Hemen iletişime geçin.
                </p>
                <Link
                  href="/register"
                  className={`inline-flex items-center gap-2 px-8 py-3.5 ${t.btnBg} ${t.btnText} rounded-xl text-sm font-semibold shadow-lg transition-all duration-200 hover:scale-[1.02] hover:opacity-90`}
                >
                  <Mail className="h-4 w-4" /> İletişime Geç <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* ====== FOOTER ====== */}
        <footer className={`text-center ${t.textMuted} pb-8 text-xs`}>
          <p>
            Powered by{" "}
            <span
              style={{
                background: `linear-gradient(90deg, ${t.glowColor1}, ${t.glowColor2})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              className="font-medium"
            >
              AccStudio
            </span>
          </p>
        </footer>
      </div>
    </div>
  );
}
