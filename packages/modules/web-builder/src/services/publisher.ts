export interface PageElement {
  id: string;
  type: "text" | "image" | "button" | "section";
  props: Record<string, any>;
  children?: PageElement[];
}

export interface WebsiteData {
  id: string;
  domain: string;
  pages: {
    id: string;
    path: string;
    title: string;
    elements: PageElement[];
  }[];
}

export async function publishWebsite(website: WebsiteData): Promise<{ success: boolean; url: string }> {
  // TODO: Implement actual publishing logic (e.g. to Vercel/Netlify)
  return {
    success: true,
    url: `https://${website.domain}.accstudio.site`
  };
}
