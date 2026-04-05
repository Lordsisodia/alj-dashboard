import { describe, expect, it } from "vitest";
import { filterClients } from "../filter-clients";
import type { PortfolioClient } from "../../types";

const sample: PortfolioClient = {
  id: "1",
  name: "Client",
  industry: "saas" as any,
  tagline: "tag",
  description: "desc",
  projectType: "SaaS",
  status: "Live",
  launchDate: "2024-01-01",
  timeline: { durationDays: 10 },
  pricing: { currency: "USD", min: null, max: null, sisoPrice: 1 },
  features: { key: [], technical: [], integrations: [] },
  techStack: { frontend: ["react"], backend: [], database: [], hosting: [], tools: [] },
  media: { screenshots: { desktop: [], mobile: [], features: [] } },
  metadata: { featured: true, showInPortfolio: true, seoTitle: "", seoDescription: "", tags: [] },
};

describe("filterClients", () => {
  it("filters by industry", () => {
    const filtered = filterClients([sample], { industries: ["saas"] as any });
    expect(filtered).toHaveLength(1);
    const none = filterClients([sample], { industries: ["health"] as any });
    expect(none).toHaveLength(0);
  });
});

