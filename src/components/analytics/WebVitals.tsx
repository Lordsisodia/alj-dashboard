"use client";

import { useEffect } from "react";
import type { CLSMetric, INPMetric, LCPMetric, Metric, TTFBMetric } from "web-vitals";

type WebVitalsCallback = (metric: Metric | CLSMetric | LCPMetric | INPMetric | TTFBMetric) => void;

type WebVitalsModule = {
  onCLS?: (cb: WebVitalsCallback) => void;
  onLCP?: (cb: WebVitalsCallback) => void;
  onTTFB?: (cb: WebVitalsCallback) => void;
  onINP?: (cb: WebVitalsCallback) => void;
  onFID?: (cb: WebVitalsCallback) => void;
};

export default function WebVitals() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // web-vitals v5 exposes onCLS, onLCP, onTTFB, onINP
        // onFID was removed in v5; keep a safe fallback if present.
        const mod = (await import("web-vitals")) as WebVitalsModule;
        const { onCLS, onLCP, onTTFB, onINP } = mod;
        const maybeOnFID = mod.onFID;
        const log: WebVitalsCallback = (metric) => {
          if (cancelled) return;
          // eslint-disable-next-line no-console
          console.log("[WebVitals]", metric.name, Math.round(metric.value), metric);
        };
        onCLS?.(log);
        onLCP?.(log);
        onTTFB?.(log);
        onINP?.(log);
        // Call onFID only if this version still exports it (v4)
        maybeOnFID?.(log);
      } catch (err) {
        // Swallow vitals errors in dev; never break the app
        // eslint-disable-next-line no-console
        console.warn("WebVitals init failed:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}
