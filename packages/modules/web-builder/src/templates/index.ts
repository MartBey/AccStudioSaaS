import { BuilderSite, BlockType } from "../schema/builder-types";
import { v4 as uuidv4 } from "uuid";

// ============================================
// Template Registry Metadata Tipi
// ============================================
export interface TemplateRegistryEntry {
  id: string;
  name: string;
  description: string;
  category: string;
  template: BuilderSite;
}

// ============================================
// 1. Modern Ajans / B2B Hizmet Teması
// ============================================
export const AgencyTemplate: BuilderSite = {
  themeConfig: {
    primaryColor: "#0f172a",
    secondaryColor: "#3b82f6",
    fontFamily: "Inter",
  },
  nodes: [
    {
      id: "agency-hero",
      type: BlockType.Hero,
      props: {
        title: "Geleceği İnşa Eden Dijital Ajans",
        subtitle:
          "Markanızı dijital dünyada bir adım öne taşıyoruz. Kusursuz tasarım ve güçlü mühendislik vizyonu.",
        align: "center",
        primaryButtonText: "Projelerimizi İncele",
        secondaryButtonText: "Bize Ulaşın",
      },
    },
    {
      id: "agency-features",
      type: BlockType.Features,
      props: {
        title: "Neler Yapıyoruz?",
        subtitle: "İşletmenizi büyütmek için uçtan uca dijital çözümler sunuyoruz.",
        features: [
          {
            title: "Web Geliştirme",
            description: "Modern, hızlı ve SEO uyumlu web uygulamaları tasarlıyoruz.",
          },
          {
            title: "UI/UX Tasarım",
            description: "Kullanıcı deneyimi odaklı, çarpıcı marka kimlikleri oluşturuyoruz.",
          },
          {
            title: "Dijital Pazarlama",
            description: "Veri odaklı büyüme stratejileriyle dönüşüm oranlarınızı artırıyoruz.",
          },
        ],
      },
    },
    {
      id: "agency-testimonial",
      type: BlockType.Testimonial,
      props: {
        quote:
          "Bu ekip ile çalışmak, projelerimize büyük bir ivme kazandırdı. Profesyonellik ve yaratıcılık bir arada!",
        author: "Ayşe Kaya",
        role: "Pazarlama Direktörü, TechBrand",
        rating: 5,
      },
    },
    {
      id: "agency-contact",
      type: BlockType.Contact,
      props: {
        title: "Kahve İçmeye Bekleriz",
        subtitle: "Bir sonraki büyük projenizi konuşmak için bizimle iletişime geçin.",
        email: "hello@agency.com",
        phone: "+90 555 123 45 67",
      },
    },
    {
      id: "agency-footer",
      type: BlockType.Footer,
      props: {
        text: "\u00a9 2026 Dijital Ajans. Tüm hakları saklıdır.",
        links: [
          { label: "Gizlilik", url: "#" },
          { label: "Şartlar", url: "#" },
        ],
      },
    },
  ],
};

