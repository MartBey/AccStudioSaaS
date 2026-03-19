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
    // ESLint is handled in Phase 1, ignore during build for now
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Build sırasında TypeScript hatalarını kontrol et
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
