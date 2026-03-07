import { BuilderSite } from "../schema/builder-types";

export type PublishStatus = "pending" | "building" | "published" | "failed";

export interface PublishRequest {
  siteId: string;
  domain?: string;
  site: BuilderSite;
}

export interface PublishResult {
  success: boolean;
  url: string;
  status: PublishStatus;
  publishedAt?: Date;
}

/**
 * Siteyi yayınlama servisi.
 * Gelecekte Vercel/Netlify API veya kendi hosting çözümüne bağlanacak.
 * Şu an için statik URL üretir ve durumu döndürür.
 */
export async function publishWebsite(request: PublishRequest): Promise<PublishResult> {
  const { siteId, domain, site } = request;

  // Validation
  if (!site.nodes || site.nodes.length === 0) {
    return {
      success: false,
      url: "",
      status: "failed",
    };
  }

  // Subdomain oluştur
  const subdomain = domain || siteId;
  const siteUrl = `https://${subdomain}.accstudio.site`;

  // TODO: Gerçek publish mantığı buraya eklenecek
  // 1. HTML export servisinden statik HTML al
  // 2. CDN/hosting'e yükle
  // 3. DNS kaydı oluştur (custom domain varsa)

  return {
    success: true,
    url: siteUrl,
    status: "published",
    publishedAt: new Date(),
  };
}

/**
 * Yayınlanmış sitenin durumunu kontrol eder.
 */
export async function getPublishStatus(siteId: string): Promise<PublishResult> {
  // TODO: Gerçek durum kontrolü (DB / hosting API)
  return {
    success: true,
    url: `https://${siteId}.accstudio.site`,
    status: "published",
  };
}
