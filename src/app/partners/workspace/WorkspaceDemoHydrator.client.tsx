"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useHydrateOnView } from "@/domains/shared/hooks/useHydrateOnView";
import { stackedPanelClass, nestedCardClass } from "@/domains/partnerships/_shared/ui/theme/cardLayers";

const LazyWorkspacePanels = dynamic(() =>
  import("@/domains/partnerships/workspace/ui/WorkspacePanels").then((mod) => ({
    default: mod.WorkspacePanels,
  })),
);

export function WorkspaceDemoHydrator() {
  const { ref, hydrated } = useHydrateOnView<HTMLDivElement>({ rootMargin: "200px 0px" });

  return (
    <div ref={ref} aria-live="polite">
      {hydrated ? (
        <Suspense fallback={<WorkspaceDemoFallback />}>
          <LazyWorkspacePanels />
        </Suspense>
      ) : (
        <WorkspaceDemoFallback />
      )}
    </div>
  );
}

function WorkspaceDemoFallback() {
  return (
    <div className={stackedPanelClass}>
      <div className={`${nestedCardClass} flex items-center justify-between p-4 text-sm text-white/70`}>
        <span>Loading workspace demo...</span>
        <div className="h-2 w-24 rounded-full bg-white/10 animate-pulse" />
      </div>
    </div>
  );
}
