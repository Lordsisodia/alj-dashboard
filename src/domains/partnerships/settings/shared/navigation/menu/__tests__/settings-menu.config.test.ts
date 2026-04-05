import { describe, expect, it, vi } from "vitest";

vi.mock("../../routing/settings-route-registry", () => {
  const mockRoutes = [
    { id: "settings-devices", path: "/partners/settings/connected-devices", title: "Devices", menuLabel: "Devices", icon: () => null, group: "Account", status: "live" },
    { id: "settings-security", path: "/partners/settings/security", title: "Security", icon: () => null, group: "Privacy", status: "live" },
    { id: "settings-privacy", path: "/partners/settings/privacy", title: "Privacy", icon: () => null, group: "Privacy", status: "live" },
    { id: "settings-legal", path: "/partners/settings/legal", title: "Legal", icon: () => null, group: "Privacy", status: "live" },
    { id: "settings-integrations", path: "/partners/settings/integrations", title: "Integrations", icon: () => null, group: "Integrations", status: "live" },
  ];
  return { settingsRouteRegistry: mockRoutes };
});

import { SETTINGS_MENU_ITEMS, getGroupedSettingsMenuItems } from "../settings-menu.config";
import { SETTINGS_ROUTES } from "../../routes";

const findById = (id: string) => SETTINGS_MENU_ITEMS.find(item => item.id === id);

describe("settings menu config", () => {
  it("uses route map paths for live routes", () => {
    expect(findById("settings-devices")?.path).toBe(SETTINGS_ROUTES.devices);
    expect(findById("settings-security")?.path).toBe(SETTINGS_ROUTES.security);
    expect(findById("settings-privacy")?.path).toBe(SETTINGS_ROUTES.privacy);
    expect(findById("settings-legal")?.path).toBe(SETTINGS_ROUTES.legal);
    expect(findById("settings-integrations")?.path).toBe(SETTINGS_ROUTES.integrations);
  });

  it("groups items in defined order and keeps wallet in Financial", () => {
    const groups = getGroupedSettingsMenuItems();
    const financial = groups.find(g => g.key === "Financial");
    expect(financial?.items[0].id).toBe("wallet");
    const order = groups.map(g => g.key);
    expect(order.indexOf("Basics")).toBeLessThan(order.indexOf("Account"));
  });
});
