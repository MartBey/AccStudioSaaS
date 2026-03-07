"use client";

import { useState, useEffect, useRef } from "react";
import { CheckCircle2, MapPin, Briefcase, DollarSign, Github, Linkedin, Twitter, Globe, ArrowUpRight, Mail, Code2, Sparkles } from "lucide-react";
import Link from "next/link";

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
const themeConfig: Record<string, {
  bg: string; cardBg: string; cardBorder: string;
  textPrimary: string; textSecondary: string; textMuted: string;
  accentGradient: string; btnBg: string; btnText: string;
  gridColor: string; glowColor1: string; glowColor2: string;
  loadingBg: string; loadingAccent: string;
}> = {
  default: {
    bg: "#fafafa", cardBg: "bg-white", cardBorder: "border-gray-200/60",
    textPrimary: "text-gray-900", textSecondary: "text-gray-600", textMuted: "text-gray-400",
    accentGradient: "from-blue-600 to-indigo-600",
    btnBg: "bg-gradient-to-r from-blue-600 to-indigo-600", btnText: "text-white",
    gridColor: "rgba(0,0,0,0.03)", glowColor1: "#6366f1", glowColor2: "#3b82f6",
    loadingBg: "#fafafa", loadingAccent: "#6366f1",
  },
  dark: {
    bg: "#030014", cardBg: "bg-white/[0.04]", cardBorder: "border-white/[0.08]",
    textPrimary: "text-white", textSecondary: "text-gray-300", textMuted: "text-gray-500",
    accentGradient: "from-purple-400 to-blue-400",
    btnBg: "bg-gradient-to-r from-purple-500 to-blue-500", btnText: "text-white",
    gridColor: "rgba(255,255,255,0.03)", glowColor1: "#a855f7", glowColor2: "#6366f1",
    loadingBg: "#030014", loadingAccent: "#a855f7",
  },
  ocean: {
    bg: "#001220", cardBg: "bg-white/[0.05]", cardBorder: "border-cyan-400/10",
    textPrimary: "text-white", textSecondary: "text-cyan-100", textMuted: "text-cyan-600",
    accentGradient: "from-cyan-400 to-blue-500",
    btnBg: "bg-gradient-to-r from-cyan-500 to-blue-600", btnText: "text-white",
    gridColor: "rgba(0,180,220,0.04)", glowColor1: "#06b6d4", glowColor2: "#3b82f6",
    loadingBg: "#001220", loadingAccent: "#06b6d4",
  },
  sunset: {
    bg: "#1a0a00", cardBg: "bg-white/[0.05]", cardBorder: "border-orange-400/10",
    textPrimary: "text-white", textSecondary: "text-orange-100", textMuted: "text-orange-600",
    accentGradient: "from-orange-400 to-pink-500",
    btnBg: "bg-gradient-to-r from-orange-500 to-pink-600", btnText: "text-white",
    gridColor: "rgba(255,120,0,0.04)", glowColor1: "#f97316", glowColor2: "#ec4899",
    loadingBg: "#1a0a00", loadingAccent: "#f97316",
  },
};

/* ============ ANIMATION HOOK ============ */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(el); }
    }, { threshold });
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