// ============================================
// 2. SaaS / Yazılım Ürünü Teması
// ============================================
export const SaaSTemplate: BuilderSite = {
  themeConfig: {
    primaryColor: "#4f46e5",
    secondaryColor: "#10b981",
    fontFamily: "Roboto",
  },
  nodes: [
    {
      id: "saas-hero",
      type: BlockType.Hero,
      props: {
        title: "İşletmeniz İçin Akıllı Büyüme Motoru",
        subtitle:
          "Satışlarınızı, pazarlamanızı ve müşteri ilişkilerinizi tek bir platformdan yönetin.",
        align: "left",
        primaryButtonText: "Ücretsiz Dene",
      },
    },
    {
      id: "saas-features",
      type: BlockType.Features,
      props: {
        title: "Neden Bizi Seçmelisiniz?",
        features: [
          { title: "Otomasyon", description: "Tekrar eden işleri yapay zekaya bırakın." },
          { title: "Raporlama", description: "Gerçek zamanlı gelişmiş analitik dashboardlar." },
          { title: "Entegrasyon", description: "100+ popüler araçla sorunsuz entegrasyon." },
        ],
      },
    },
    {
      id: "saas-pricing",
      type: BlockType.Pricing,
      props: {
        title: "Basit ve Şeffaf Fiyatlandırma",
        plans: [
          {
            name: "Başlangıç",
            price: "₺299/ay",
            features: ["1 Kullanıcı", "Temel Özellikler"],
            ctaText: "Başla",
          },
          {
            name: "Pro",
            price: "₺899/ay",
            features: ["Sınırsız Kullanıcı", "Tüm Özellikler", "Öncelikli Destek"],
            highlighted: true,
            ctaText: "Ücretsiz Dene",
          },
          {
            name: "Kurumsal",
            price: "Özel Fiyat",
            features: ["Sınırsız Her Şey", "Özel Destek", "SLA Garantisi"],
            ctaText: "İletişime Geç",
          },
        ],
      },
    },
    {
      id: "saas-testimonial",
      type: BlockType.Testimonial,
      props: {
        quote: "Bu platform sayesinde müşteri destek sürelerimizi %40 azalttık. Harika bir araç!",
        author: "Ahmet Yılmaz",
        role: "CEO, GrowthCo",
        rating: 5,
      },
    },
    {
      id: "saas-footer",
      type: BlockType.Footer,
      props: {
        text: "\u00a9 2026 SaaS Inc. Tüm hakları saklıdır.",
      },
    },
  ],
};

// ============================================
// 3. E-Ticaret Landing Teması
// ============================================
export const ECommerceTemplate: BuilderSite = {
  themeConfig: {
    primaryColor: "#111827",
    secondaryColor: "#f97316",
    fontFamily: "Inter",
  },
  nodes: [
    {
      id: "ecommerce-hero",
      type: BlockType.Hero,
      props: {
        title: "Yeni Sezon Koleksiyonu",
        subtitle:
          "Tarzınızı yansıtan, kaliteden ödün vermeyen ürünlerle tanışın. İlk siparişinize özel %20 indirim.",
        align: "center",
        primaryButtonText: "Alışverişe Başla",
        secondaryButtonText: "Koleksiyonu Keşfet",
      },
    },
    {
      id: "ecommerce-image",
      type: BlockType.Image,
      props: {
        src: "",
        alt: "Ürün Vitrini",
        height: "400px",
        objectFit: "cover",
      },
    },
    {
      id: "ecommerce-features",
      type: BlockType.Features,
      props: {
        title: "Neden Bizi Tercih Etmelisiniz?",
        subtitle: "Alışveriş deneyiminizi mükemmelleştiriyoruz.",
        features: [
          { title: "Ücretsiz Kargo", description: "150 TL üzeri tüm siparişlerde ücretsiz kargo." },
          { title: "Kolay İade", description: "30 gün içinde koşulsuz iade garantisi." },
          { title: "Güvenli Ödeme", description: "256-bit SSL ile güvenli ödeme altyapısı." },
        ],
      },
    },
    {
      id: "ecommerce-testimonial",
      type: BlockType.Testimonial,
      props: {
        quote:
          "Ürün kalitesi ve hızlı teslimat konusunda çok memnun kaldım. Kesinlikle tekrar alışveriş yapacağım!",
        author: "Zeynep Acar",
        role: "Sadık Müşteri",
        rating: 5,
      },
    },
    {
      id: "ecommerce-contact",
      type: BlockType.Contact,
      props: {
        title: "Sorularınız mı var?",
        subtitle: "Müşteri hizmetlerimiz her zaman yanınızda.",
        email: "destek@shop.com",
        phone: "+90 850 123 45 67",
      },
    },
    {
      id: "ecommerce-footer",
      type: BlockType.Footer,
      props: {
        text: "\u00a9 2026 ShopBrand. Tüm hakları saklıdır.",
        links: [
          { label: "İade Politikası", url: "#" },
          { label: "Gizlilik", url: "#" },
          { label: "KVKK", url: "#" },
        ],
      },
    },
  ],
};

