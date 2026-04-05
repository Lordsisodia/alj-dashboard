"use client";

const ENDPOINT = "/api/portfolio-analytics";

type PortfolioEventPayload = Record<string, unknown>;

export function trackPortfolioEvent(name: string, payload: PortfolioEventPayload = {}) {
  if (typeof window === "undefined") return;
  const body = JSON.stringify({ name, payload, ts: Date.now() });

  if (navigator.sendBeacon) {
    try {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon(ENDPOINT, blob);
      return;
    } catch (err) {
      console.warn("portfolio analytics beacon failed", err);
    }
  }

  void fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch((error) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn("portfolio analytics fetch failed", error);
    }
  });
}
