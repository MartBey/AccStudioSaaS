import { SocialPostRequest, SocialPostResponse } from "types";

// Mock database to persist during runtime locally (simulating a DB)
let mockPosts: SocialPostResponse[] = [
  {
    id: "post_1",
    content: "Yeni ofisimizde ilk gün heyecanı! Ekibimizle birlikte harika projelere imza atmaya hazırız. 🚀 #AccStudio #YeniBaşlangıçlar",
    platform: "linkedin",
    scheduledFor: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // Yesterday
    status: "published",
    mediaUrls: [],
    createdAt: new Date(),
  },
  {
    id: "post_2",
    content: "Yaz kampanyamız başladı! Web sitemizdeki tüm ürünlerde %20 indirim sizi bekliyor. 🔥 Kampanya linki profilde.",
    platform: "instagram",
    scheduledFor: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // In 2 hours
    status: "scheduled",
    mediaUrls: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30"],
    createdAt: new Date(),
  },
  {
    id: "post_3",
    content: "Sektörel raporumuzun 2026 sonuçları açıklandı. Detaylı analizler için hemen indirin.",
    platform: "twitter",
    scheduledFor: new Date(new Date().getTime() + 48 * 60 * 60 * 1000), // In 2 days
    status: "draft",
    mediaUrls: [],
    createdAt: new Date(),
  }
];

export async function fetchScheduledPosts(): Promise<SocialPostResponse[]> {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Sort by scheduledDate ascending
  return [...mockPosts].sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime());
}

export async function scheduleNewPost(request: SocialPostRequest): Promise<SocialPostResponse[]> {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const newPosts: SocialPostResponse[] = request.platforms.map((platform, idx) => ({
    id: `post_new_${Date.now()}_${idx}`,
    content: request.content,
    platform: platform,
    scheduledFor: request.scheduledFor || new Date(),
    status: request.scheduledFor && request.scheduledFor > new Date() ? 'scheduled' : 'published',
    mediaUrls: request.mediaUrls || [],
    createdAt: new Date(),
  }));

  // Append to our mock "database"
  mockPosts = [...mockPosts, ...newPosts];

  return newPosts;
}