// ============================================
// 4. Portfolio / Freelancer Teması
// ============================================
export const PortfolioTemplate: BuilderSite = {
  themeConfig: {
    primaryColor: "#18181b",
    secondaryColor: "#a855f7",
    fontFamily: "Geist",
  },
  nodes: [
    {
      id: "portfolio-hero",
      type: BlockType.Hero,
      props: {
        title: "Merhaba, Ben Deniz.",
        subtitle:
          "Full-stack geliştirici ve UI/UX tasarımcıyım. Modern, performanslı ve kullanıcı dostu dijital ürünler inşa ediyorum.",
        align: "center",
        primaryButtonText: "Projelerimi Gör",
        secondaryButtonText: "İletişime Geç",
      },
    },
    {
      id: "portfolio-features",
      type: BlockType.Features,
      props: {
        title: "Uzmanlık Alanlarım",
        features: [
          {
            title: "Web Uygulamaları",
            description: "Next.js, React, TypeScript ile modern SPA & SSR projeler.",
          },
          {
            title: "Mobil Geliştirme",
            description: "React Native ile cross-platform mobil uygulamalar.",
          },
          {
            title: "UI/UX Tasarım",
            description: "Figma ile kullanıcı odaklı arayüz ve deneyim tasarımı.",
          },
        ],
      },
    },
    {
      id: "portfolio-image",
      type: BlockType.Image,
      props: {
        src: "",
        alt: "Proje Görseli",
        height: "350px",
        objectFit: "cover",
        borderRadius: "12px",
      },
    },
    {
      id: "portfolio-testimonial",
      type: BlockType.Testimonial,
      props: {
        quote:
          "Deniz ile çalışmak harika bir deneyimdi. Projeyi zamanında, beklentilerin üzerinde teslim etti.",
        author: "Mehmet Kılıç",
        role: "CTO, StartupXYZ",
        rating: 5,
      },
    },
    {
      id: "portfolio-contact",
      type: BlockType.Contact,
      props: {
        title: "Birlikte Çalışalım",
        subtitle: "Yeni bir proje fikriniz mi var? Hemen iletişime geçin.",
        email: "deniz@portfolio.dev",
        phone: "+90 532 000 00 00",
      },
    },
    {
      id: "portfolio-footer",
      type: BlockType.Footer,
      props: {
        text: "\u00a9 2026 Deniz Portfolio. Tüm hakları saklıdır.",
        links: [
          { label: "GitHub", url: "#" },
          { label: "LinkedIn", url: "#" },
        ],
      },
    },
  ],
};

