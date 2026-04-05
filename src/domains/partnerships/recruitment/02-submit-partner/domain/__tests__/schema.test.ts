import { describe, expect, it } from "vitest";
import { parseSubmitPartnerPayload, parseSubmitPartnerResponse } from "../schema";

describe("submit partner schema", () => {
  it("parses partner payload", () => {
    const payload = {
      companyName: "Acme Recruiting",
      contactEmail: "talent@acme.com",
      dealSizeEstimate: 25000,
      vertical: "commerce",
      contactPhone: "+1-555-0101",
      website: "https://acme.com",
    };

    const parsed = parseSubmitPartnerPayload(payload);
    expect(parsed.companyName).toBe("Acme Recruiting");
  });

  it("parses partner response", () => {
    const response = { intakeId: "intake_xyz", status: "needs_review", estimatedSlaHrs: 12 };
    const parsed = parseSubmitPartnerResponse(response);
    expect(parsed.status).toBe("needs_review");
  });

  it("rejects bad email", () => {
    expect(() => parseSubmitPartnerPayload({ companyName: "Test", contactEmail: "bad", dealSizeEstimate: 1, vertical: "saas" })).toThrow();
  });
});
