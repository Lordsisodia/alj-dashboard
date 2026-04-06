"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import type { NavigationState } from "@/domains/partnerships/_shared/shell/types/navigation";

const ClientShell = dynamic(() =>
  import("./CommunityPageShell").then((mod) => mod.PartnersPageShell),
{
  ssr: false,
  loading: () => (
    <div
      className="min-h-screen bg-siso-bg-primary text-siso-text-primary flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading community shell"
    >
      <div className="space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Loading community shell...</p>
        <div className="mx-auto h-6 w-32 rounded-full bg-white/10 animate-pulse" />
        <div className="mx-auto h-6 w-48 rounded-full bg-white/5 animate-pulse" />
      </div>
    </div>
  ),
}
);

interface LazyShellProps {
  children: ReactNode;
  initialState?: Partial<NavigationState>;
  showFloatingNavButton?: boolean;
}

export function LazyPartnersPageShell({ children, initialState, showFloatingNavButton }: LazyShellProps) {
  return (
    <ClientShell initialState={initialState} showFloatingNavButton={showFloatingNavButton}>
      {children}
    </ClientShell>
  );
}

export default LazyPartnersPageShell;
