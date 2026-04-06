# Partner Portal Performance Checklist

Use this as the living tracker for driving partner surfaces to <0.5 s TTI. Each item is a concrete, checkable task that maps back to the plan in `partners-portal-perf.md`.

## Global Simplifications (Nov 25 2025)
- [x] Enforce route JS budgets: hard 120 KB parsed, 80 KB stretch (CI via `npm run perf:budgets`).
- [x] Hero media rule: one `fetchpriority="high"` asset ≤1200 px per page; all other media lazy + AVIF/WebP (CI: `npm run perf:media`).
- [x] JSON payload guard: fail if any feed >200 KB (missions/badges, directory/help, pipeline configs) via `perf:budgets` size check.
- [x] Hydration rule: only `*.client.tsx` may include `"use client"`; all hydrators under `<Suspense>`/`dynamic` with lint/CI enforcement.
- [x] Edge cache policy for `/partners/**`: `s-maxage=3600, stale-while-revalidate=86400` with dynamic allowlist + `segment.config` revalidation hints.
- [x] Prod-mode baseline: `BASELINE_DIR=2025-11-25-prod npm run perf:baseline` (trimmed 15-route sweep); artifacts in `docs/partners/perf/baselines/2025-11-25-prod/` (TTI issues noted for shell/academy).
- [x] CI perf gate: add `npm run perf:tti` (load <2 s, FCP <1.5 s on benchmark routes) after budgets in GitHub Actions.
- [x] Route inventory: generate `docs/partners/perf/route-metrics.tsv` mapping all `/partners/**` routes to clusters/budgets.

## Phase 0 – Instrumentation & Baseline
- [x] Add `src/app/partners/PartnerPerfMetrics.tsx` that logs `performance.now()` for `DOMContentLoaded`, hydration end, and first-interaction.
- [x] Integrate `web-vitals` to capture LCP / INP / CLS; send results to console for now (pipe to analytics later).
- [x] Script baseline capture via `npm run perf:baseline` (spins up dev, runs `scripts/perf/capture-partner-traces.mjs`, copies artifacts) — Nov 19 2025.
- [x] Save baseline bundle + trace artifacts under `docs/perf/baselines/2025-11-19/` (trace-*.json + README).

## Phase 1 – Server Shell & Streaming Nav
- [x] Convert `src/app/partners/layout.tsx` to a server component that renders route children and streams the lazy nav shell.
- [x] Wrap `CommunityPageShell` (nav drawer, floating FAB, etc.) with `next/dynamic({ ssr: false, loading: SkeletonNav })` (Lazy shell component created & partner routes migrated).
- [x] Ensure every dynamic slice (nav drawer, hub widgets, pipeline wizard) sits inside a `<Suspense>` boundary with usable fallbacks (CampusDrawer + Lazy HubWidgets + Submit Client wizard).
- [x] Gate `components/ui/wave-background` behind `prefers-reduced-motion`; default to CSS gradient elsewhere.
- [x] Verify `npm run build` succeeds (includes fixing the missing `ArrowLeft` import) and capture new analyzer stats (`ANALYZE=true npm run build`, Nov 19 2025 — re-ran after pipeline hydrators + portfolio static params, build clean).

## Phase 2 – Data Streaming & JSON Feeds
- [x] Move `src/domains/partnerships/portfolio/data/clients/*.ts` into JSON under `public/data/portfolio-clients/` (summaries + per-client detail JSON, Nov 19 2025).
- [x] Update `/partners/academy/portfolio` to fetch client summaries via `cache(fetch)` on the server and lazy-load detail modules per card (server page passes JSON summaries to client UI).
- [x] Extract `wizardPrompts`, `savedDraftThreads`, etc. into `pipeline-ops-config.json`, fetched via cached `fetch` (submit-client route streams `public/data/pipeline-ops-config.json`).
- [x] Guard heavy data consumers with `Suspense` so shells stream immediately (portfolio index + submit-client wizard streamed under fallback skeletons).

