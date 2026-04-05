// @vitest-environment node
import { describe, expect, it } from "vitest";
import { mapSubmitClientPayload, mapSubmitClientResponse } from "../mappers";

describe("pipeline mappers", () => {
  it("maps submit payload", () => {
    const payload = mapSubmitClientPayload({
      companyName: "Test",
      contactEmail: "test@example.com",
      dealSizeEstimate: 1000,
      vertical: "saas",
    });
    expect(payload.companyName).toBe("Test");
  });

  it("maps submit response", () => {
    const res = mapSubmitClientResponse({ intakeId: "id", status: "received", estimatedSlaHrs: 6 });
    expect(res.intakeId).toBe("id");
  });
});
