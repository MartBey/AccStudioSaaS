import { beforeEach,describe, expect, it } from "vitest";

import { DomainCache } from "./domain-cache";

describe("DomainCache", () => {
  const mockHostname = "example.com";
  const mockData = { siteId: "12345", subdomain: "example" };

  beforeEach(() => {
    DomainCache.delete(mockHostname);
  });

  it("should return undefined for a nonexistent hostname", () => {
    expect(DomainCache.get(mockHostname)).toBeUndefined();
  });

  it("should store and retrieve data correctly", () => {
    DomainCache.set(mockHostname, mockData);
    const result = DomainCache.get(mockHostname);

    expect(result).toBeDefined();
    expect(result?.siteId).toBe(mockData.siteId);
    expect(result?.subdomain).toBe(mockData.subdomain);
  });

  it("should delete cached data correctly", () => {
    DomainCache.set(mockHostname, mockData);
    DomainCache.delete(mockHostname);

    expect(DomainCache.get(mockHostname)).toBeUndefined();
  });
});
