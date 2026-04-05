import { describe, expect, it } from "vitest";
import { parseSubmitClientPayload, SubmitClientPayloadSchema } from "../schema";

const base = {
  companyName: "Acme Co",
  contactName: "Jane Doe",
  contactEmail: "jane@example.com",
  industry: "SaaS",
};

describe("SubmitClientPayloadSchema", () => {
  it("parses minimal valid payload", () => {
    const parsed = parseSubmitClientPayload(base);
    expect(parsed.companyName).toBe("Acme Co");
  });

  it("rejects invalid email", () => {
    expect(() => SubmitClientPayloadSchema.parse({ ...base, contactEmail: "bad" })).toThrow();
  });

  it("rejects missing company name", () => {
    expect(() => SubmitClientPayloadSchema.parse({ ...base, companyName: "" })).toThrow();
  });
});
