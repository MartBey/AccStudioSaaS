import NodeCache from 'node-cache';

// TTL: 5 minutes (300 seconds)
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

export type CachedSite = {
  siteId: string;
  subdomain?: string;
};

export class DomainCache {
  static get(hostname: string): CachedSite | undefined {
    return cache.get<CachedSite>(hostname);
  }

  static set(hostname: string, siteData: CachedSite): void {
    cache.set(hostname, siteData);
  }

  static delete(hostname: string): void {
    cache.del(hostname);
  }
}
