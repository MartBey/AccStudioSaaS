import { WebBuilderRequest, WebBuilderResponse } from "types";
import { TemplatesRegistry, TemplatesList } from "../templates";
import { BuilderSite } from "../schema/builder-types";
import { v4 as uuidv4 } from "uuid";

/**
 * Template ID'ye göre uygun template'i bulur.
 * Önce TemplatesList'te (metadata registry) arar, bulamazsa legacy registry'ye bakar.
 */
function resolveTemplate(templateId: string): BuilderSite | null {
  // 1. Metadata registry'den ara (id ile)
  const entry = TemplatesList.find(t => t.id === templateId);
  if (entry) return entry.template;

  // 2. Legacy registry'den ara (key name ile)
  const legacyKey = templateId as keyof typeof TemplatesRegistry;
  if (TemplatesRegistry[legacyKey]) return TemplatesRegistry[legacyKey];

  // 3. Fuzzy match: template ID'nin içinde anahtar kelime ara
  const idLower = templateId.toLowerCase();
  if (idLower.includes("agency") || idLower.includes("ajans")) return TemplatesRegistry.AgencyTemplate;
  if (idLower.includes("saas") || idLower.includes("software")) return TemplatesRegistry.SaaSTemplate;
  if (idLower.includes("ecommerce") || idLower.includes("shop") || idLower.includes("ticaret")) return TemplatesRegistry.ECommerceTemplate;
  if (idLower.includes("portfolio") || idLower.includes("freelancer")) return TemplatesRegistry.PortfolioTemplate;
  if (idLower.includes("restaurant") || idLower.includes("restoran") || idLower.includes("cafe") || idLower.includes("kafe")) return TemplatesRegistry.RestaurantTemplate;
  if (idLower.includes("event") || idLower.includes("etkinlik") || idLower.includes("lansman") || idLower.includes("summit")) return TemplatesRegistry.EventTemplate;

  return null;
}

/**
 * Tema renklerini template node'larına enjekte eder.
 * Hero, Contact, Footer gibi renk destekleyen bloklara kullanıcı renklerini uygular.
 */
function applyThemeToSite(site: BuilderSite, colors: { primary: string; secondary: string }): BuilderSite {
  return {
    ...site,
    themeConfig: site.themeConfig
      ? {
          ...site.themeConfig,
          primaryColor: colors.primary,
          secondaryColor: colors.secondary,
        }
      : {
          primaryColor: colors.primary,
          secondaryColor: colors.secondary,
          fontFamily: "Inter",
        },
    nodes: site.nodes.map((node) => ({
      ...node,
      props: {
        ...node.props,
        // Accent renklerini güncelle (varsa)
        ...(node.props.accentColor ? { accentColor: colors.primary } : {}),
      },
    })),
  };
}

/**
 * Landing page oluşturma servisi.
 * Template bulma, tema uygulama ve site verisi hazırlama işlemlerini yapar.
 */
export async function createLandingPage(request: WebBuilderRequest): Promise<WebBuilderResponse> {
  const siteId = `site_${uuidv4().substring(0, 8)}`;

  // 1. Template'i bul
  const baseTemplate = resolveTemplate(request.templateId);

  if (!baseTemplate) {
    // Fallback: Agency template kullan
    const fallbackTemplate = applyThemeToSite(TemplatesRegistry.AgencyTemplate, request.colors);
    return {
      id: siteId,
      previewUrl: `/builder/${siteId}`,
      status: "published",
      createdAt: new Date(),
      mockHtml: generatePreviewHtml(fallbackTemplate, request.brandDetails),
    };
  }

  // 2. Kullanıcı renklerini uygula
  const themedSite = applyThemeToSite(baseTemplate, request.colors);

  // 3. Preview HTML oluştur
  const previewHtml = generatePreviewHtml(themedSite, request.brandDetails);

  return {
    id: siteId,
    previewUrl: `/builder/${siteId}`,
    status: "published",
    createdAt: new Date(),
    mockHtml: previewHtml,
  };
}

/**
 * Basit bir HTML önizleme oluşturur (sonuç sayfası için).
 */
function generatePreviewHtml(site: BuilderSite, brandName: string): string {
  const primaryColor = site.themeConfig?.primaryColor || "#0f172a";
  const secondaryColor = site.themeConfig?.secondaryColor || "#3b82f6";
  const fontFamily = site.themeConfig?.fontFamily || "Inter";

  const sectionsHtml = site.nodes
    .map((node) => {
      switch (node.type) {
        case "Hero":
          return `
            <section style="padding: 80px 20px; text-align: ${node.props.align || "center"}; background: linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd);">
              <h1 style="font-size: 42px; font-weight: bold; color: #ffffff; margin-bottom: 16px;">${node.props.title || brandName}</h1>
              <p style="font-size: 18px; color: #ffffffcc; max-width: 600px; margin: 0 auto 24px;">${node.props.subtitle || ""}</p>
              ${node.props.primaryButtonText ? `<button style="padding: 12px 32px; background: ${secondaryColor}; color: #fff; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer;">${node.props.primaryButtonText}</button>` : ""}
            </section>`;
        case "Features":
          const features = node.props.features || [];
          return `
            <section style="padding: 60px 20px; background: #ffffff;">
              <h2 style="text-align: center; font-size: 28px; margin-bottom: 8px; color: ${primaryColor};">${node.props.title || "Features"}</h2>
              ${node.props.subtitle ? `<p style="text-align: center; color: #64748b; margin-bottom: 32px;">${node.props.subtitle}</p>` : ""}
              <div style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; max-width: 1000px; margin: 0 auto;">
                ${features.map((f: { title: string; description: string }) => `
                  <div style="flex: 1 1 250px; max-width: 300px; padding: 24px; background: #f8fafc; border-radius: 12px;">
                    <h3 style="font-size: 18px; font-weight: 600; color: ${primaryColor}; margin-bottom: 8px;">${f.title}</h3>
                    <p style="font-size: 14px; color: #64748b;">${f.description}</p>
                  </div>
                `).join("")}
              </div>
            </section>`;
        case "Footer":
          return `
            <footer style="padding: 32px 20px; background: ${primaryColor}; color: #94a3b8; text-align: center; font-size: 13px;">
              ${node.props.text || ""}
            </footer>`;
        default:
          return `<section style="padding: 40px 20px; text-align: center; color: #64748b;">[${node.type} Block]</section>`;
      }
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brandName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, "+")}:wght@400;600;700&display=swap" rel="stylesheet">
  <style>* { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: '${fontFamily}', sans-serif; }</style>
</head>
<body>${sectionsHtml}</body>
</html>`;
}

/**
 * Mevcut tüm template'lerin listesini döndürür (API veya UI tarafında kullanılmak üzere).
 */
export function getAvailableTemplates() {
  return TemplatesList.map(({ id, name, description, category }) => ({
    id,
    name,
    description,
    category,
  }));
}
