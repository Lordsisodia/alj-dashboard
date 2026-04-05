import { CommunityChannelTemplate } from "./CommunityChannelTemplate";
import { LazyPartnersPageShell } from "./LazyPartnersPageShell";
import { CommunityNavSync } from "./CommunityNavSync.client";
import type { CommunityChannelPreset } from "@/domains/partnerships/community/shared/data/channelPresets";
import type { NavigationState } from "@/domains/partnerships/_shared/shell/types/navigation";
import type { ReactNode } from "react";

type ChannelPageProps = {
  channel?: CommunityChannelPreset | null;
  isLoading?: boolean;
  error?: string | null;
  initialNavState?: Partial<NavigationState>;
  showFloatingNavButton?: boolean;
  /** Render the community shell chrome. Leave false when the parent layout already provides it. */
  withShell?: boolean;
  children?: ReactNode;
};

/**
 * Simple wrapper to render a channel page; consumers can pass data/flags only.
 */
export function ChannelPage({
  channel = null,
  isLoading,
  error,
  initialNavState,
  showFloatingNavButton = true,
  withShell = false,
  children,
}: ChannelPageProps) {
  const content = (
    <>
      <CommunityNavSync initialState={initialNavState} />
      {children ?? <CommunityChannelTemplate channel={channel} isLoading={isLoading} error={error} />}
    </>
  );

  if (!withShell) {
    return content;
  }

  return (
    <LazyPartnersPageShell
      initialState={{ activeDrawerSection: "community", ...initialNavState }}
      showFloatingNavButton={showFloatingNavButton}
    >
      {content}
    </LazyPartnersPageShell>
  );
}