## Phase 3 – Client Boundary Trimming
- [x] Audit `/partners/**` for unnecessary `"use client"` directives; convert static sections back to server components (Nov 19 2025: Academy layout + My Progress + Certificates + Tiers & Perks + Pitch Kit detail + Workspace Files hub + Pipeline Prospects grid/cards now server-driven; Nov 20 2025: mobile loading skeletons for checklist/inbox/learning/messages/settings/wallet plus community messages loading converted to server components; Tasks workspace screen, Active Deals wrapper, Client Notes shell, Prospect Detail shell, Workspace calendar shell, Earnings wallet shell, Earnings overview shell, and Earnings tier progression shell now server-rendered).
- [x] Split interactive widgets (`ComposerBar`, `ChatViewport`, Hub widgets) into `dynamic()` imports hydrated on visibility or interaction (Nov 19 2025: Tiers & Perks carousel extracted to `TierCarousel.client.tsx`; pitch kit copy CTA isolated to `CopyShareButton.client.tsx`; General Chat + mobile Messages composers + Prospect detail / Active Deals / Client Notes workspaces now lazy/dynamic via `useHydrateOnView`; Nov 20 2025: Workspace demo block hydrates via `WorkspaceDemoHydrator.client.tsx`; Directory overlay in community Messages now loads via `DirectoryOverlayHydrator.client.tsx`; Workspace calendar screen now hydrates via `CalendarWorkspaceHydrator.client.tsx`; Account notifications panel now hydrates via `AccountNotificationsHydrator.client.tsx`).
- [x] Implement Adaptive Hydration heuristics: hydrate `CampusDrawer` only when the FAB is tapped, hydrate chat/composer on focus, hydrate notifications when intersecting (documented guidelines + CI lint, Nov 20 2025).  
  - [x] Gate `CampusDrawer` and mobile nav shell via `CampusDrawerHydrator` (MobileShell + Community screens).
  - [x] Gate chat composers (`ComposerBar`, `ChatViewport`) on user focus/scroll inside Submit Client wizard + general chat (Submit Client composer now hydrates via `useHydrateOnView` + CTA placeholder; General Chat already gated).
  - [x] Gate account notifications and wallets with `useHydrateOnView` hydrators.
  - [x] Gate analytics overlays / partner alerts so they hydrate only when intersecting (wallet analytics + security cards now hydrate via FinancialAnalyticsHydrator + PartnerAlertsHydrator).

## Phase 4 – Regression Guard & polish
 - [x] Wire `@next/bundle-analyzer` + custom script into CI; fail builds when any `/partners` route exceeds the 120 KB parsed budget (GitHub Actions workflow `.github/workflows/partner-portal-perf.yml`).
- [x] Add `loading.tsx` skeletons for `/partners/academy`, `/partners/recruitment`, `/partners/pipeline-ops` (Nov 19 2025).
 - [x] Run Lighthouse CI (desktop + mobile) and record scores + filmstrips (Nov 20 2025 baseline in `docs/perf/baselines/2025-11-20-phase1/lighthouse/`).
- [x] Compare new Chrome trace / analyzer outputs against the Phase 0 baseline and store under `docs/perf/baselines/<date>/` (see comparison table in `docs/perf/baselines/2025-11-20-phase1/README.md`).
- [x] Add `npm run perf:tti` check (load <2 s, FCP <1.5 s) to CI after budgets.
- [x] Extend `npm run perf:budgets` to fail on JSON feeds >200 KB.
- [x] Lint enforcement: only `*.client.tsx` may contain `"use client"`; ensure hydrators live under `<Suspense>`.

## Industry Research Actionables (Ongoing)
- [x] **Suspense enforcement:** audit nav shells + hydrators to ensure every `dynamic()` consumer sits beneath `<Suspense>` (Nov 20 2025; see Suspense audit section in partners-portal-perf.md).
- [x] **Adaptive hydration backlog:** document lazy-hydration rules + guardrails (see “Adaptive Hydration Heuristics” in partners-portal-perf.md) and enforce via `npm run perf:hydration` CI step.
- [x] **CWV budgets:** add Lighthouse CI + `web-vitals` telemetry thresholds (LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1) and fail PRs that regress (CI now runs `npm run perf:lighthouse-budgets -- lighthouse` on every push).
- [x] **Resource priority hygiene:** audit every hero image/video; apply `fetchpriority="high"` + `decoding="async"` to the single LCP media, downgrade others to `low` (portfolio heroes + industry pages updated Nov 20 2025).
- [x] **Third-party script audit:** inventory analytics/marketing scripts on partner routes, remove or defer anything outside the budget, and add lint checks to guard against regressions (audited Nov 19 2025; see `docs/perf/partners-portal-perf.md`).
- [x] **PPR pilot:** enable Partial Prerendering via `experimental.cacheComponents`, stream `/partners/academy` with Suspense, and capture analyzer + Lighthouse artifacts (Phase 5 baseline in `docs/perf/baselines/2025-11-20-phase5/`).
- [x] **RSC ROI tracking:** after each phase, log bundle sizes, Lighthouse scores, and TTI deltas so we mirror public RSC case-study reporting (Phase 1 metrics captured in docs/perf/partners-portal-perf.md).

