import { BuilderSite, BlockType } from "../schema/builder-types";
import { v4 as uuidv4 } from "uuid";

// 1. Modern Ajans / B2B Hizmet Teması
export const AgencyTemplate: BuilderSite = {
  themeConfig: {
    primaryColor: "#0f172a",
    secondaryColor: "#3b82f6",
    fontFamily: "Inter",
  },
  nodes: [
    {
      id: uuidv4(),
      type: BlockType.Hero,
      props: {
        title: "Geleceği İnşa Eden Dijital Ajans",
        subtitle: "Markanızı dijital dünyada bir adım öne taşıyoruz. Kusursuz tasarım ve güçlü mühendislik vizyonu.",
        align: "center",
        primaryButtonText: "Projelerimizi İncele",
        secondaryButtonText: "Bize Ulaşın",
      },
    },
    {
      id: uuidv4(),
      type: BlockType.Features,
      props: {
        title: "Neler Yapıyoruz?",
        subtitle: "İşletmenizi büyütmek için uçtan uca dijital çözümler sunuyoruz.",
        features: [
          { title: "Web Geliştirme", description: "Modern, hızlı ve SEO uyumlu web uygulamaları tasarlıyoruz." },
          { title: "UI/UX Tasarım", description: "Kullanıcı deneyimi odaklı, çarpıcı marka kimlikleri oluşturuyoruz." },
          { title: "Dijital Pazarlama", description: "Veri odaklı büyüme stratejileriyle dönüşüm oranlarınızı artırıyoruz." },
        ],
      },
    },
    {
      id: uuidv4(),
      type: BlockType.Contact,
      props: {
        title: "Kahve İçmeye Bekleriz",
        subtitle: "Bir sonraki büyük projenizi konuşmak için bizimle iletişime geçin.",
        email: "hello@agency.com",
        phone: "+90 555 123 45 67"
      },
    },
    {
      id: uuidv4(),
      type: BlockType.Footer,
      props: {
        text: "© 2026 Dijital Ajans. Tüm hakları saklıdır.",
        links: [
            { label: "Gizlilik", url: "#" },
            { label: "Şartlar", url: "#" }
        ]
      },
    },
  ],
};

// 2. SaaS / Yazılım Ürünü Teması
export const SaaSTemplate: BuilderSite = {
  themeConfig: {
    primaryColor: "#4f46e5",
    secondaryColor: "#10b981",
    fontFamily: "Roboto",
  },
  nodes: [
    {
      id: uuidv4(),
      type: BlockType.Hero,
      props: {
        title: "İşletmeniz İçin Akıllı Büyüme Motoru",
        subtitle: "Satışlarınızı, pazarlamanızı ve müşteri ilişkilerinizi tek bir platformdan yönetin.",
        align: "left",
        primaryButtonText: "Ücretsiz Dene",
      },
    },
    {
      id: uuidv4(),
      type: BlockType.Features,
      props: {
        title: "Neden Bizi Seçmelisiniz?",
        features: [
          { title: "Otomasyon", description: "Tekrar eden işleri yapay zekaya bırakın." },
          { title: "Raporlama", description: "Gerçek zamanlı gelişmiş analitik dashbordlar." },
        ],
      },
    },
    {
      id: uuidv4(),
      type: BlockType.Pricing,
      props: {
        title: "Basit ve Şeffaf Fiyatlandırma",
        plans: [
            { name: "Başlangıç", price: "₺299/ay", features: ["1 Kullanıcı", "Temel Özellikler"] },
            { name: "Pro", price: "₺899/ay", features: ["Sınırsız Kullanıcı", "Tüm Özellikler", "Öncelikli Destek"] }
        ]
      },
    },
    {
      id: uuidv4(),
      type: BlockType.Testimonial,
      props: {
        quote: "Bu platform sayesinde müşteri destek sürelerimizi %40 azalttık. Harika bir araç!",
        author: "Ahmet Yılmaz, CEO",
      },
    },
    {
      id: uuidv4(),
      type: BlockType.Footer,
      props: {
        text: "© 2026 SaaS Inc.",
      },
    },
  ],
};

export const TemplatesRegistry = {
  AgencyTemplate,
  SaaSTemplate,
};
