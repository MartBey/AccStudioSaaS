# AccStudio Agent Rules

## Proje Kuralları

- Tüm yeni özellikler önce `packages/modules/*` altında modül olarak tasarlanmalı, ardından `apps/dashboard` içinde kullanıma sunulmalı
- UI tutarlılığı: Deep Indigo renk paleti dışına çıkılmamalı, yeni bileşenler `packages/ui` paketine eklenmeli
- TypeScript strict mode, `any` tipi yasak
- Bileşenler varsayılan olarak Server Component, gerektiğinde `"use client"` direktifi eklenmeli
- Import sırası: Next/React → 3. parti → @/ alias → ui → database → modules → yerel dosyalar
- Tüm API route'larında Zod validasyonu zorunlu
- Dosya adlandırma: Bileşenler PascalCase, diğer dosyalar camelCase

## Monorepo Komutları

- `pnpm dev` — Tüm uygulamaları başlat (Turborepo)
- `pnpm --filter dashboard dev` — Sadece dashboard
- `pnpm --filter landing dev` — Sadece landing
- `pnpm build` — Production build
- `pnpm db:migrate` — Prisma migration
- `pnpm db:generate` — Prisma client generate
