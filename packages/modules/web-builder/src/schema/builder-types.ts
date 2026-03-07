import { z } from "zod";

// 1. Kullanılabilir Temel Blok Tipleri (Enum)
export enum BlockType {
  Hero = "Hero",
  Features = "Features",
  Text = "Text",
  Image = "Image",
  Button = "Button",
  Footer = "Footer",
  Contact = "Contact",
  Testimonial = "Testimonial",
  Container = "Container",
  Pricing = "Pricing",
  VideoReview = "VideoReview",
}

// 2. Props (Stil ve İçerik) Şeması
// Esnek bir yapı için Record<string, any> mantığında ama
// AI'ın rahat anlayabilmesi için belirli alanları da spesifikleştirebiliriz.
export const BuilderNodePropsSchema = z
  .record(z.any())
  .describe(
    "Blok için gerekli içerik ve stil özellikleri (örn: title, subtitle, color, src)",
  );

// 3. Node (Düğüm) Şeması (Recursive yapı)
export type BuilderNode = {
  id: string;
  type: BlockType;
  props: Record<string, any>;
  children?: BuilderNode[];
};

// Zod schema for AI Generation to follow
export const BuilderNodeSchema: z.ZodType<BuilderNode> = z.lazy(() =>
  z.object({
    id: z
      .string()
      .describe(
        "Bu düğüm için benzersiz bir ID (UUID vb. olabilir, AI uydurabilir)",
      ),
    type: z
      .nativeEnum(BlockType)
      .describe("Kullanılacak bileşen türü (Örn: Hero, Features)"),
    props: BuilderNodePropsSchema,
    children: z
      .array(BuilderNodeSchema)
      .optional()
      .describe(
        "Bu bileşenin içine eklenecek alt bileşenler (Eğer parent-child destekliyorsa)",
      ),
  }),
);

// 4. Tema (Global Stiller) Şeması
export const ThemeConfigSchema = z.object({
  primaryColor: z.string().describe("Ana marka rengi (HEX)"),
  secondaryColor: z.string().describe("İkincil marka rengi (HEX)"),
  fontFamily: z
    .string()
    .describe("Kullanılacak Google Font ailesi (Örn: 'Inter', 'Roboto')"),
  borderRadius: z
    .string()
    .describe("Genel kenar yuvarlaklığı (Örn: '0.5rem', '8px')")
    .optional(),
});

export type ThemeConfig = z.infer<typeof ThemeConfigSchema>;

// 5. Root Site Şeması (Tüm Sitenin Temsili)
export const BuilderSiteSchema = z.object({
  themeConfig: ThemeConfigSchema.optional().describe(
    "Site geneli tema ayarları",
  ),
  nodes: z
    .array(BuilderNodeSchema)
    .describe(
      "Sitede yer alacak kök(root) düğümlerin listesi (Yukarıdan aşağıya sıralı)",
    ),
});

export type BuilderSite = z.infer<typeof BuilderSiteSchema>;
