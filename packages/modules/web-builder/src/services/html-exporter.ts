import { BuilderSite, BuilderNode, BlockType, ThemeConfig } from "../schema/builder-types";

export interface HtmlExportOptions {
  /** Site başlığı (title tag) */
  title?: string;
  /** Google Fonts import dahil edilsin mi */
  includeFonts?: boolean;
  /** Responsive meta tag dahil edilsin mi */
  responsive?: boolean;
  /** Inline CSS reset dahil edilsin mi */
  includeReset?: boolean;
}

const DEFAULT_OPTIONS: HtmlExportOptions = {
  title: "AccStudio Site",
  includeFonts: true,
  responsive: true,
  includeReset: true,
};

/**
 * BuilderSite JSON verisini bağımsız bir statik HTML dosyasına dönüştürür.
 * Google Fonts, CSS reset ve responsive meta tag'ler dahil edilir.
 */
export function exportSiteToHtml(site: BuilderSite, options: HtmlExportOptions = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const theme = site.themeConfig || {
    primaryColor: "#0f172a",
    secondaryColor: "#3b82f6",
    fontFamily: "Inter",
  };

  const fontLink = opts.includeFonts
    ? `<link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=${theme.fontFamily.replace(/ /g, "+")}:wght@400;500;600;700&display=swap" rel="stylesheet">`
    : "";

  const responsiveMeta = opts.responsive
    ? `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
    : "";

  const cssReset = opts.includeReset
    ? `
    <style>
      *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: '${theme.fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0f172a; line-height: 1.6; }
      img { max-width: 100%; height: auto; display: block; }
      a { color: inherit; text-decoration: none; }
      button { cursor: pointer; font-family: inherit; }
      
      /* Responsive utilities */
      .container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
      .flex-center { display: flex; align-items: center; justify-content: center; }
      .flex-col { display: flex; flex-direction: column; }
      .text-center { text-align: center; }
      
      /* Responsive grid */
      .grid-cols { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; }
      .grid-cols > * { flex: 1 1 280px; max-width: 340px; }
      
      @media (max-width: 768px) {
        .grid-cols > * { flex: 1 1 100%; max-width: 100%; }
        h1 { font-size: 32px !important; }
        h2 { font-size: 24px !important; }
        section { padding: 40px 16px !important; }
      }
    </style>`
    : "";

  const bodyHtml = site.nodes.map((node) => renderNode(node, theme)).join("\n");

  return `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    ${responsiveMeta}
    <title>${opts.title}</title>
    ${fontLink}
    ${cssReset}
</head>
<body>
${bodyHtml}
</body>
</html>`;
}

/**
 * Tek bir BuilderNode'u HTML string'ine dönüştürür (recursive).
 */
function renderNode(node: BuilderNode, theme: ThemeConfig): string {
  switch (node.type) {
    case BlockType.Hero:
      return renderHero(node, theme);
    case BlockType.AnimatedHero:
      return renderAnimatedHero(node, theme);
    case BlockType.Features:
      return renderFeatures(node, theme);
    case BlockType.Pricing:
      return renderPricing(node, theme);
    case BlockType.Testimonial:
      return renderTestimonial(node, theme);
    case BlockType.Contact:
      return renderContact(node, theme);
    case BlockType.Footer:
      return renderFooter(node, theme);
    case BlockType.Image:
      return renderImage(node);
    case BlockType.Text:
      return renderText(node);
    case BlockType.Button:
      return renderButton(node, theme);
    case BlockType.VideoReview:
      return renderVideoReview(node);
    case BlockType.Container:
      return renderContainer(node, theme);
    default:
      return `<!-- Unknown block type: ${node.type} -->`;
  }
}

function renderHero(node: BuilderNode, theme: ThemeConfig): string {
  const { title, subtitle, primaryButtonText, secondaryButtonText, align } = node.props;
  return `
    <section style="padding: 100px 20px; text-align: ${align || "center"}; background: linear-gradient(135deg, ${theme.primaryColor}, ${theme.primaryColor}ee);">
      <div class="container">
        <h1 style="font-size: 48px; font-weight: 700; color: #ffffff; margin-bottom: 16px; line-height: 1.2;">${title || ""}</h1>
        ${subtitle ? `<p style="font-size: 18px; color: rgba(255,255,255,0.8); max-width: 600px; margin: 0 auto 32px; line-height: 1.6;">${subtitle}</p>` : ""}
        <div style="display: flex; gap: 12px; justify-content: ${align === "left" ? "flex-start" : "center"}; flex-wrap: wrap;">
          ${primaryButtonText ? `<a href="#" style="display: inline-block; padding: 14px 32px; background: ${theme.secondaryColor}; color: #fff; border-radius: 8px; font-weight: 600; font-size: 16px; transition: opacity 0.2s;">${primaryButtonText}</a>` : ""}
          ${secondaryButtonText ? `<a href="#" style="display: inline-block; padding: 14px 32px; background: transparent; color: #fff; border: 2px solid rgba(255,255,255,0.3); border-radius: 8px; font-weight: 600; font-size: 16px;">${secondaryButtonText}</a>` : ""}
        </div>
      </div>
    </section>`;
}

function renderAnimatedHero(node: BuilderNode, theme: ThemeConfig): string {
  const { title, subtitle, badge, primaryButtonText, secondaryButtonText } = node.props;
  return `
    <section style="padding: 120px 20px; background: #0a0a0a; text-align: center;">
      <div class="container">
        ${
          badge
            ? `<div style="display: inline-block; padding: 6px 16px; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); backdrop-filter: blur(8px); margin-bottom: 24px;">
          <span style="font-size: 14px; font-weight: 500; color: #a78bfa;">${badge}</span>
        </div>`
            : ""
        }
        <h1 style="font-size: 64px; font-weight: 700; color: #ffffff; margin-bottom: 24px; line-height: 1.2;">${title || ""}</h1>
        ${subtitle ? `<p style="font-size: 20px; color: #a1a1aa; max-width: 672px; margin: 0 auto 32px; line-height: 1.6;">${subtitle}</p>` : ""}
        <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
          ${primaryButtonText ? `<a href="#" style="display: inline-block; padding: 14px 32px; background: ${theme.secondaryColor}; color: #fff; border-radius: 8px; font-weight: 600; font-size: 16px; transition: opacity 0.2s;">${primaryButtonText}</a>` : ""}
          ${secondaryButtonText ? `<a href="#" style="display: inline-block; padding: 14px 32px; background: transparent; color: #fff; border: 2px solid rgba(255,255,255,0.2); border-radius: 8px; font-weight: 600; font-size: 16px;">${secondaryButtonText}</a>` : ""}
        </div>
      </div>
    </section>`;
}

function renderFeatures(node: BuilderNode, theme: ThemeConfig): string {
  const { title, subtitle, features } = node.props;
  const featureItems = (features || []) as { title: string; description: string }[];
  return `
    <section style="padding: 80px 20px; background: #ffffff;">
      <div class="container text-center">
        <h2 style="font-size: 32px; font-weight: 700; color: ${theme.primaryColor}; margin-bottom: 8px;">${title || ""}</h2>
        ${subtitle ? `<p style="font-size: 16px; color: #64748b; margin-bottom: 48px;">${subtitle}</p>` : '<div style="margin-bottom: 48px;"></div>'}
        <div class="grid-cols">
          ${featureItems
            .map(
              (f) => `
            <div style="padding: 32px 24px; background: #f8fafc; border-radius: 12px; text-align: left;">
              <h3 style="font-size: 18px; font-weight: 600; color: ${theme.primaryColor}; margin-bottom: 12px;">${f.title}</h3>
              <p style="font-size: 14px; color: #64748b; line-height: 1.6;">${f.description}</p>
            </div>`
            )
            .join("")}
        </div>
      </div>
    </section>`;
}

function renderPricing(node: BuilderNode, theme: ThemeConfig): string {
  const { title, subtitle, plans } = node.props;
  const planItems = (plans || []) as {
    name: string;
    price: string;
    features: string[];
    highlighted?: boolean;
    ctaText?: string;
  }[];
  return `
    <section style="padding: 80px 20px; background: #f8fafc;">
      <div class="container text-center">
        <h2 style="font-size: 32px; font-weight: 700; color: ${theme.primaryColor}; margin-bottom: 8px;">${title || ""}</h2>
        ${subtitle ? `<p style="font-size: 16px; color: #64748b; margin-bottom: 48px;">${subtitle}</p>` : '<div style="margin-bottom: 48px;"></div>'}
        <div class="grid-cols">
          ${planItems
            .map(
              (plan) => `
            <div style="padding: 32px 24px; background: #ffffff; border: ${plan.highlighted ? `2px solid ${theme.secondaryColor}` : "1px solid #e2e8f0"}; border-radius: 12px; text-align: center; position: relative; ${plan.highlighted ? "box-shadow: 0 4px 24px rgba(0,0,0,0.08);" : ""}">
              ${plan.highlighted ? `<span style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: ${theme.secondaryColor}; color: #fff; padding: 4px 16px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase;">Popular</span>` : ""}
              <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">${plan.name}</h3>
              <p style="font-size: 36px; font-weight: 700; color: ${theme.primaryColor}; margin-bottom: 24px;">${plan.price}</p>
              <ul style="list-style: none; margin-bottom: 24px; text-align: left;">
                ${plan.features.map((f) => `<li style="padding: 8px 0; font-size: 14px; color: #475569; border-bottom: 1px solid #f1f5f9;"><span style="color: ${theme.secondaryColor}; margin-right: 8px;">&#10003;</span>${f}</li>`).join("")}
              </ul>
              <a href="#" style="display: block; padding: 12px; border-radius: 8px; font-weight: 600; font-size: 14px; ${plan.highlighted ? `background: ${theme.secondaryColor}; color: #fff;` : `background: transparent; color: ${theme.secondaryColor}; border: 1px solid ${theme.secondaryColor};`}">${plan.ctaText || "Get Started"}</a>
            </div>`
            )
            .join("")}
        </div>
      </div>
    </section>`;
}

function renderTestimonial(node: BuilderNode, theme: ThemeConfig): string {
  const { quote, author, role, rating, avatarUrl, accentColor } = node.props;
  const starColor = accentColor || "#f59e0b";
  const ratingNum = rating || 0;
  const stars =
    ratingNum > 0
      ? `<div style="display: flex; gap: 4px; justify-content: center; margin-bottom: 16px;">${Array.from(
          { length: 5 }
        )
          .map(
            (_, i) =>
              `<span style="font-size: 22px; color: ${i < ratingNum ? starColor : "#e2e8f0"};">&#9733;</span>`
          )
          .join("")}</div>`
      : "";
  return `
    <section style="padding: 80px 20px; background: ${node.props.backgroundColor || "#ffffff"};">
      <div class="container text-center" style="max-width: 700px;">
        ${stars}
        <blockquote style="font-size: 20px; font-style: italic; color: #334155; line-height: 1.6; margin-bottom: 24px;">
          &ldquo;${quote || ""}&rdquo;
        </blockquote>
        <div style="display: flex; align-items: center; gap: 12px; justify-content: center;">
          ${avatarUrl ? `<img src="${avatarUrl}" alt="${author}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;">` : `<div style="width: 48px; height: 48px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #64748b;">${(author || "?").charAt(0).toUpperCase()}</div>`}
          <div style="text-align: left;">
            <p style="font-weight: 600; font-size: 15px;">${author || ""}</p>
            <p style="font-size: 13px; color: #64748b;">${role || ""}</p>
          </div>
        </div>
      </div>
    </section>`;
}

function renderContact(node: BuilderNode, theme: ThemeConfig): string {
  const { title, subtitle, email, phone, accentColor } = node.props;
  const btnColor = accentColor || theme.secondaryColor;
  return `
    <section style="padding: 80px 20px; background: ${node.props.backgroundColor || "#f8fafc"};">
      <div class="container text-center">
        <h2 style="font-size: 32px; font-weight: 700; color: ${theme.primaryColor}; margin-bottom: 8px;">${title || ""}</h2>
        ${subtitle ? `<p style="font-size: 16px; color: #64748b; margin-bottom: 40px; max-width: 500px; margin-left: auto; margin-right: auto;">${subtitle}</p>` : ""}
        <div style="display: flex; gap: 40px; flex-wrap: wrap; justify-content: center;">
          <form style="flex: 1 1 320px; max-width: 400px; display: flex; flex-direction: column; gap: 12px;" onsubmit="return false;">
            <input type="text" placeholder="Your Name" style="padding: 12px 16px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 14px;">
            <input type="email" placeholder="Your Email" style="padding: 12px 16px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 14px;">
            <textarea placeholder="Your Message" rows="4" style="padding: 12px 16px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 14px; resize: none;"></textarea>
            <button type="submit" style="padding: 12px 24px; border-radius: 8px; border: none; background: ${btnColor}; color: #fff; font-weight: 600; font-size: 14px;">Send Message</button>
          </form>
          <div style="flex: 1 1 220px; max-width: 300px; display: flex; flex-direction: column; gap: 20px; justify-content: center; text-align: left;">
            ${email ? `<div><p style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 4px;">Email</p><p style="font-size: 15px;">${email}</p></div>` : ""}
            ${phone ? `<div><p style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 4px;">Phone</p><p style="font-size: 15px;">${phone}</p></div>` : ""}
          </div>
        </div>
      </div>
    </section>`;
}

function renderFooter(node: BuilderNode, theme: ThemeConfig): string {
  const { text, links, backgroundColor, textColor } = node.props;
  const bgColor = backgroundColor || theme.primaryColor;
  const txtColor = textColor || "#94a3b8";
  const footerLinks = (links || []) as { label: string; url: string }[];
  return `
    <footer style="padding: 40px 20px; background: ${bgColor}; color: ${txtColor}; text-align: center;">
      <div class="container">
        ${footerLinks.length > 0 ? `<div style="display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; margin-bottom: 16px;">${footerLinks.map((l) => `<a href="${l.url}" style="font-size: 14px; color: ${txtColor}; text-decoration: underline; text-underline-offset: 4px;">${l.label}</a>`).join("")}</div>` : ""}
        <p style="font-size: 13px; opacity: 0.7;">${text || ""}</p>
      </div>
    </footer>`;
}

function renderImage(node: BuilderNode): string {
  const { src, alt, height, objectFit, borderRadius } = node.props;
  if (!src) {
    return `
    <section style="padding: 20px;">
      <div class="container">
        <div style="width: 100%; height: ${height || "300px"}; border-radius: ${borderRadius || "8px"}; background: #f1f5f9; border: 2px dashed #cbd5e1; display: flex; align-items: center; justify-content: center; color: #94a3b8;">Image Placeholder</div>
      </div>
    </section>`;
  }
  return `
    <section style="padding: 20px;">
      <div class="container">
        <img src="${src}" alt="${alt || ""}" style="width: 100%; height: ${height || "300px"}; object-fit: ${objectFit || "cover"}; border-radius: ${borderRadius || "8px"};">
      </div>
    </section>`;
}

function renderText(node: BuilderNode): string {
  const { text, fontSize, textAlign, color, fontWeight } = node.props;
  return `<p style="font-size: ${fontSize || "16px"}; text-align: ${textAlign || "left"}; color: ${color || "#0f172a"}; font-weight: ${fontWeight || "normal"}; padding: 5px 20px;">${text || ""}</p>`;
}

