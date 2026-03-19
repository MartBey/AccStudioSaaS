## Web Builder Mimarisi (Özet)

- **Şema**: `packages/modules/web-builder/src/schema/builder-types.ts` içindeki `BuilderSite`, `BuilderNode` ve `BlockType` tipleri, sitenin yapısını tanımlar.
- **Servisler**:
  - `build.ts`: Template seçimi, tema uygulama ve preview HTML üretimi için kullanılır.
  - `ai-generator.ts`: Prompt tabanlı site iskeleti üretimi yapar.
  - `html-exporter.ts`: `BuilderSite` girdisinden statik HTML çıktısı oluşturur.
- **Dashboard Entegrasyonu**:
  - API route'ları: `apps/dashboard/src/app/api/builder/generate/route.ts` ve `.../export/route.ts`.
  - Ajans web-builder akışı: `apps/dashboard/src/app/(ajans)/ajans/web-builder/page.tsx` üzerinden başlar ve `web-builder` modül aksiyonlarını kullanır.
