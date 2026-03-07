export const marketplaceJobs = [
  { 
    id: "J-01", 
    title: "Senior React Geliştirici", 
    company: "Tech StartUp", 
    type: "Tam Zamanlı", 
    location: "Uzaktan", 
    budget: 90000, 
    posted: "2 saat önce",
    skills: ["React", "Next.js", "TypeScript"],
    match: "95%",
    verified: true,
    badges: ["AccStudio Onaylı", "Top %5 Kazanç"]
  },
  { 
    id: "J-02", 
    title: "Sosyal Medya Yönetimi (Freelance)", 
    company: "Moda Markası", 
    type: "Proje Bazlı", 
    location: "İstanbul (Hibrit)", 
    budget: 15000, 
    posted: "5 saat önce",
    skills: ["Instagram", "İçerik Üretimi", "CapCut"],
    match: "78%",
    verified: false,
    badges: []
  },
  { 
    id: "J-03", 
    title: "UI/UX Tasarımcısı", 
    company: "Fintech Agency", 
    type: "Yarı Zamanlı", 
    location: "Uzaktan", 
    budget: 40000, 
    posted: "1 gün önce",
    skills: ["Figma", "Prototyping", "Wireframing"],
    match: "88%",
    verified: true,
    badges: ["AccStudio Onaylı"]
  },
  { 
    id: "J-04", 
    title: "SEO Optimizasyon Uzmanı", 
    company: "Local Business", 
    type: "Kısa Dönem", 
    location: "Ankara", 
    budget: 8000, 
    posted: "2 gün önce",
    skills: ["SEO", "Google Analytics", "Ahrefs"],
    match: "65%",
    verified: false,
    badges: []
  },
  { 
    id: "J-05", 
    title: "E-Ticaret Danışmanı", 
    company: "Global Retail", 
    type: "Proje Bazlı", 
    location: "Uzaktan", 
    budget: 35000, 
    posted: "3 gün önce",
    skills: ["Shopify", "Conversion Rate", "Pazarlama"],
    match: "92%",
    verified: true,
    badges: ["Hızlı Ödeyen", "AccStudio Onaylı"]
  }
];

export const filterCategories = [
  "Yazılım / Teknoloji",
  "Tasarım / UI-UX",
  "Pazarlama / SEO",
  "Sosyal Medya",
  "İçerik Üretimi"
];

export type TaskStatus = "Yapılacak" | "Devam Ediyor" | "İnceleniyor" | "Tamamlandı";

export const freelancerTasks = [
  { id: "TSK-082", title: "Instagram Haftalık İçerik Planı", project: "Moda E-ticaret Q3", deadline: "Bugün 17:00", status: "İnceleniyor" as TaskStatus, earning: 1200 },
  { id: "TSK-083", title: "Ana Sayfa Hero Tasarım Revizesi", project: "Yeni Ürün Lansmanı", deadline: "Yarın", status: "Devam Ediyor" as TaskStatus, earning: 3500 },
  { id: "TSK-084", title: "Rakip Analizi Raporu", project: "SEO Optimizasyon", deadline: "12 Kasım 2026", status: "Yapılacak" as TaskStatus, earning: 2000 },
  { id: "TSK-085", title: "Mobil Uygulama Wireframe", project: "Fintech App UI", deadline: "15 Kasım 2026", status: "Yapılacak" as TaskStatus, earning: 8500 },
  { id: "TSK-086", title: "Blog İçeriği: 'Nasıl Freelancer Olunur?'", project: "İçerik Stratejisi", deadline: "01 Kasım 2026", status: "Tamamlandı" as TaskStatus, earning: 800 }
];