function renderButton(node: BuilderNode, theme: ThemeConfig): string {
  const { text, href } = node.props;
  return `<div style="padding: 10px 20px;"><a href="${href || "#"}" style="display: inline-block; padding: 12px 24px; background: ${theme.secondaryColor}; color: #fff; border-radius: 8px; font-weight: 600; font-size: 14px; text-decoration: none;">${text || "Button"}</a></div>`;
}

function renderVideoReview(node: BuilderNode): string {
  const { videoUrl, title } = node.props;
  if (!videoUrl) {
    return `
    <section style="padding: 40px 20px;">
      <div class="container text-center">
        <h3 style="font-size: 18px; margin-bottom: 16px;">${title || "Video"}</h3>
        <div style="width: 100%; aspect-ratio: 16/9; background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #94a3b8;">Video Placeholder</div>
      </div>
    </section>`;
  }
  // YouTube embed dönüşümü
  const videoId = videoUrl.includes("v=") ? videoUrl.split("v=")[1]?.split("&")[0] : videoUrl;
  return `
    <section style="padding: 40px 20px;">
      <div class="container text-center">
        <h3 style="font-size: 18px; margin-bottom: 16px;">${title || "Video"}</h3>
        <div style="position: relative; width: 100%; padding-bottom: 56.25%; border-radius: 8px; overflow: hidden;">
          <iframe src="https://www.youtube.com/embed/${videoId}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </div>
    </section>`;
}

function renderContainer(node: BuilderNode, theme: ThemeConfig): string {
  const childrenHtml = node.children
    ? node.children.map((child) => renderNode(child, theme)).join("\n")
    : "";
  return `
    <div style="padding: ${node.props.padding || "20px"}; margin: ${node.props.margin || "0"}; background: ${node.props.backgroundColor || "transparent"}; border-radius: ${node.props.borderRadius || "0"};">
      ${childrenHtml}
    </div>`;
}
