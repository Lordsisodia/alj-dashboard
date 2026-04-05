"use client";

import dynamic from "next/dynamic";
import type { MobileShellProps } from "./Shell";
import { stackedPanelClass, nestedCardClass } from "@/domains/partnerships/_shared/ui/theme/cardLayers";
import { cn } from "@/domains/shared/utils/cn";
import { TierProgressBackdrop } from "@/domains/partnerships/_shared/ui/backgrounds/TierProgressBackdrop";

const ClientMobileShell = dynamic(
  () => import("./Shell").then((mod) => mod.MobileShell),
  {
    ssr: false,
    loading: () => <MobileShellFallback />,
  },
);

export function LazyMobileShell(props: MobileShellProps) {
  return <ClientMobileShell {...props} />;
}

export function LazyShell(props: MobileShellProps) {
  return <ClientMobileShell {...props} />;
}

export default LazyMobileShell;

function MobileShellFallback() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-siso-bg-primary px-4 py-10 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden>
        <TierProgressBackdrop />
      </div>
      <div className="relative z-10 w-full max-w-sm">
        <div className={cn(stackedPanelClass, "space-y-4 p-5 text-center")}
        >
          <p className="text-[11px] uppercase tracking-[0.35em] text-white/60">Preparing shell</p>
          <div className="flex justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          </div>
          <div className="space-y-2 text-left">
            {[0, 1, 2].map((row) => (
              <div key={row} className={cn(nestedCardClass, "h-4 bg-white/10")} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
