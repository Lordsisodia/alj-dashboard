import { describe, expect, it } from "vitest";
import { mapClientToPublicProject } from "../mappers";
import type { PortfolioClient } from "../../types";

const client: PortfolioClient = {
  id: "c1",
  name: "Client",
  industry: "saas" as any,
  tagline: "tag",
  description: "desc",
  projectType: "SaaS",
  status: "Live",
  launchDate: "2024-01-01",
  timeline: { durationDays: 30 },
  pricing: { currency: "USD", min: null, max: 10, sisoPrice: null },
  features: { key: ["a"], technical: [], integrations: [] },
  techStack: { frontend: ["react"], backend: [], database: [], hosting: [], tools: [] },
  media: { screenshots: { desktop: ["img"], mobile: [], features: [] } },
  metadata: { featured: true, showInPortfolio: true, seoTitle: "", seoDescription: "", tags: [] },
};

describe("mapClientToPublicProject", () => {
  it("maps client to public project shape", () => {
    const project = mapClientToPublicProject(client);
    expect(project.id).toBe("c1");
    expect(project.images.length).toBe(1);
    expect(project.estimated_value).toBe(10);
  });
});

