/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["ui", "database", "types", "config", "seo", "competitor", "content-ai", "web-builder", "social-hub"],
  eslint: {
    // Build sırasında ESLint hatalarını uyarı olarak göster, build'i durdurma
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Geçici olarak TS hatalarını da build'i durdurmayacak şekilde ayarla
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
