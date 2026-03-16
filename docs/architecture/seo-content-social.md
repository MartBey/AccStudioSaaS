## SEO, Content-AI, Social Hub ve Competitor Modülleri (Özet)

- **SEO (`packages/modules/seo`)**
  - `services/analyze.ts`: Google PageSpeed Insights API üzerinden metrik ve sorun listesi üretir.
  - Dashboard, bu sonuçları SEO analiz ekranlarında skor ve öneri olarak gösterir.

- **Content-AI (`packages/modules/content-ai`)**
  - `services/generate.ts`: Gemini API ile içerik üretir.
  - Maliyet hesaplaması `config` paketindeki `AI_PRICING` ve `calculateCost` fonksiyonları ile yapılır ve `ContentResponse.estimatedCostUsd` alanına yansıtılır.

- **Social Hub (`packages/modules/social-hub`)**
  - `services/scheduler.ts`: Çoklu platform için gönderi planlama kontratını tanımlar; gerçek API entegrasyonları ileride bu katmanda uygulanacaktır.

- **Competitor (`packages/modules/competitor`)**
  - `services/scraper.ts`: Rakip URL için `seo` modülünün `analyzeUrl` fonksiyonunu kullanarak SEO metrikleri toplar.

