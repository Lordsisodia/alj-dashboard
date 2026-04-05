import { Integration } from "../domain/types";
import { IntegrationSchema, IntegrationsSchema } from "../domain/schema";

export interface IntegrationsService {
  list(): Promise<Integration[]>;
  connect(id: Integration["id"]): Promise<Integration | null>;
  disconnect(id: Integration["id"]): Promise<Integration | null>;
}

export class MockIntegrationsService implements IntegrationsService {
  private integrations = IntegrationsSchema.parse([
    {
      id: "slack",
      name: "Slack",
      type: "slack",
      connected: true,
      connectedAt: new Date("2025-11-20T12:00:00Z"),
      permissions: ["chat:write", "users:read"],
    },
    {
      id: "notion",
      name: "Notion",
      type: "notion",
      connected: false,
      permissions: ["database:read"],
    },
  ]);

  async list(): Promise<Integration[]> {
    return IntegrationsSchema.parse(this.integrations);
  }

  async connect(id: Integration["id"]): Promise<Integration | null> {
    const match = this.integrations.find(i => i.id === id);
    if (!match) return null;

    const updated = IntegrationSchema.parse({ ...match, connected: true, connectedAt: new Date() });
    this.integrations = this.integrations.map(i => (i.id === id ? updated : i));
    return updated;
  }

  async disconnect(id: Integration["id"]): Promise<Integration | null> {
    const match = this.integrations.find(i => i.id === id);
    if (!match) return null;

    const updated = IntegrationSchema.parse({ ...match, connected: false, connectedAt: undefined });
    this.integrations = this.integrations.map(i => (i.id === id ? updated : i));
    return updated;
  }
}

export function createMockIntegrationsService(): IntegrationsService {
  return new MockIntegrationsService();
}