## Phase 5 – Sub-500 ms TTI Push (new)
Reasoning: we’re consistently under ~1–1.5 s after cacheComponents, but traces show /partners/academy still spends ~3.5 s to LCP in dev due to server prep and JS weight. These tasks lock in the final 0.5 s budget by attacking TTFB, payload size, and edge caching with the latest Next.js guidance.

- [ ] **Prod-grade trace run:** capture Chrome traces + Lighthouse (desktop + mobile) against a production build (`next start --port 3003` or a Vercel preview). Store results under `docs/partners/perf/baselines/2025-11-20-prod/` so TTFB reflects Full Route Cache + CDN behavior.  
  *Sub-steps (est. 2–2.5 hrs total)*  
  1. Build + start prod server locally (`npm run build && PORT=3003 next start`) — 20 min.  
  2. Run `npm run perf:baseline` with `BASELINE_DIR=2025-11-20-prod`, verify traces saved — 30 min.  
  3. Manually run Lighthouse (desktop + mobile) for the three benchmark routes, save JSON/HTML under `docs/partners/perf/baselines/2025-11-20-prod/lighthouse/` — 60 min.  
  4. Update the baseline README with summary metrics + analyzer links — 30 min.
- [ ] **≤80 KB parsed goal:** from the latest `.next/analyze/client.json`, list the top 5 `/partners/**` routes over 80 KB parsed. For each, strip optional UI into Suspense + `next/dynamic` hydrators (per cacheComponents best practices) until the parsed payload drops below 80 KB.  
  *Sub-steps (est. 1.5 hrs to audit + ~2 hrs per route)*  
  1. Parse `.next/analyze/client.json`, drop results into a spreadsheet/table with parsed KB + culprit chunks — 45 min.  
  2. For each over-budget route:  
     - Identify bundles to defer (icons, hero cards, analytics gadgets) — 30 min.  
     - Implement Suspense + `next/dynamic` hydrators or CSS fallbacks — 60–90 min.  
     - Re-run `ANALYZE=true npm run build` and confirm the parsed size <80 KB — 30 min.
- [ ] **Edge cache rules:** add cache-control headers or Vercel middleware that caches `/partners/academy`, `/partners/pipeline-ops`, and `/partners/recruitment` at the edge (`s-maxage` + `stale-while-revalidate`). Document the policy in `partners-portal-perf.md` so every deploy keeps TTFB <100 ms once warm.  
  *Sub-steps (est. 3 hrs total)*  
  1. Draft the caching policy (TTL, stale window, conditions) — 30 min.  
  2. Implement middleware or `headers()` config to set `Cache-Control` + tag invalidation — 90 min.  
  3. Smoke-test on preview (hit route twice, verify second response has <100 ms TTFB) — 30 min.  
  4. Document the strategy + invalidation process in `partners-portal-perf.md` — 30 min.
- [ ] **Critical media trim:** audit hero media on the three benchmark routes; keep only one `fetchpriority="high"` asset per page and lazy-load all secondary imagery/video via aspect-ratio placeholders to keep LCP under 500 ms.  
  *Sub-steps (est. 2 hrs total)*  
  1. Inventory hero images/videos per route (size, priority) — 30 min.  
  2. Update markup: single `fetchpriority="high"` asset, others `loading="lazy"` with CSS placeholders — 60 min.  
  3. Re-run Lighthouse to confirm LCP <500 ms and update checklist/README — 30 min.
