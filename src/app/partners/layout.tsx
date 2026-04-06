import type { ReactNode } from "react";
import { Fragment, Suspense } from "react";
import dynamic from "next/dynamic";
import { PartnerPerfMetrics } from "./PartnerPerfMetrics";
import { PartnershipsWaveBackdrop } from "@/domains/partnerships/_shared/ui/backgrounds/PartnershipsWaveBackdrop";

const LazyPartnersPageShell = dynamic(() => import("@/domains/partnerships/community/shared/components/LazyPartnersPageShell"));

export default function PartnersLayout({ children }: { children: ReactNode }) {
  return (
    <Fragment>
      {/* Wave backdrop scoped to /partners — removed from root layout to avoid wasted rAF on ISSO pages */}
      <PartnershipsWaveBackdrop
        position="fixed"
        className="-z-10"
        strokeColor="#ffc27d"
        waveBackgroundColor="transparent"
        waveOpacity={0.55}
        wavesClassName="h-full w-full"
        pointerSize={0.32}
        radialTop="#120b06"
        radialBase="#040404"
        overlayClassName="bg-gradient-to-b from-black/30 via-black/55 to-black/80"
        waveBlurPx={6}
        overlayBlurPx={2}
      />
      <PartnerPerfMetrics />
      <Suspense
        fallback={
          <div className="min-h-screen bg-siso-bg-primary text-siso-text-primary flex items-center justify-center">
            <div className="space-y-2 text-center">
              <div className="mx-auto h-6 w-32 rounded-full bg-white/10 animate-pulse" />
              <div className="mx-auto h-6 w-48 rounded-full bg-white/5 animate-pulse" />
            </div>
          </div>
        }
      >
        <LazyPartnersPageShell>{children}</LazyPartnersPageShell>
      </Suspense>
    </Fragment>
  );
}
