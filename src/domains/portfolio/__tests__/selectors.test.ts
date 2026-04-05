import { describe, expect, it } from "vitest";
import { getFeaturedClients, getVisibleClients } from "../selectors";
import type { PortfolioClient } from "../types";

const baseClient: PortfolioClient = {
  id: "1",
  name: "Client",
  industry: "saas" as any,
  projectType: "SaaS",
  status: "Live",
  launchDate: "2024-01-01",
  pricing: { currency: "USD", min: null, max: null, sisoPrice: 10_000 },
  features: { key: [], technical: [], integrations: [] },
  techStack: { frontend: [], backend: [], database: [], hosting: [], tools: [] },
  media: { screenshots: { desktop: [], mobile: [], features: [] } },
  metadata: { featured: false, showInPortfolio: true, seoTitle: "", seoDescription: "", tags: [] },
};

describe("portfolio selectors", () => {
  it("filters out hidden clients", () => {
    const clients = [
      baseClient,
      { ...baseClient, id: "2", metadata: { ...baseClient.metadata, showInPortfolio: false } },
    ];
    const visible = getVisibleClients(clients);
    expect(visible).toHaveLength(1);
    expect(visible[0].id).toBe("1");
  });

  it("returns featured subset from visible list", () => {
    const clients = [
      baseClient,
      { ...baseClient, id: "2", metadata: { ...baseClient.metadata, featured: true } },
      { ...baseClient, id: "3", metadata: { ...baseClient.metadata, featured: true, showInPortfolio: false } },
    ];
    const featured = getFeaturedClients(clients);
    expect(featured.map((c) => c.id)).toEqual(["2"]);
  });
});