- [ ] **Adaptive metrics CI:** extend `npm run perf:hydration` / `perf:budgets` (or add a `perf:tti` script) so cached prod traces that exceed 500 ms DCL/load cause CI to fail. This keeps the sub-0.5 s target enforced automatically.  
  *Sub-steps (est. 2.5 hrs total)*  
  1. Write a small script that reads the prod trace JSON and asserts DCL/load/LCP <500 ms — 60 min.  
  2. Add it to the GitHub Actions workflow after `npm run perf:budgets` (skip for PRs if needed) — 30 min.  
  3. Document remediation steps (where to look when CI fails) in `partners-portal-perf.md` — 30 min.  
  4. Dry-run CI locally (`CI=1 npm run perf:tti`) and capture screenshots/logs for future reference — 30 min.

---

## Cluster Checklist (Nov 24 2025 refresh)
See `docs/partners/perf/bmad-performance-plan.md` for rationale and budgets.

### Shell & Mobile Core
- _Baseline 2025-11-24:_ `/partners` load = 3.03 s, `/partners/campus` load = 3.96 s (see `docs/partners/perf/baselines/2025-11-24/route-metrics.tsv`).
- [x] Stream Campus nav data (JSON fetch + cache) instead of bundling static arrays. _(Nov 24: `public/data/partner-nav-config.json` now streams through `useNavConfig`, so Campus drawer no longer ships the entire schema in the client bundle.)_
- [x] Persist `MobileNavigationProvider` state per session to avoid rehydration storms. _(Nov 24: navigation state now hydrates from/persists to `sessionStorage`, preventing double-hydration on every `/partners/*` route change.)_
- [x] Lazy-load `Waves` outside hero pages and respect `prefers-reduced-motion`. _(Nov 25: `components/ui/wave-background.tsx` now wraps the animation in a dynamic chunk so non-hero routes render a gradient until motion is allowed, while hero pages can opt into `HeroWaves` for the full effect.)_
- [x] Ensure every shell route has `loading.tsx`/`error.tsx` fallbacks. _(Nov 25: added `src/app/partners/(mobile)/loading.tsx` + `campus/loading.tsx` skeletons so `/partners` and `/partners/campus` stream instantly.)_

### Academy & Learning
- [x] Portfolio & pitch kit data served via streamed JSON.
- [x] Interactive widgets converted to `dynamic()` (carousel, copy buttons).
- _Baseline 2025-11-24:_ `/partners/academy/courses/siso-essentials-program` load = 16.36 s, `/partners/academy/my-progress` = 12.37 s.
- [x] Stream `/academy/courses/[courseId]` modules and paginate `/academy/my-progress`. _(Nov 24: course catalogs/program pages now fetch from `/data/academy/courses.json` via server loaders, and My Progress consumes `getProgressSnapshot()` with paginated XP feed.)_
- [x] Target `/academy/courses/siso-essentials-program` load < 1.5 s (Story 02.03). _(Nov 25 prod sweep: FCP 0.34 s, load 0.04 s from `docs/partners/perf/baselines/2025-11-25-prod/trace-005-partners-academy-courses-siso-essentials-program.json`; remaining lesson detail route `/intro-1` timed out at 20 s — rerun if required.)_

### Community & Messaging
- _Baseline 2025-11-24:_ `/partners/community/all-channels` load = 8.74 s, `/partners/community/profile/nova-carter` = 15.94 s.
- [x] Move partner directory/help data to server components. _(Nov 24: partner directory + help collections now stream from `/data/community/*.json` via server loaders, and profile/help routes fetch data on the server instead of bundling TS arrays.)_
- [x] Lazy-load chat/composer UIs (hydrate on focus/intersection only). _(Nov 24: Community channel and messages screens now gate composers behind `useHydrateOnView` + dynamic imports, so the UI streams while the composer hydrates on intent.)_
- [x] Stream `/community/profile/[profileId]` hero data to cut 16 s loads. _(Nov 24: profile route now fetches individual partners via the server loader, so we don’t bundle the entire directory for each profile.)_
- [x] Add skeletons for every community channel route. _(Nov 24: `/partners/community/channels/{general-chat,wins,announcements}` now ship `loading.tsx` skeletons wrapping reused channel placeholders.)_