// ============================================
// 5. Restoran / Kafe Teması
// ============================================
export const RestaurantTemplate: BuilderSite = {
  themeConfig: {
    primaryColor: "#451a03",
    secondaryColor: "#d97706",
    fontFamily: "Playfair Display",
  },
  nodes: [
    {
      id: "restaurant-hero",
      type: BlockType.Hero,
      props: {
        title: "Lezzetin En Saf Hali",
        subtitle:
          "Taze malzemeler, ustaca hazırlanmış tarifler ve unutulmaz bir gastronomi deneyimi sizi bekliyor.",
        align: "center",
        primaryButtonText: "Menüyü İncele",
        secondaryButtonText: "Rezervasyon Yap",
      },
    },
    {
      id: "restaurant-image",
      type: BlockType.Image,
      props: {
        src: "",
        alt: "Restoran Atmosferi",
        height: "400px",
        objectFit: "cover",
      },
    },
    {
      id: "restaurant-features",
      type: BlockType.Features,
      props: {
        title: "Neden Bizi Seçmelisiniz?",
        subtitle: "Her detayda mükemmelliği hedefliyoruz.",
        features: [
          {
            title: "Taze Malzemeler",
            description: "Her gün çiftlikten soframıza taze ve organik malzemeler.",
          },
          { title: "Ödüllü Şefler", description: "Michelin deneyimli şeflerimizden eşsiz tatlar." },
          {
            title: "Benzersiz Ambiyans",
            description: "Şehrin kalbinde, huzurlu ve şık bir ortam.",
          },
        ],
      },
    },
    {
      id: "restaurant-pricing",
      type: BlockType.Pricing,
      props: {
        title: "Menü Önerileri",
        subtitle: "En sevilen lezzetlerimiz",
        plans: [
          {
            name: "Başlangıçlar",
            price: "₺85'den",
            features: ["Mevsim Salatası", "Humus Tabağı", "Çorba Çeşitleri"],
            ctaText: "Sipariş Ver",
          },
          {
            name: "Ana Yemekler",
            price: "₺195'den",
            features: ["Kuzu Tandır", "Levrek Izgara", "Mantarlı Risotto"],
            highlighted: true,
            ctaText: "Sipariş Ver",
          },
          {
            name: "Tatlılar",
            price: "₺75'den",
            features: ["Künefe", "Cheesecake", "Sufle"],
            ctaText: "Sipariş Ver",
          },
        ],
      },
    },
    {
      id: "restaurant-contact",
      type: BlockType.Contact,
      props: {
        title: "Rezervasyon",
        subtitle: "Özel bir akşam yemeği için yerinizi ayırtın.",
        email: "info@lezzet.com",
        phone: "+90 212 000 00 00",
      },
    },
    {
      id: "restaurant-footer",
      type: BlockType.Footer,
      props: {
        text: "\u00a9 2026 Lezzet Restoran. Tüm hakları saklıdır.",
        links: [
          { label: "Menü", url: "#" },
          { label: "Hakkımızda", url: "#" },
          { label: "Konum", url: "#" },
        ],
      },
    },
  ],
};

// ============================================
// 6. Etkinlik / Lansman Teması
// ============================================
export const EventTemplate: BuilderSite = {
  themeConfig: {
    primaryColor: "#7c3aed",
    secondaryColor: "#06b6d4",
    fontFamily: "Inter",
  },
  nodes: [
    {
      id: "event-hero",
      type: BlockType.Hero,
      props: {
        title: "TechSummit 2026",
        subtitle:
          "Türkiye'nin en büyük teknoloji konferansı. 50+ konuşmacı, 2000+ katılımcı, 3 gün dolu dolu içerik.",
        align: "center",
        primaryButtonText: "Hemen Kayıt Ol",
        secondaryButtonText: "Program Detayları",
      },
    },
    {
      id: "event-features",
      type: BlockType.Features,
      props: {
        title: "Neler Sizi Bekliyor?",
        subtitle: "Benzersiz bir etkinlik deneyimi için hazırız.",
        features: [
          { title: "Keynote Konuşmalar", description: "Sektörün lider isimleri sahne alıyor." },
          { title: "Workshop'lar", description: "Uygulamalı atölyelerle yeni beceriler kazanın." },
          { title: "Networking", description: "Binlerce profesyonel ile bağlantı kurun." },
        ],
      },
    },
    {
      id: "event-testimonial",
      type: BlockType.Testimonial,
      props: {
        quote:
          "Geçen yılki TechSummit kariyerimde bir dönüm noktası oldu. İnanılmaz bağlantılar ve ilham verici konuşmalar!",
        author: "Cem Demir",
        role: "Yazılım Mühendisi, BigTech",
        rating: 5,
      },
    },
    {
      id: "event-pricing",
      type: BlockType.Pricing,
      props: {
        title: "Bilet Seçenekleri",
        subtitle: "Size en uygun paketi seçin.",
        plans: [
          {
            name: "Standart",
            price: "₺499",
            features: ["Tüm Oturumlar", "Networking Alanı", "Yemek Dahil"],
            ctaText: "Satın Al",
          },
          {
            name: "VIP",
            price: "₺999",
            features: ["Ön Sıra Koltuk", "VIP Lounge", "Speaker Dinner", "Özel Hediye Paketi"],
            highlighted: true,
            ctaText: "VIP Al",
          },
          {
            name: "Grup (5+)",
            price: "₺399/kişi",
            features: ["Grup İndirimi", "Tüm Oturumlar", "Yemek Dahil"],
            ctaText: "Grup Kaydı",
          },
        ],
      },
    },
    {
      id: "event-contact",
      type: BlockType.Contact,
      props: {
        title: "Sorularınız mı var?",
        subtitle: "Etkinlik hakkında her türlü sorunuz için bize ulaşın.",
        email: "info@techsummit.com",
        phone: "+90 850 000 00 00",
      },
    },
    {
      id: "event-footer",
      type: BlockType.Footer,
      props: {
        text: "\u00a9 2026 TechSummit. Tüm hakları saklıdır.",
        links: [
          { label: "Program", url: "#" },
          { label: "Sponsorlar", url: "#" },
          { label: "İletişim", url: "#" },
        ],
      },
    },
  ],
};

