import { describe, expect, it } from "vitest";
import { PortfolioClientSchema, PortfolioIndexSchema } from "../schema";

describe("PortfolioClientSchema", () => {
  it("parses minimal client", () => {
    const parsed = PortfolioClientSchema.safeParse({
      id: "c1",
      name: "Client",
      industry: "saas",
      techStack: { frontend: [], backend: [], database: [], hosting: [], tools: [] },
      metadata: { featured: false, showInPortfolio: true },
      media: { screenshots: { desktop: [], mobile: [], features: [] } },
    });
    expect(parsed.success).toBe(true);
  });

  it("fails on missing id", () => {
    const parsed = PortfolioClientSchema.safeParse({ name: "Client" });
    expect(parsed.success).toBe(false);
  });
});

describe("PortfolioIndexSchema", () => {
  it("parses index with clients array", () => {
    const parsed = PortfolioIndexSchema.safeParse({ stats: {}, clients: [] });
    expect(parsed.success).toBe(true);
  });
});

