"use client";

import type { ReactNode } from "react";
import type { NavigationState } from "@/domains/partnerships/_shared/shell/types/navigation";
import { PartnersPageShell } from "@/domains/partnerships/community/shared/components/CommunityPageShell";

const settingsNavPreset: Partial<NavigationState> = {
  activeDrawerSection: "settings",
  activeTab: "quick-actions",
  previousTab: "quick-actions",
};

type SettingsPageShellProps = {
  children: ReactNode;
  initialState?: Partial<NavigationState>;
  /** Render the full partners shell. Disable when the route layout already provides it. */
  withShell?: boolean;
};

export function SettingsPageShell({ children, initialState, withShell = false }: SettingsPageShellProps) {
  if (!withShell) {
    return <>{children}</>;
  }
  return <PartnersPageShell initialState={{ ...settingsNavPreset, ...initialState }}>{children}</PartnersPageShell>;
}
