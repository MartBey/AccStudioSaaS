// Icon isimleri string olarak belirtilir, Sidebar.tsx'te LucideIcons'dan resolve edilir

export type NavItem = {
  title: string;
  href: string;
  icon: string;
  badge?: number;
};

export type RoleConfig = {
  [key: string]: NavItem[];
};


export const navigationConfig: RoleConfig = {
  BRAND: [
    { title: "Genel Bakış", href: "/marka", icon: "LayoutDashboard" },
    { title: "Projelerim", href: "/marka/projeler", icon: "Briefcase" },
    { title: "AI İçerik", href: "/marka/ai-icerik", icon: "Sparkles" },
    { title: "AI Jüri", href: "/marka/ai-juri", icon: "Scale" },
    { title: "AI İş Tanımı", href: "/marka/ai-is-tanimi", icon: "Wand2" },
    { title: "SEO Analiz", href: "/marka/seo-analiz", icon: "Search" },
    { title: "Sosyal Medya", href: "/marka/sosyal-medya", icon: "Calendar" },
    { title: "Fatura ve Ödemeler", href: "/marka/faturalar", icon: "CreditCard" },
    { title: "Mesajlar", href: "/marka/mesajlar", icon: "MessageCircle" },
    { title: "Makale Yaz", href: "/marka/blog", icon: "PenLine" },
    { title: "Bildirimler", href: "/marka/bildirimler", icon: "Bell" },
    { title: "Doğrulama", href: "/marka/dogrulama", icon: "ShieldCheck" },
    { title: "Marka Ayarları", href: "/marka/ayarlar", icon: "Settings" }
  ],
  AGENCY: [
    { title: "Genel Bakış", href: "/ajans", icon: "LayoutDashboard" },
    { title: "Yetenek Keşfi", href: "/ajans/kesfet", icon: "Search" },
    { title: "Müşteriler & Projeler", href: "/ajans/musteriler", icon: "Target" },
    { title: "Ekip Yönetimi", href: "/ajans/ekip", icon: "Users" },
    { title: "Web Builder", href: "/ajans/web-builder", icon: "MonitorSmartphone" },
    { title: "Mesajlar", href: "/ajans/mesajlar", icon: "MessageCircle" },
    { title: "Makale Yaz", href: "/ajans/blog", icon: "PenLine" },
    { title: "Bildirimler", href: "/ajans/bildirimler", icon: "Bell" },
    { title: "Doğrulama", href: "/ajans/dogrulama", icon: "ShieldCheck" },
    { title: "Ayarlar", href: "/ajans/ayarlar", icon: "Settings" },
  ],
  FREELANCER: [
    { title: "Genel Bakış", href: "/freelancer", icon: "LayoutDashboard" },
    { title: "Job Board", href: "/freelancer/ilanlar", icon: "Search" },
    { title: "Görevlerim", href: "/freelancer/gorevler", icon: "FileText" },
    { title: "Kazançlarım", href: "/freelancer/kazanclar", icon: "DollarSign" },
    { title: "Portföyüm", href: "/freelancer/portfolyo", icon: "FolderOpen" },
    { title: "Vitrinim", href: "/freelancer/vitrin", icon: "Palette" },
    { title: "Mesajlar", href: "/freelancer/mesajlar", icon: "MessageCircle" },
    { title: "Makale Yaz", href: "/freelancer/blog", icon: "PenLine" },
    { title: "Bildirimler", href: "/freelancer/bildirimler", icon: "Bell" },
    { title: "Doğrulama", href: "/freelancer/dogrulama", icon: "ShieldCheck" },
    { title: "Ayarlar", href: "/freelancer/ayarlar", icon: "Settings" },
  ],
};
