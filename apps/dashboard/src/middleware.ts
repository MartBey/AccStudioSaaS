/* eslint-disable simple-import-sort/imports */
import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import { domainManager } from '@/lib/domain-manager';


import { DomainCache } from './lib/domain-cache';

async function getSiteByDomain(hostname: string): Promise<{ siteId: string; subdomain?: string } | null> {
  // 1. Check cache first
  const cached = DomainCache.get(hostname);
  if (cached) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DomainCache] Hit: ${hostname} -> ${cached.siteId}`);
    }
    return cached;
  }

  try {
    // Middleware'de mutlak URL kullanımı gereklidir
    const url = new URL(`${process.env.AUTH_URL || 'http://localhost:3000'}/api/sites/by-domain?hostname=${hostname}`);
    const res = await fetch(url.toString(), {
      next: { revalidate: 300 } // Fetch level cache as backup
    });
    
    if (res.ok) {
      const data = await res.json();
      if (data) {
        // 2. Update cache
        DomainCache.set(hostname, data);
        return data;
      }
    }
    return null;
  } catch (error) {
    console.error('getSiteByDomain error:', error);
    return null;
  }
}

export default auth(async function middleware(req) {
  const domainInfo = domainManager.analyzeDomain(req);
  const { pathname } = req.nextUrl;

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Middleware] Request: ${req.headers.get('host')} ${pathname} -> Type: ${domainInfo.type}`);
  }

  // 1. Statik dosyaları geç
  if (domainManager.isStaticFile(pathname)) {
    return NextResponse.next();
  }

  // 2. Upload dosyalarını API'ye yönlendir
  if (domainManager.isUploadFile(pathname)) {
    const rewriteUrl = new URL('/api/uploads' + pathname.replace('/uploads', ''), req.url);
    return NextResponse.rewrite(rewriteUrl);
  }

  // 3. Admin domain
  if (domainInfo.type === 'admin') {
    // Admin paneli için auth kontrolü authConfig'de (authorized callback) hallediliyor
    return NextResponse.next();
  }

  // 4. Accounts domain
  if (domainInfo.type === 'accounts') {
    // Sadece belirli rotalara izin ver
    if (!pathname.startsWith('/site-login') && 
        !pathname.startsWith('/site-list') && 
        !pathname.startsWith('/api/auth') &&
        pathname !== '/') {
      return NextResponse.redirect(new URL('/site-login', req.url));
    }
    return NextResponse.next();
  }

  // 5. Subdomain veya custom domain
  if (domainInfo.type === 'subdomain' || domainInfo.type === 'custom') {
    const site = await getSiteByDomain(domainInfo.hostname);
    
    if (!site) {
      // Site bulunamadı - 404 veya özel bir landing page
      return NextResponse.rewrite(new URL('/404', req.url));
    }

    // Header'a site ID'sini ekle (Uygulama içinde kullanım için)
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-site-id', site.siteId.toString());

    // Login sayfası yönlendirmesi
    if (pathname === '/login') {
      const accountsUrl = domainInfo.isDev 
        ? 'http://accounts.accstudio.local:3000/site-login'
        : 'https://accounts.accstudio.co/site-login';
      return NextResponse.redirect(new URL(accountsUrl));
    }

    // Subdomain ise rewrite yap (/site/[subdomain]/...)
    if (domainInfo.type === 'subdomain' && site.subdomain) {
      const rewriteUrl = `/site/${site.subdomain}${pathname}`;
      return NextResponse.rewrite(new URL(rewriteUrl, req.url), {
        request: { headers: requestHeaders }
      });
    }

    // Custom domain için de artık /site/[siteId]/... yapısına rewrite yapıyoruz
    // Bu sayede root'taki app/page.tsx ile çakışmıyor.
    if (domainInfo.type === 'custom') {
      const rewriteUrl = `/site/${site.siteId}${pathname}`;
      return NextResponse.rewrite(new URL(rewriteUrl, req.url), {
        request: { headers: requestHeaders }
      });
    }

    return NextResponse.next({
      request: { headers: requestHeaders }
    });
  }


  // 6. Ana domain - accounts'a yönlendir (opsiyonel, tercihe göre değişebilir)
  // Dev: localhost:3000 üzerinden erişimde yönlendirmeyi iptal ediyoruz ki proje direkt açılabilsin
  if (domainInfo.type === 'main' && pathname === '/' && domainInfo.hostname !== 'localhost:3000') {
    const accountsUrl = domainInfo.isDev
      ? 'http://accounts.accstudio.local:3000'
      : 'https://accounts.accstudio.co';
    return NextResponse.redirect(new URL(accountsUrl));
  }


  return NextResponse.next();
});

export const config = {
  // matcher: middleware'in hangi rotalarda çalışacağını belirler
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};

