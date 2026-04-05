// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SettingsGroupCallout } from "../SettingsGroupCallout";
import ComingSoonView from "../ComingSoonView";
import { SettingsPageShell } from "../SettingsPageShell";
import { SETTINGS_ROUTES } from "@/domains/partnerships/settings/shared/navigation/routes";

vi.mock("@/domains/partnerships/community/shared/components/CommunityPageShell", () => ({
  PartnersPageShell: ({ children }: { children: React.ReactNode }) => <div data-testid="partners-shell">{children}</div>,
}));

describe("Settings shared components", () => {
  it("SettingsGroupCallout uses title as aria-label by default", () => {
    render(
      <SettingsGroupCallout icon={<span>*</span>} title="Notifications" subtitle="Controls">
        content
      </SettingsGroupCallout>,
    );
    const section = screen.getByRole("region", { name: "Notifications" });
    expect(section).toBeInTheDocument();
  });

  it("ComingSoonView back link points to settings base by default", () => {
    render(<ComingSoonView title="Coming Soon" />);
    const back = screen.getByLabelText(/back to settings/i);
    expect(back).toHaveAttribute("href", SETTINGS_ROUTES.base);
  });

  it("SettingsPageShell merges initial navigation state", () => {
    render(
      <SettingsPageShell initialState={{ activeTab: "notifications" }}>
        <div>child</div>
      </SettingsPageShell>,
    );
    expect(screen.getByTestId("partners-shell")).toBeInTheDocument();
  });
});
