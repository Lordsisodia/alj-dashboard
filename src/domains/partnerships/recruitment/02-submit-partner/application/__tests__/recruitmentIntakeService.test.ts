// @vitest-environment node
import { describe, expect, it } from "vitest";
import { submitPartnerOptimistic } from "../recruitmentIntakeService";

describe("recruitment submit partner optimistic", () => {
  it("returns optimistic payload immediately", () => {
    const { optimistic } = submitPartnerOptimistic({
      companyName: "Opti",
      contactEmail: "opt@co.com",
      dealSizeEstimate: 5000,
      vertical: "saas",
    });

    expect(optimistic.intakeId).toBe("optimistic");
  });
});
