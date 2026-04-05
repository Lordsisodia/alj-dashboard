import { describe, expect, it } from "vitest";
import { parseIntegration, parseIntegrations, IntegrationSchema } from "../schema";

const base = {
  id: "integration-1",
  name: "Slack",
  type: "slack" as const,
  connected: true,
  connectedAt: new Date("2025-11-20T12:00:00Z"),
  permissions: ["chat:write", "users:read"],
};

describe("IntegrationSchema", () => {
  it("parses a single integration", () => {
    const parsed = parseIntegration(base);
    expect(parsed.type).toBe("slack");
  });

  it("rejects unsupported integration type", () => {
    expect(() => IntegrationSchema.parse({ ...base, type: "asana" })).toThrow();
  });
});

describe("IntegrationsSchema", () => {
  it("parses a list of integrations", () => {
    const parsed = parseIntegrations([base]);
    expect(parsed).toHaveLength(1);
  });
});
