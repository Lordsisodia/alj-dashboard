# BMAD Performance Plan — Partners App (Nov 24, 2025)

_Last baseline: `docs/partners/perf/baselines/2025-11-25-prod/` (prod build, 10-route sweep; academy + essentials program <0.5s FCP; lesson detail `/intro-1` timed out at 20s — rerun if needed)_

## 1. Brief — Objectives & Guardrails
- **Primary KPI:** Every `/partners/*` route achieves <2 s load event and <1.5 s first contentful paint on warmed hardware, with special focus on PayPal/Earnings.
- **Quality guardrails:** Preserve immersive UI (Campus shell, Waves, animations) and functionality; no regression in accessibility or responsiveness.
- **Measurement:** `npm run perf:baseline` → Puppeteer sweep + Chrome traces. Artifacts must be checked into `docs/partners/perf/baselines/<date>/` with TSV summary.
- **Alerting:** `PartnerPerfMetrics` (dev) + Sentry/web-vitals (prod later) log FCP/LCP/TTFB deltas per cluster.

## 2. BMAD Framing (Level 2–3, Brownfield)
- **Agents in play:** PM (planning), Architect (perf strategy), DEV (Next.js/RSC), TEA (CI/perf scripts), TW (docs sync).
- **Story IDs:** Performance stories live in `apps/partners/docs/stories/` with prefix `02.x` (this doc = 02.01 context). Checklist in `partners-portal-checklist.md` stays the single source of truth for completion status.
- **Tracking hooks:** Keep this plan + checklist referenced in `.bmad/_cfg/agent-manifest.csv` so BMAD agents auto-load context before generating stories.

## 3. Map — Cluster Coverage & Current State
| Cluster | Representative Routes | Nov-24 Load (ms) | Notes |
| --- | --- | --- | --- |
| Shell & Mobile Core | `/partners`, `/partners/campus`, `/partners/checklist`, `/partners/messages` | 1.9k–4.6k | Nav shell + Waves load on every route; Campus data hydrated per visit. |
| Academy & Learning | `/partners/academy/*`, `/partners/learning` | 1.0k–16.3k | Program modules + pitch kits import large mock data client-side. |
| Community & Messaging | `/partners/community/*`, `/partners/messages/*` | 3.2k–15.9k | Directory/profile/help datasets inline; message composer hydrates with shell. |
| Pipeline & Recruitment | `/partners/pipeline-ops/*`, `/partners/recruitment/*` | 0.4k–6.5k | Wizards/configs still inline but lighter; goal is <1s across board. |
| Earnings & PayPal | `/partners/earnings/*`, `/partners/wallet` | 0.4k–44.3k | Main earnings hub is 44 s because it hydrates every tab and mission data. |
| Workspace & Tools | `/partners/workspace/*`, `/partners/tools/app-plan-generator` | 0.9k–5.6k | Editors not lazy-loaded yet; tasks/files close to targets. |
| Legal/Privacy & Misc | `/partners/privacy-policy`, `/partners/settings/legal/*` | 0.6k–3.0k | Mostly static; keep under 1s once shell optimized. |

## 4. Architect — Fix Playbooks per Cluster
Each cluster has a BMAD story and checklist. ✅ marks carried over from Academy work; 🔜 marks current sprint focus.

### A. Shell & Mobile Core
- [ ] Convert Campus nav data to streamed JSON (no inline arrays in `CampusSidebarContent`).
- [ ] Lazy-load `Waves` background outside hero pages + respect `prefers-reduced-motion`.
- [ ] Share `MobileNavigationProvider` state via context persisted in `sessionStorage` to avoid rehydration storms per navigation.
- [ ] Add `loading.tsx`/`error.tsx` for shell-level UX consistency (fallback skeleton already exists ✅).
- [ ] Budget: shell bundle ≤ 60 KB parsed, nav hydration ≤ 500 ms.

### B. Academy & Learning (reference blueprint)
- ✅ Portfolio & pitch kit data moved to JSON + streamed fetch.
- ✅ `dynamic()` wrappers for carousel/copy buttons.
- [ ] Stream course program modules (currently import entire `courses[]` client-side).
- [ ] Paginate `/academy/my-progress`, `/academy/courses/[courseId]` data.
- [ ] Precompute static props for `/academy/certificates`, `/academy/training-spotlight`.
- 🔜 Target `/academy/courses/siso-essentials-program` load ≤ 1.5 s.

### C. Community & Messaging
- [ ] Move partner directory/help center data to server components (currently hydrate 10–15 KB arrays on client).
- [ ] Lazy-load composer/chat widgets (`dynamic()` on focus) for `/community/messages*`.
- [ ] Stream profile stats via `generateMetadata` + `cache()` to cut 16 s loads.
- [ ] Implement route-level `loading.tsx` per channel to show skeletons immediately.
- [ ] Budget: `<3 s` load, `<2 s` FCP.

### D. Pipeline & Recruitment
- [ ] Replace inline wizard configs with JSON fetched via `cache(fetch)` similar to Academy pattern.
- [ ] Hydrate Submit Client wizard/composer only on interaction.
- [ ] Convert recruitment profile/team detail pages to server components with streamed sections.
- [ ] Add lightweight search params (e.g., `?tab=`) to avoid re-rendering entire flows.
- [ ] Goal: keep all pipeline/recruitment routes <1.2 s load.

