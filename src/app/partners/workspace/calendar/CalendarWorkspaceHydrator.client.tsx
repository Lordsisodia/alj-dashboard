"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useHydrateOnView } from "@/domains/shared/hooks/useHydrateOnView";
import { stackedPanelClass, nestedCardClass } from "@/domains/partnerships/_shared/ui/theme/cardLayers";

// Calendar UI was removed from the portal-architecture package; render a lightweight placeholder
// to keep the route compiling until the new calendar module ships.
const LazyCalendarWorkspaceScreen = dynamic(
  async () => ({
    default: CalendarPlaceholder,
  }),
  { ssr: false },
);

export function CalendarWorkspaceHydrator() {
  const { ref, hydrated } = useHydrateOnView<HTMLDivElement>({ rootMargin: "200px 0px" });

  return (
    <div ref={ref} aria-live="polite">
      {hydrated ? (
        <Suspense fallback={<CalendarFallback />}>
          <LazyCalendarWorkspaceScreen />
        </Suspense>
      ) : (
        <CalendarFallback />
      )}
    </div>
  );
}

function CalendarFallback() {
  return (
    <div className={`${stackedPanelClass} p-4 text-sm text-white/70`}>
      <div className={`${nestedCardClass} flex flex-col gap-2 p-4`}>
        <span className="font-semibold text-white">Calendar</span>
        <span className="text-white/60">Calendar module will stream here once available.</span>
        <div className="h-2 w-24 rounded-full bg-white/10 animate-pulse" />
      </div>
    </div>
  );
}

function CalendarPlaceholder() {
  return <CalendarFallback />;
}
