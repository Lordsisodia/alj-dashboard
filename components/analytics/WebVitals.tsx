"use client";

import { useEffect } from "react";
import type { Metric } from "web-vitals";

export default function WebVitals() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mod = await import("web-vitals");
        const { onCLS, onLCP, onTTFB, onINP } = mod;
        const maybeOnFID = (mod as any).onFID as undefined | ((cb: (metric: Metric) => void) => void);
        const endpoint = process.env.NEXT_PUBLIC_VITALS_ENDPOINT || "/api/vitals";
        const log = (metric: Metric) => {
          if (cancelled) return;
          // eslint-disable-next-line no-console
          console.log("[WebVitals]", metric.name, Math.round(metric.value), metric);
          if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
            try {
              const blob = new Blob([JSON.stringify(metric)], { type: 'application/json' });
              navigator.sendBeacon(endpoint, blob);
            } catch {}
          }
        };
        onCLS?.(log);
        onLCP?.(log);
        onTTFB?.(log);
        onINP?.(log);
        // onFID existed in v4; noop in v5
        maybeOnFID?.(log);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("[WebVitals] init failed", err);
      }
    })();
    return () => { cancelled = true; };
  }, []);
  return null;
}
