import { describe, expect, it } from "vitest";
import { toSubmitClientDto } from "../mapper";
import { parseSubmitClientPayload } from "../schema";

const base = {
  companyName: "Acme Co",
  contactName: "Jane Doe",
  contactEmail: "jane@example.com",
  industry: "SaaS",
  region: "NA",
  dealSize: 50000,
  notes: "Urgent",
  source: "referral",
};

describe("toSubmitClientDto", () => {
  it("maps fields to snake_case", () => {
    const payload = parseSubmitClientPayload(base);
    const dto = toSubmitClientDto(payload);
    expect(dto.company_name).toBe("Acme Co");
    expect(dto.contact_email).toBe("jane@example.com");
    expect(dto.deal_size).toBe(50000);
  });

  it("omits optional phone when missing", () => {
    const payload = parseSubmitClientPayload(base);
    const dto = toSubmitClientDto(payload);
    expect(dto.contact_phone).toBeUndefined();
  });
});