### E. Earnings & PayPal (highest priority)
- [ ] Split `EarningsPageShell` into server summary + client tabs.
- [ ] Load PayPal charts lazily per tab; ensure wallet summary uses streaming server data.
- [ ] Paginate missions/challenges/badges data to avoid loading entire mock dataset.
- [ ] Add skeletons for tab transitions + keep ledger data in JSON served via api route.
- [ ] Set 1.5 s load / 1.2 s FCP target for `/partners/earnings` and `/partners/earnings/achievements`.

### F. Workspace & Tools
- [ ] Lazy-load Monaco/editor dependencies in `/tools/app-plan-generator`.
- [ ] Gate workspace animations behind `IntersectionObserver`.
- [ ] Stream file/task lists server-side to avoid client rehydration.
- [ ] Keep all workspace routes <1.5 s.

### G. Legal/Privacy/Misc
- [ ] Convert static pages to RSC-only (no client imports) so they render instantly.
- [ ] Drop heavy background animations on these pages.

## 5. Simplifications & Global Budgets (Nov 25 update)
- **JS budget:** Hard cap 120 KB parsed per route; 80 KB stretch goal. Enforced via `npm run perf:budgets`.
- **Hero media rule:** One hero asset per page gets `fetchpriority="high"`, ≤1200 px width, AVIF/WebP preferred; all other media `loading="lazy"` + `decoding="async"`. Enforced in CI via `npm run perf:media`.
- **Payload guard:** Any JSON feed >200 KB (missions/badges, directory/help, pipeline configs) must be paginated/streamed; add a size check to `perf:budgets`.
- **Hydration rule:** Only files ending in `.client.tsx` may include `"use client"`; all hydrators must sit under `<Suspense>`/`dynamic`. Add lint + CI check.
- **Edge caching:** Single policy for `/partners/**`: `Cache-Control: s-maxage=3600, stale-while-revalidate=86400` with allowlist for dynamic routes; add `segment.config` revalidation hints where needed.
- **Prod baseline:** Run one prod-mode sweep (`npm run build && PORT=3003 next start` → `BASELINE_DIR=<date>-prod npm run perf:baseline`) and store under `docs/partners/perf/baselines/<date>-prod/` to capture real TTFB.
- **CI perf gate:** Add `npm run perf:tti` that fails if load >2 s or FCP >1.5 s on benchmark routes; run after bundle budgets in GitHub Actions.
- **Route inventory:** Generate `docs/partners/perf/route-metrics.tsv` mapping all `/partners/**` routes (≈87) to clusters + budgets so nothing is untracked.

## 6. Deliver — Process & Tooling
1. **Plan & Track**
   - Keep `partners-portal-checklist.md` in sync: each cluster = subheading with measurable tasks (updated below).
   - Create BMAD stories for each cluster under `apps/partners/docs/stories/` (Story IDs 02.x reserved for performance) and surface them via `.bmad/_cfg/agent-manifest.csv` for agent context.
2. **Implement**
   - Developers follow story tasks, keep components server-first, add lazy hydration hooks.
   - When data needs to be mocked, store JSON under `public/data/` and stream via `cache(fetch)`.
3. **Measure**
   - After each story, run `BASELINE_DIR=$(date +%Y-%m-%d) npm run perf:baseline`; for milestone releases also run the prod variant (`<date>-prod`).
   - Commit new traces + TSV; update `docs/partners/perf/baselines/<date>/README.md` (and `<date>-prod/README.md`) with summary.
4. **Verify & Alert**
   - Run `npm run perf:budgets` (bundle thresholds + JSON size check), `npm run perf:hydration` (lint `.client.tsx` rule), and `npm run perf:tti` (load/FCP guard) locally + in CI.
   - Once backend exists, forward `PartnerPerfMetrics` output to Sentry/New Relic.
5. **Educate**
   - Keep this plan + checklist linked in `.bmad/_cfg/agent-manifest.csv` so BMAD agents auto-load context before generating future stories.

## 7. Immediate Next Steps & Story Tracker
1. **Edge caching + prod baseline (new):** Draft caching policy + allowlist, then run prod-mode baseline `BASELINE_DIR=2025-11-25-prod npm run perf:baseline`; store under `docs/partners/perf/baselines/2025-11-25-prod/`.
2. **Earnings focus:** Story `02.01 earnings-shell-acceleration` → `/partners/earnings*` < 2 s; includes missions/badges pagination under 200 KB feed + per-tab lazy hydration.
3. **Community profiles/messages:** Story `02.02 community-profile-streaming` → `/partners/community/*` < 3 s.
4. **Academy remainder:** Story `02.03 academy-learning-optimization` → program/my-progress routes < 1.5 s.
5. **Pipeline & recruitment:** Story `02.04 pipeline-recruitment-hydration` → all wizard pages < 1.2 s.
6. **Shell/mobile:** Story `02.05 shell-mobile-core` → shell overhead ≤ 500 ms.
7. **Workspace & tools:** Story `02.06 workspace-tools-lazy-hydration` → editor routes < 1.5 s.
8. **Legal/privacy/misc:** Story `02.07 legal-privacy-simplification` → static routes < 1.0 s.
9. **CI & lint hardening (new):** Add `.client.tsx` lint, JSON size gate, and `perf:tti` check to GitHub Actions.
10. **Route coverage (new):** Generate `route-metrics.tsv` covering all `/partners/**` routes and map to clusters/budgets; keep in `docs/partners/perf/`.
11. **Checklist sync:** keep `docs/partners/perf/partners-portal-checklist.md` aligned with story progress.