// ============================================
// 7. Premium Animated / Apple-like Teması
// ============================================
export const ApplePremiumTemplate: BuilderSite = {
  themeConfig: {
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    fontFamily: "Inter",
  },
  nodes: [
    {
      id: "premium-hero",
      type: BlockType.AnimatedHero,
      props: {
        title: "Pro. Beyond.",
        subtitle:
          "A magical new way to interact with your site. Groundbreaking safety features. Innovative design.",
        badge: "New Release",
        primaryButtonText: "Buy",
        secondaryButtonText: "Learn more",
      },
    },
    {
      id: "premium-features",
      type: BlockType.Features,
      props: {
        title: "Brilliant. In every way.",
        subtitle: "Advanced features that just make sense.",
        features: [
          { title: "Dynamic Island", description: "A new way to interact with your device." },
          { title: "Pro Camera System", description: "Mind-blowing detail." },
          { title: "All-day Battery life", description: "Power through your day." },
        ],
      },
    },
  ],
};

// ============================================
// Legacy Registry (geriye uyumluluk)
// ============================================
export const TemplatesRegistry = {
  AgencyTemplate,
  SaaSTemplate,
  ECommerceTemplate,
  PortfolioTemplate,
  RestaurantTemplate,
  EventTemplate,
  ApplePremiumTemplate,
};

// ============================================
// Yeni Metadata Registry (UI'da kullanılacak)
// ============================================
export const TemplatesList: TemplateRegistryEntry[] = [
  {
    id: "agency",
    name: "Modern Ajans",
    description: "B2B hizmet sunumu, yazılım ofisi ve dijital ajanslar için profesyonel tema.",
    category: "Ajans & Hizmet",
    template: AgencyTemplate,
  },
  {
    id: "saas",
    name: "SaaS Ürünü",
    description:
      "Yazılım ürünü tanıtımı, fiyatlandırma ve müşteri yorumları ile dönüşüm odaklı sayfa.",
    category: "Teknoloji",
    template: SaaSTemplate,
  },
  {
    id: "ecommerce",
    name: "E-Ticaret Landing",
    description:
      "Ürün vitrini, güven sinyalleri ve müşteri yorumları ile satış odaklı landing page.",
    category: "E-Ticaret",
    template: ECommerceTemplate,
  },
  {
    id: "portfolio",
    name: "Portfolio / Freelancer",
    description:
      "Kişisel marka, proje portföyü ve iletişim bilgileri ile profesyonel tanıtım sayfası.",
    category: "Kişisel",
    template: PortfolioTemplate,
  },
  {
    id: "restaurant",
    name: "Restoran / Kafe",
    description: "Menü önerileri, atmosfer görselleri ve rezervasyon ile gastronomi teması.",
    category: "Yeme & İçme",
    template: RestaurantTemplate,
  },
  {
    id: "event",
    name: "Etkinlik / Lansman",
    description: "Konferans, summit veya ürün lansmanı için bilet satışı ve program detayları.",
    category: "Etkinlik",
    template: EventTemplate,
  },
  {
    id: "premium-apple",
    name: "Premium Animated",
    description:
      "Apple, Framer ve GSAP tarzında üst düzey animasyonlu şablon. Siyah tema yoğunluklu.",
    category: "Premium",
    template: ApplePremiumTemplate,
  },
];
