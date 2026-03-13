import { z } from "zod";

export const SeoReportSchema = z.object({
  url: z.string().url("Geçerli bir URL giriniz"),
  score: z.number().min(0).max(100),
  issues: z.array(
    z.object({
      type: z.enum(["error", "warning", "info"]),
      message: z.string(),
      element: z.string().optional(),
    })
  ),
  meta: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.string().optional(),
  }),
});

export type SeoReport = z.infer<typeof SeoReportSchema>;
