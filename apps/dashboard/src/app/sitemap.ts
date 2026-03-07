import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://accstudio.com";

export default function sitemap(): MetadataRoute.Sitemap {
  // Statik sayfalar
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/topluluk`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  // TODO: Dinamik sayfalar (vitrin, blog) veritabanından çekilecek
  // const vitrins = await prisma.vitrin.findMany({ select: { slug: true, updatedAt: true } });
  // const vitrinPages = vitrins.map(v => ({
  //   url: `${BASE_URL}/vitrin/${v.slug}`,
  //   lastModified: v.updatedAt,
  //   changeFrequency: "weekly" as const,
  //   priority: 0.7,
  // }));

  return [...staticPages];
}
