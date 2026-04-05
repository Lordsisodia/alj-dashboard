"use client";

import { Suspense, type ReactNode } from "react";
import { useHydrateOnView } from "@/domains/shared/hooks/useHydrateOnView";

interface WidgetHydratorProps {
  fallback: ReactNode;
  children: ReactNode;
}

export function WidgetHydrator({ fallback, children }: WidgetHydratorProps) {
  const { ref, hydrated } = useHydrateOnView<HTMLDivElement>({ rootMargin: "200px 0px" });

  return (
    <div ref={ref} aria-busy={!hydrated}>
      {hydrated ? <Suspense fallback={fallback}>{children}</Suspense> : fallback}
    </div>
  );
}
