# AccStudio

AccStudio, markalar, ajanslar ve freelancer'lar arasında köprü kuran, proje yönetimi ve gelişmiş SaaS araçları sunan bütünleşik bir platformdur.

## Teknoloji Yığını

- **Monorepo**: Turborepo + pnpm
- **Frontend**: Next.js 15+ (App Router) + TypeScript + Tailwind CSS
- **UI Kit**: Shadcn/ui + Deep Indigo teması
- **Veritabanı**: PostgreSQL + Prisma
- **Cache**: Redis
- **Auth**: NextAuth.js
- **State**: Zustand + TanStack Query

## Proje Yapısı

```
accstudio/
├── apps/
│   ├── dashboard/       # Ana kullanıcı arayüzü
│   └── landing/         # Pazarlama sitesi
├── packages/
│   ├── ui/              # Paylaşılan UI bileşenleri
│   ├── database/        # Prisma şeması ve client
│   ├── types/           # Ortak TypeScript tipleri
│   ├── config/          # Sabitler ve konfigürasyon
│   └── modules/
│       ├── seo/         # SEO analiz
│       ├── competitor/  # Rakip analizi
│       ├── content-ai/  # İçerik üretimi
│       ├── web-builder/ # Web sitesi oluşturucu
│       └── social-hub/  # Sosyal medya yönetimi
```

## Başlangıç

```bash
# Bağımlılıkları kur
pnpm install

# Veritabanı migrasyonu
pnpm db:migrate

# Geliştirme sunucusu
pnpm dev

# Tek uygulama çalıştır
pnpm --filter dashboard dev
```

## Kullanıcı Rolleri

- **Marka**: İş ilanı oluşturma, proje takibi, raporlama
- **Ajans**: Ekip yönetimi, proje yürütme, müşteri ilişkileri
- **Freelancer**: İş bulma, portföy yönetimi, görev takibi
