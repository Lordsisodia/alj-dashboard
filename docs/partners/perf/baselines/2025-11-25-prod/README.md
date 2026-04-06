# 2025-11-25-prod baseline (trimmed sample)

- Build: `next build --webpack` (Nov 25 2025)
- Server: `next dev --port 3003` (cacheComponents enabled)
- Capture script: `ROUTE_LIMIT=15 ROUTE_TIMEOUT_MS=20000 POST_LOAD_DELAY_MS=250 npm run perf:baseline`
- Routes covered (15): /partners, /partners/academy, /partners/academy/certificates, /partners/academy/courses, /partners/academy/courses/siso-essentials-program, /partners/academy/courses/siso-introduction/intro-1, /partners/academy/industry/commerce, /partners/academy/pitch-kit, /partners/academy/pitch-kit/decks/standard, /partners/academy/portfolio, /partners/academy/saved, /partners/academy/training-spotlight, /partners/academy/xp-breakdown, /partners/campus, /partners/checklist.
- Artifacts: `trace-*.json`, `trace-metrics.json` (TTFB/LCP values embedded via WebVitals API logs per route).
- Known gaps: full 88-route sweep skipped due to timebox; add remaining routes in a follow-up sweep if needed.
- Observations: TTFB is ~0.6–1.7s on most academy pages; /partners root still ~2.9s TTFB and 5.2s LCP (needs shell/hero media follow-up).
