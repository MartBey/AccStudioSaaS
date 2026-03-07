---
description: Nasıl yeni bir Dashboard Layout ve Panel iskeleti oluşturulur?
---

# Dashboard Layout ve Panel Oluşturma Rehberi

Bu workflow, projeye yeni bir rol (örn: Müşteri Temsilcisi) veya yeni bir modül (örn: Analitik Paneli) ekleneceği zaman, mevcut `DashboardLayout` ve `navigation.ts` standartlarını nasıl uygulayacağınızı gösterir.

## Adımlar

1. **Navigasyon Kurulumu**
   - `apps/dashboard/src/config/navigation.ts` dosyasına giderek yeni rol için bir `RoleConfig` dizisi ekleyin.
   - İkonları string formatında (örneğin `"LayoutDashboard"`) verin, böylece Next.js Server Components hatası fırlatmaz.

2. **Route Group İşkeleti İçin Layout Oluşturma**
   - `apps/dashboard/src/app/(yeni-rol)/layout.tsx` dosyasını oluşturun.
   - Dosyayı `DashboardLayout` bileşeni ile sarmalayın ve `navItems={navigationConfig.YENI_ROL}` prop'unu geçin.

3. **Genel Bakış Sayfası (Overview) Oluşturma**
   - `apps/dashboard/src/app/(yeni-rol)/page.tsx` (veya `/(yeni-rol)/yeni-rol/page.tsx` rotasyon çakışmalarını önlemek için) dosyasını oluşturun.
   - En üstte `"use client";` direktifi koymayı unutmayın.
   - Shadcn `Card` ve `lucide-react` ikonlarını kullanarak ana sayfa istatistik widget'larını tasarlayın.
   - Dummy (mock) verilerle en azından 4 adet gösterge kartı tasarlayın.

4. **Kullanıcı State (Opsiyonel)**
   - Eğer yeni role özel profil verileri veya sekmeli görünüm yapılacaksa `src/store/useUserStore.ts` içindeki `UserState` mock tipini güncelleyin.

// turbo-all 5. **Kurulum Kontrolü**

- Projenin ana root dizininde (`c:\AccStudioAGENT`) `pnpm build` komutunu çalıştırarak derleme hataları olup olmadığını doğrulayın.