function AnimatedSection({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
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
      setLoadingProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + Math.random() * 15 + 5;
      });
    }, 80);
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => { clearInterval(interval); clearTimeout(timer); };
  }, []);

  const hasSocials = data.socialLinks && Object.values(data.socialLinks).some(v => v);

  // Parse skills into tech stack
  const skills = data.skills || [];

  /* ====== LOADING SCREEN ====== */
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center" style={{ background: t.loadingBg }}>
        {/* Spinning Logo */}
        <div className="relative mb-8">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold"
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
        <div className="w-48 h-1 rounded-full overflow-hidden" style={{ background: `${t.glowColor1}20` }}>
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
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(${t.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${t.gridColor} 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      {/* Glow Orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-20 blur-[120px] pointer-events-none" style={{ background: `linear-gradient(135deg, ${t.glowColor1}, ${t.glowColor2})` }} />
      <div className="fixed bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full opacity-15 blur-[100px] pointer-events-none" style={{ background: `linear-gradient(135deg, ${t.glowColor2}, ${t.glowColor1})` }} />

      {/* Floating Navbar */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl border-b" style={{ background: `${t.bg}cc`, borderColor: `${t.glowColor1}10` }}>
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: `linear-gradient(135deg, ${t.glowColor1}, ${t.glowColor2})` }}>
              {data.freelancerName.charAt(0)}
            </div>
            <span className="font-semibold text-sm">{data.freelancerName}</span>
            {data.isVerified && <CheckCircle2 className="h-4 w-4 text-blue-400" />}
          </div>
          <div className="flex items-center gap-2">
            {data.socialLinks?.github && <a href={data.socialLinks.github} target="_blank" rel="noopener" className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${t.textMuted} hover:${t.textSecondary}`}><Github className="h-4 w-4" /></a>}
            {data.socialLinks?.linkedin && <a href={data.socialLinks.linkedin} target="_blank" rel="noopener" className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${t.textMuted} hover:${t.textSecondary}`}><Linkedin className="h-4 w-4" /></a>}
            {data.socialLinks?.twitter && <a href={data.socialLinks.twitter} target="_blank" rel="noopener" className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${t.textMuted} hover:${t.textSecondary}`}><Twitter className="h-4 w-4" /></a>}
            {data.socialLinks?.website && <a href={data.socialLinks.website} target="_blank" rel="noopener" className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${t.textMuted} hover:${t.textSecondary}`}><Globe className="h-4 w-4" /></a>}
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">

        {/* ====== HERO ====== */}
        <AnimatedSection className="text-center mb-16">
          <div className="relative inline-block mb-6">
            <div className={`w-32 h-32 rounded-full ${t.cardBg} backdrop-blur-sm border-2 ${t.cardBorder} flex items-center justify-center text-5xl font-bold overflow-hidden shadow-2xl`}>
              {data.freelancerImage ? (
                <img src={data.freelancerImage} alt={data.freelancerName} className="w-full h-full object-cover" />
              ) : (
                <span style={{ background: `linear-gradient(135deg, ${t.glowColor1}, ${t.glowColor2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {data.freelancerName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {data.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center border-4 shadow-lg" style={{ borderColor: t.bg }}>
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
            )}
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-3" style={{ animation: "fadeInUp 0.8s ease 0.2s both" }}>
            {data.freelancerName}
          </h1>
          {data.headline && (
            <p className="text-xl md:text-2xl font-medium mb-3" style={{ background: `linear-gradient(90deg, ${t.glowColor1}, ${t.glowColor2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "fadeInUp 0.8s ease 0.4s both" }}>
              {data.headline}
            </p>
          )}
          {data.location && (
            <p className={`${t.textMuted} text-sm flex items-center justify-center gap-1.5`} style={{ animation: "fadeInUp 0.8s ease 0.6s both" }}>
              <MapPin className="h-4 w-4" /> {data.location}
            </p>
          )}

          <style>{`@keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>
        </AnimatedSection>

        {/* ====== STATS ====== */}
        <AnimatedSection className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-14" delay={0.1}>
          {[
            { icon: <Briefcase className="h-6 w-6" />, value: data.completedProjects.length, label: "Tamamlanan Proje", color: t.glowColor1 },
            ...(data.totalEarnings !== null ? [{ icon: <DollarSign className="h-6 w-6" />, value: `₺${data.totalEarnings.toLocaleString("tr-TR")}`, label: "Toplam Kazanç", color: t.glowColor2 }] : []),
            { icon: <CheckCircle2 className="h-6 w-6" />, value: "%100", label: "Başarı Oranı", color: "#22c55e" },
          ].map((stat, i) => (
            <div
              key={i}
              className={`group ${t.cardBg} backdrop-blur-sm border ${t.cardBorder} rounded-2xl p-6 text-center hover:scale-[1.03] transition-all duration-300 cursor-default`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="mb-2 flex justify-center" style={{ color: stat.color }}>{stat.icon}</div>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className={`text-xs ${t.textMuted} mt-1`}>{stat.label}</p>
            </div>
          ))}
        </AnimatedSection>

        {/* ====== ABOUT ====== */}
        {data.about && (
          <AnimatedSection className="mb-14" delay={0.2}>
            <h2 className={`text-xs font-semibold uppercase tracking-[0.2em] ${t.textMuted} mb-4 flex items-center gap-2`}>
              <Sparkles className="h-4 w-4" /> Hakkımda
            </h2>
            <div className={`${t.cardBg} backdrop-blur-sm border ${t.cardBorder} rounded-2xl p-8`}>
              <p className={`${t.textSecondary} leading-relaxed whitespace-pre-wrap text-base`}>{data.about}</p>
            </div>
          </AnimatedSection>
        )}

        {/* ====== TECH STACK ====== */}
        {skills.length > 0 && (
          <AnimatedSection className="mb-14" delay={0.25}>
            <h2 className={`text-xs font-semibold uppercase tracking-[0.2em] ${t.textMuted} mb-4 flex items-center gap-2`}>
              <Code2 className="h-4 w-4" /> Tech Stack
            </h2>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, i) => {
                const key = skill.toLowerCase().replace(/[^a-z]/g, "");
                const tech = techIcons[key];
                return (
                  <div
                    key={i}
                    className={`group ${t.cardBg} backdrop-blur-sm border ${t.cardBorder} rounded-xl px-4 py-2.5 flex items-center gap-2 hover:scale-105 transition-all duration-200 cursor-default`}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    {tech ? (
                      <span className="text-sm">{tech.icon}</span>
                    ) : (
                      <span className="w-5 h-5 rounded bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-[8px] font-bold text-white">
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
            <h2 className={`text-xs font-semibold uppercase tracking-[0.2em] ${t.textMuted} mb-4 flex items-center gap-2`}>
              <Code2 className="h-4 w-4" /> Portfolyo & Çalışmalar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {data.portfolioItems.map((item, i) => (
                <div key={item.id} className={`group relative rounded-2xl overflow-hidden border ${t.cardBorder} ${t.cardBg} backdrop-blur-sm hover:shadow-2xl transition-all duration-500`} style={{ animationDelay: `${i * 0.1}s` }}>
                  {item.imageUrl ? (
                    <div className="relative w-full aspect-[4/3] bg-black/5 overflow-hidden">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                        {item.projectUrl && (
                          <a href={item.projectUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium bg-white/20 hover:bg-white/30 text-white backdrop-blur-md px-3 py-1.5 rounded-full w-fit transition-colors">
                             Projeyi İncele <ArrowUpRight className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full aspect-[4/3] bg-black/5 flex flex-col items-center justify-center border-b border-white/5 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br opacity-20 pointer-events-none" style={{ backgroundImage: `linear-gradient(135deg, ${t.glowColor1}, ${t.glowColor2})` }} />
                      <Code2 className={`h-10 w-10 mb-3 opacity-40 ${t.textPrimary}`} />
                      {item.projectUrl && (
                        <a href={item.projectUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full transition-colors relative z-10">
                           Projeyi İncele <ArrowUpRight className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  )}
                  
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <h3 className={`font-semibold text-lg line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text transition-colors duration-300`} style={{ backgroundImage: `linear-gradient(90deg, ${t.glowColor1}, ${t.glowColor2})` }}>
                        {item.title}
                      </h3>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md bg-black/5 dark:bg-white/10 shrink-0">
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
            <h2 className={`text-xs font-semibold uppercase tracking-[0.2em] ${t.textMuted} mb-4 flex items-center gap-2`}>
              <Briefcase className="h-4 w-4" /> Platform Üzerinde Tamamlanan Projeler
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {data.completedProjects.map((p, i) => (
                <div
                  key={i}
                  className={`group ${t.cardBg} backdrop-blur-sm border ${t.cardBorder} rounded-2xl p-6 hover:scale-[1.02] hover:shadow-xl transition-all duration-300`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base truncate">{p.title}</h3>
                      <p className={`text-sm ${t.textMuted} mt-0.5`}>{p.projectName}</p>
                    </div>
                    {p.earning > 0 && (
                      <span className="text-sm font-bold flex-shrink-0 ml-3" style={{ background: `linear-gradient(90deg, ${t.glowColor1}, ${t.glowColor2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
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
            <div className={`${t.cardBg} backdrop-blur-sm border ${t.cardBorder} rounded-2xl p-10 text-center relative overflow-hidden`}>
              {/* Background glow */}
              <div className="absolute inset-0 opacity-5" style={{ background: `radial-gradient(circle at center, ${t.glowColor1}, transparent 70%)` }} />
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-2">Birlikte Çalışalım</h2>
                <p className={`${t.textSecondary} text-sm mb-6`}>Yeni bir projeniz mi var? Hemen iletişime geçin.</p>
                <Link
                  href="/register"
                  className={`inline-flex items-center gap-2 px-8 py-3.5 ${t.btnBg} ${t.btnText} rounded-xl font-semibold text-sm hover:opacity-90 hover:scale-[1.02] transition-all duration-200 shadow-lg`}
                >
                  <Mail className="h-4 w-4" /> İletişime Geç <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* ====== FOOTER ====== */}
        <footer className={`text-center ${t.textMuted} text-xs pb-8`}>
          <p>Powered by <span style={{ background: `linear-gradient(90deg, ${t.glowColor1}, ${t.glowColor2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }} className="font-medium">AccStudio</span></p>
        </footer>
      </div>
    </div>
  );
}
