import { describe, expect, it } from "vitest";
import {
  DealSummarySchema,
  PipelineOpsOverviewSchema,
  SubmitClientPayloadSchema,
  SubmitClientResponseSchema,
} from "../schema";

describe("pipeline ops schemas", () => {
  it("parses submit-client payload", () => {
    const payload = {
      companyName: "Brookstone Labs",
      contactEmail: "ops@brookstone.ai",
      contactPhone: "+1 555-1212",
      website: "https://brookstone.ai",
      socialLink: "https://linkedin.com/company/brookstone",
      dealSizeEstimate: 42000,
      notes: "Prefers async onboarding",
      vertical: "ai",
    };

    const parsed = SubmitClientPayloadSchema.parse(payload);
    expect(parsed.companyName).toBe("Brookstone Labs");
  });

  it("rejects invalid payload email", () => {
    const payload = {
      companyName: "Test",
      contactEmail: "not-an-email",
      dealSizeEstimate: 1000,
      vertical: "saas",
    };

    expect(() => SubmitClientPayloadSchema.parse(payload)).toThrow();
  });

  it("parses overview with deals", () => {
    const overview = {
      prospects: [
        {
          id: "prospect_1",
          company: "Northwind",
          contactName: "Elias Reed",
          contactEmail: "elias@northwind.io",
          nextAction: "Book demo",
          confidence: 0.5,
          stage: "prospect",
          status: "potential",
          owner: "Nova",
          tags: ["saas"],
          updatedAt: "2h ago",
        },
      ],
      activeDeals: [
        {
          id: "deal_1",
          company: "Aeon Retail",
          amount: 42000,
          stage: "proposal",
          agingDays: 9,
          lastActivityAt: "Today",
          health: "on_track",
          owner: "Nova",
        },
      ],
      recruitment: [
        {
          id: "invite_1",
          partnerName: "Olivia Trent",
          email: "olivia@revpilot.io",
          status: "accepted",
          rewardShareBps: 200,
          sentAt: "Nov 14",
        },
      ],
    };

    const parsed = PipelineOpsOverviewSchema.parse(overview);
    expect(parsed.activeDeals[0].stage).toBe("proposal");
  });

  it("rejects negative deal amount", () => {
    const deal = {
      id: "deal_x",
      company: "Test",
      amount: -10,
      stage: "won",
      agingDays: 1,
      lastActivityAt: "Today",
      health: "on_track",
      owner: "Cam",
    } as unknown;

    expect(() => DealSummarySchema.parse(deal)).toThrow();
  });

  it("parses submit-client response", () => {
    const response = { intakeId: "intake_123", status: "received", estimatedSlaHrs: 6 };
    const parsed = SubmitClientResponseSchema.parse(response);
    expect(parsed.estimatedSlaHrs).toBe(6);
  });
});
