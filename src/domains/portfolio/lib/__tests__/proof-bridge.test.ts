import { describe, expect, it } from "vitest";
import { PORTFOLIO_ROUTES } from "../../constants";
import { groupProofLinksByIndustry, mapClientToProofAsset, toProofLink } from "../proof-bridge";

const mockClient = {
  id: "acme-co",
  name: "Acme Co",
  industry: "food-beverage",
  tagline: "Fast launches",
  description: "Proof",
  liveUrl: "https://example.com",
  projectType: "Web App",
  status: "Live",
  launchDate: "2025-01-01",
  timeline: { durationDays: 14, phases: [] },
  pricing: { currency: "USD", min: 5000, max: 12000, sisoPrice: 7000 },
  features: { key: [], technical: [], integrations: [] },
  techStack: { frontend: [], backend: [], database: [], hosting: [], tools: [] },
  media: { logo: "/logo.svg", screenshots: { desktop: ["/hero.png"] } },
  metadata: { featured: true, showInPortfolio: true, seoTitle: "", seoDescription: "", tags: ["tag"], industry: "food-beverage" },
} as const;

describe("proof-bridge", () => {
  it("maps client to proof asset", () => {
    const proof = mapClientToProofAsset(mockClient);
    expect(proof.id).toBe(mockClient.id);
    expect(proof.industries).toEqual([mockClient.industry]);
    expect(proof.tags).toEqual(mockClient.metadata.tags);
    expect(proof.ctaUrl).toBe(PORTFOLIO_ROUTES.publicClient(mockClient.industry, mockClient.id));
  });

  it("builds proof link with shared route helper", () => {
    const link = toProofLink(mockClient);
    expect(link).toEqual({
      label: mockClient.name,
      href: PORTFOLIO_ROUTES.publicClient(mockClient.industry, mockClient.id),
    });
  });

  it("groups proof links by industry", () => {
    const other = { ...mockClient, id: "bistro", name: "Bistro", industry: "tourism-activities" as const };
    const grouped = groupProofLinksByIndustry([mockClient, other]);
    expect(grouped["food-beverage"]?.[0].label).toBe("Acme Co");
    expect(grouped["tourism-activities"]?.[0].href).toBe(PORTFOLIO_ROUTES.publicClient("tourism-activities", "bistro"));
  });
});
