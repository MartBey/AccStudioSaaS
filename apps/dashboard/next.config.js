/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "ui",
    "database",
    "types",
    "config",
    "seo",
    "competitor",
    "content-ai",
    "web-builder",
    "social-hub",
  ],
  eslint: {
    // Build sırasında ESLint hatalarını kontrol et
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Build sırasında TypeScript hatalarını kontrol et
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
