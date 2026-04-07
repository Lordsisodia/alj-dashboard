---
agent: ui.content-gen
icon: ⌘4
status: priority-today
---

# UI Agent — Content Gen

## What you own
The **Content Gen** nav icon (⌘4) — generate phase. The core product. FLUX face transfer → Replicate Kling video gen → Google Drive delivery.

## The problem (why pill bar is missing)
Every other icon uses one `*FeaturePage.tsx` with `ContentPageShell` + internal tab state.
Content Gen instead has **separate Next.js routes** per page — so `ContentPageShell` is never shared, and the pill bar never renders.
**Fix:** Create `ContentGenFeaturePage.tsx` wrapping all sub-views. See TASKS.md for exact steps.

## Current routes (to be collapsed into one page)
- `/isso/content-gen` → `src/app/isso/content-gen/page.tsx` → `<DashboardFeaturePage />`
- `/isso/content-gen/scenes` → `scenes/page.tsx` → `<ScenesFeaturePage />`
- `/isso/content-gen/generate` → `generate/page.tsx` → `<LivePipelinePage />`
- `/isso/content-gen/gallery` → `gallery/page.tsx` → `<GalleryFeaturePage />`
- `/isso/content-gen/models` → `models/page.tsx` → `<ContentGenModelsFeaturePage />`
- `/isso/content-gen/queue` → `queue/page.tsx` → `<QueueFeaturePage />` ← hidden, not in sidebar

## Target tab structure (after fix)
Single route `/isso/content-gen` renders `ContentGenFeaturePage` with:
```
tabs: Dashboard | Scenes ① | Generate ② | Gallery ③ | Models ④
nextProduct: Agents → /isso/agents
```

## Sub-view components (all in `src/features/content-gen/components/`)
| Tab | Component | Data | Real pipeline? |
|-----|-----------|------|---------------|
| Dashboard | `dashboard/DashboardFeaturePage.tsx` | `SEED_MODEL_SUMMARIES`, `SEED_ACTIVITY` | ❌ all seed |
| Scenes ① | `scenes/ScenesFeaturePage.tsx` | `SEED_SCENES` | ❌ all seed |
| Generate ② | `generate/LivePipelinePage.tsx` | `SEED_ACTIVE`/`SEED_HISTORY`, `cgApi = null` stub | ❌ no real calls |
| Gallery ③ | `gallery/GalleryFeaturePage.tsx` | `SEED_HISTORY` | ❌ all seed |
| Models ④ | `ContentGenModelsFeaturePage.tsx` | **Real Convex** `api.models.*` | ✅ CRUD only |

## Other key components
- `generate/GenerateFeaturePage.tsx` — older parallel version with real `api.contentGen.createJob` but `setTimeout` fake completion — NOT currently used by `/generate` route
- `generate/BriefBuilder.tsx`, `FaceRefUpload.tsx`, `TalentPicker.tsx`, `StyleChips.tsx`, `GeneratorPills.tsx`
- `queue/` — `ActiveJobCard.tsx`, `EtaCountdown.tsx`, `HistorySection.tsx`, `StatsStrip.tsx`, `atoms.tsx`
- Shared: `CompletionBar.tsx`, `EmptyState.tsx`, `ModelCard.tsx`, `ModelGrid.tsx`, `NicheChip.tsx`

## Convex files used
- `convex/contentGen.ts` — full CRUD: `getJobs`, `getStats`, `createJob`, `updateJobStatus`, `deleteJob`, `getActiveJobs`, `getHistory`, `retryJob`, `cancelJob`, `seedJobs`
- `convex/content.ts` — stub (TODO comment), has `save` + `list`
- `convex/mediaUploads.ts` — `save` mutation (R2 key + URL), `list` query
- `convex/costs.ts` — `list` + `seed` (includes FLUX + Kling cost rows)

## Real pipeline status
| Integration | Status |
|-------------|--------|
| FLUX API | ❌ Not wired — "FLUX" is string enum only |
| Replicate / Kling | ❌ Not wired — API key pending from Shaan |
| Google Drive upload | ❌ Not wired — only read-only (`/api/drive/files`, `/api/drive/stream/[id]`) |
| Google Drive read | ✅ Wired via `googleapis` JWT auth against `GOOGLE_DRIVE_VIDEOS_ALL_FOLDER` env var |

## Real pipeline (from ALJ context)
```
FLUX.2 Dev (face transfer) → Replicate Kling v3 (8s video) → Gallery review → Drive upload
```

## AI features (0/3)
None active. `GenerateFeaturePage.handleGenerate` fakes completion via `setTimeout`.
Suggestions (coordinate with feat.ai):
1. Auto-caption generator per reel (Claude/Gemini)
2. Brief suggester per scene (Gemini)
3. Viral score predictor before generation

## Blocked
- Replicate API key — Shaan to provide → `.env.local` as `REPLICATE_API_TOKEN`
- Google Drive folder ID for ALJ delivery

## Pattern compliance
- [x] Dashboard pill component exists
- [ ] **Pill bar missing — ContentGenFeaturePage.tsx needs to be created** (see TASKS.md)
- [ ] Real Convex queries on Dashboard/Scenes/Gallery
- [ ] Real FLUX + Kling pipeline
- [ ] Drive upload
- [ ] 3 AI features (0/3)