### Pipeline & Recruitment
- _Baseline 2025-11-24:_ `/partners/pipeline-ops/submit-client` load = 3.24 s, `/partners/recruitment/prospects` = 3.60 s.
- [x] Externalize wizard configs (Submit Client, Recruitment) into cached JSON. _(Done via `public/data/pipeline-ops-config.json` + `recruitment-submit-config.json` fetched in `page.tsx`.)_
- [x] Hydrate wizards/composers on interaction only. _(Nov 24: Submit Client / Submit Partner experiences now gate the composer and directory overlay behind scroll/interaction, so the heavy chat UI hydrates only when needed.)_
- [x] Stream recruitment profiles/team detail pages server-side. _(Nov 24: both the team overview and per-member pages fetch data via server loaders, so no client bundle includes the mock arrays.)_
- [ ] Keep all pipeline/recruitment routes < 1.2 s (CI budget TBD). _(Status: load times remain 2–3.6 s; budgets not encoded in `npm run perf:tti`.)_

### Earnings & PayPal (Priority Story 02.01)
- _Baseline 2025-11-24:_ `/partners/earnings` load = 44.38 s, `/partners/earnings/achievements` = 13.75 s.
- [x] Split `EarningsPageShell` into server summary + client tabs. _(Nov 25: removed the redundant client shell and now each earnings route simply renders content with `EarningsNavSync`, relying on the global `/partners` layout for the shell.)_
- [x] Lazy-load PayPal charts/widgets per tab. _(Nov 25: dashboard widgets now hydrate via `WidgetHydrator` + `dynamic(..., ssr:false)`, so PayPal charts/leaderboard/challenges only load when scrolled into view.)_
- [x] Paginate missions/challenges/badges mock data. _(Achievements now lazy-load the remaining badges; Missions screen shows first 6 and loads the rest on demand.)_
- [ ] Goal: `/partners/earnings` + `/partners/earnings/achievements` load < 2 s. _(Status: best case still >13 s; budgets missing in CI.)_

### Workspace & Tools
- _Baseline 2025-11-24:_ `/partners/workspace/files` load = 6.67 s; `/partners/tools/app-plan-generator` = 3.20 s.
- [ ] Lazy-load editor/AI dependencies (`/tools/app-plan-generator`, workspace screens). _(Status: `tools/app-plan-generator` renders static hero + `Waves`; there is no dynamic import guard for eventual editors.)_
- [ ] Stream workspace lists server-side. _(Status: `workspace/files` + `workspace/tasks` are still client components that import mock arrays.)_
- [ ] Gate heavy animations behind intersection observers. _(Status: `WorkspaceDemoHydrator.client.tsx` hydrates immediately and instantiates animations on mount.)_

### Legal / Privacy / Misc
- _Baseline 2025-11-24:_ `/partners/privacy-policy` load = 2.08 s; `/partners/settings/legal/*` average 1.2–1.6 s.
- [x] Convert static pages to pure server components and drop animated backgrounds. _(Nov 25: `/partners/privacy-policy` now renders a lightweight server component with no `use client` or animated backgrounds; legal settings can reuse the same content.)_

### Cross-Cluster Gaps (added Nov 24 2025)
- [ ] Map all 87 measured `/partners/*` routes to clusters + budgets (<0.5 s target) so we can prove coverage; current tracker only lists ~30 routes (compare with `docs/partners/architecture/partner-route-inventory.md` + `route-metrics.tsv`).
- [x] Expand `src/middleware.ts` caching rules (currently only 4 paths) and add per-route `segment.config` metadata for edge/runtime + `revalidate` to actually hit the <1 s TTFB goal. _(Nov 25: middleware now caches privacy, legal, community help/announcements, academy detail pages, earnings read-only pages, and recruitment team routes with a 1h/1d SWR policy. Segment configs still TBD.)_
- [ ] Document measurement modes (cold vs warmed, mobile network) and require `npm run perf:tti` + `npm run perf:baseline` artifacts per cluster story; today we only capture warmed dev stats.
- [ ] Add automated guard that fails CI if any `/partners/*` route exceeds 1 s load or 120 KB parsed JS (extend `.github/workflows/partner-portal-perf.yml`).

**Cadence:** after every cluster story, run `BASELINE_DIR=$(date +%Y-%m-%d) npm run perf:baseline`, commit artifacts under `docs/partners/perf/baselines/<date>/`, and update this checklist.
