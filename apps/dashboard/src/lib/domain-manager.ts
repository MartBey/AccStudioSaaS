import { NextRequest } from "next/server";

export type DomainInfo = {
  type: "main" | "subdomain" | "custom" | "admin" | "accounts";
  subdomain?: string;
  hostname: string;
  pathname: string;
  isDev: boolean;
};

export class DomainManager {
  // Production domainleri
  private mainDomains = ["accstudio.co", "www.accstudio.co"];
  private adminDomains = ["admin.accstudio.co"];
  private accountsDomains = ["accounts.accstudio.co"];

  // Development domainleri
  private devMainDomains = ["accstudio.local", "localhost:3000"];
  private devAdminDomains = ["admin.accstudio.local"];
  private devAccountsDomains = ["accounts.accstudio.local"];

  analyzeDomain(req: NextRequest): DomainInfo {
    const hostname = req.headers.get("host") || "";
    const pathname = req.nextUrl.pathname;
    const isDev =
      process.env.NODE_ENV === "development" ||
      hostname.includes("localhost") ||
      hostname.includes(".local");

    // Admin domain kontrolü
    const adminCheck = isDev ? this.devAdminDomains : this.adminDomains;
    if (adminCheck.some((d) => hostname === d)) {
      return { type: "admin", hostname, pathname, isDev };
    }

    // Accounts domain kontrolü
    const accountsCheck = isDev ? this.devAccountsDomains : this.accountsDomains;
    if (accountsCheck.some((d) => hostname === d)) {
      return { type: "accounts", hostname, pathname, isDev };
    }

    // Subdomain kontrolü
    const subdomainPattern = isDev
      ? /^([a-z0-9-]+)\.accstudio\.local(?::\d+)?$/ // test.accstudio.local:3000
      : /^([a-z0-9-]+)\.accstudio\.co$/; // test.accstudio.co

    const subdomainMatch = hostname.match(subdomainPattern);
    if (subdomainMatch) {
      // admin, accounts gibi ayrılmış subdomainler zaten yukarıda yakalandı
      return {
        type: "subdomain",
        subdomain: subdomainMatch[1],
        hostname,
        pathname,
        isDev,
      };
    }

    // Custom domain kontrolü - veritabanında var mı bakılacak
    const mainCheck = isDev ? this.devMainDomains : this.mainDomains;
    if (!mainCheck.some((d) => hostname === d || hostname.startsWith(d + ":"))) {
      return { type: "custom", hostname, pathname, isDev };
    }

    // Ana domain
    return { type: "main", hostname, pathname, isDev };
  }

  isStaticFile(pathname: string): boolean {
    const staticExtensions = [
      ".css",
      ".js",
      ".png",
      ".jpg",
      ".svg",
      ".ico",
      ".json",
      ".txt",
      ".xml",
      ".webp",
      ".avif",
      ".mp4",
      ".webm",
      ".pdf",
    ];
    const staticPaths = ["/_next", "/assets", "/images", "/fonts", "/uploads"];
    return (
      staticPaths.some((p) => pathname.startsWith(p)) ||
      staticExtensions.some((ext) => pathname.includes(ext))
    );
  }

  isUploadFile(pathname: string): boolean {
    return pathname.startsWith("/uploads/");
  }

  createRewriteUrl(domainInfo: DomainInfo, pathname: string): string | null {
    // Statik dosyaları ve ana domain/admin/accounts rotalarını rewrite etmiyoruz
    if (this.isStaticFile(pathname) || ["main", "admin", "accounts"].includes(domainInfo.type)) {
      return null;
    }

    if (domainInfo.type === "subdomain" && domainInfo.subdomain) {
      // /site/subdomain/path formatı
      return `/site/${domainInfo.subdomain}${pathname}`;
    }

    if (domainInfo.type === "custom") {
      // Custom domainler için olduğu gibi bırak (catch-all yakalayacak)
      // Ancak sonsuz döngüyü önlemek için pathname '/' değilse veya özel bir flag eklenebilir
      // Aslında middleware NextResponse.next() dönerse normal akış devam eder.
      // Custom domain render'ı catch-all (page.tsx) içinde x-site-id header'ı ile yapılacak.
      return pathname;
    }

    return null;
  }
}

export const domainManager = new DomainManager();
