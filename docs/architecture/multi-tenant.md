## Multi-tenant Mimari (Özet)

- **Kullanıcı**: `User` modeli, `role` alanı ile BRAND / AGENCY / FREELANCER / ADMIN ayrımını tutar.
- **Profil**: `Profile` modeli, kullanıcıya ait detaylar ve role özgü modellerle (`Brand`, `Agency`, `Freelancer`) bağlantıyı taşır.
- **Siteler**: `Site`, `Domain` ve ilgili modeller ile marka/ajans başına çoklu site ve domain yönetimi hedeflenir.

Bu dosya, ileride tenant kimliği (`tenantId` veya `Organization` modeli) ve modül bazlı abonelik (`OrganizationModuleSubscription`) eklentileri ile genişletilecektir.

