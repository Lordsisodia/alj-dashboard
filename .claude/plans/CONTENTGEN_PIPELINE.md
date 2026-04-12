# ContentGen Pipeline — Architecture & State

**Last updated:** 2026-04-12  
**Status:** ~70% built. End-to-end Kling video generation is wired. Critical gap: 3-pass starting image generation sub-pipeline.

---

## Pipeline Overview

```
HUB (saved reels)
      │
      │  scrapedPosts (saved=true)
      │  videoUrl, thumbnailUrl, aiAnalysis
      ▼
SCENES — Tab 1
      │
      ├─ New Scene modal: pick post + model + brief + provider
      │  → scenes.createFromPost → scene{draft, startingImageStatus:missing}
      │
      ├─ Starting Image sub-pipeline (3-pass FLUX) ← MISSING
      │  Input: reference frame from post + model reference photos
      │  Pass 1: clothes swap (model photo + reference frame outfit)
      │  Pass 2: background swap (Pass 1 output + reference frame background)
      │  Pass 3: pose match (Pass 2 output + reference frame pose)
      │  Output: startingImageUrl → scenes.updateStartingImage(ready)
      │
      ├─ Manual upload (current path): user uploads startingImageUrl directly
      │
      ├─ Approval: scenes.approve → status=Queued (if image ready)
      │
      └─ Dispatch: replicate.dispatchKlingJob → Replicate API
             │
             ▼
GENERATE — Tab 2
      │  contentGenJobs table
      │  Replicate webhook → internalUpdateFromWebhook
      │  Video downloaded to R2 via downloadToR2 action
      │
      ▼
GALLERY — Tab 3
      │  contentGenJobs where status=Done
      │  Review, approve, deliver
      │
      ▼
DELIVERY (not yet built)
      Google Drive push per model folder
```

---

## Current State

| Component | Status | Notes |
|-----------|--------|-------|
| Hub → saved posts | ✅ Built | `intelligence.getSavedPosts`, filter by saved=true |
| New Scene modal | ✅ Built | `scenes/NewSceneModal.tsx`, calls `scenes.createFromPost` |
| Scene list (left panel) | ✅ Built | 4 collapsible sections, real Convex data |
| Scene detail panel (right) | ✅ Built | Side-by-side starting image + reference reel, scroll fixed |
| Manual starting image upload | ✅ Built | Upload API → R2 → `updateStartingImage` |
| Starting image 3-pass FLUX pipeline | ❌ Missing | Stubbed as "coming soon" in UI |
| Model reference photos storage | ❌ Missing | `models` table has no `referencePhotos` field |
| Scene approval flow | ✅ Built | `scenes.approve` → status Queued |
| Kling dispatch | ✅ Built | `replicate.dispatchKlingJob` → Replicate API |
| Replicate webhook handler | ✅ Built | `src/app/api/replicate/webhook/route.ts` |
| Video R2 download | ✅ Built | `replicate.downloadToR2` action |
| Generate tab (live monitor) | ✅ Built | `LivePipelinePage`, real `contentGenJobs` data |
| Gallery tab | ✅ Built | `GalleryFeaturePage` |
| Google Drive delivery | ❌ Missing | Settings has OAuth UI, push not implemented |

---

## Data Model

### `scrapedPosts` (source material)
```
_id, handle, platform, videoUrl (R2 mp4), thumbnailUrl (R2),
views, engagementRate, outlierRatio, saved (bool),
aiAnalysis: { hookLine, emotions, contentType, ... }
```

### `models` (talent roster)
```
_id, name, avatarColor, avatarUrl (single photo),
ofHandle, igHandle, niche, active, bio
⚠️ MISSING: referencePhotos: string[]  ← needed for 3-pass pipeline
```

### `scenes` (the pairing record)
```
_id,
modelId, modelName,
sourceType: 'saved_post' | 'manual' | 'idea',
sourceId: scrapedPosts._id,
sceneDescription,
referenceVideoUrl, referenceThumbnailUrl,  ← from source post
startingImageUrl, startingImageStatus: 'missing'|'generating'|'ready'|'failed',
startingImageError,
priorityScore (0-100),
provider: 'FLUX' | 'Kling' | 'Higgsfield',
status: 'Pending' | 'Queued' | 'Generating' | 'Done',
approvalState: 'draft' | 'pending_review' | 'approved' | 'rejected',
approvedBy, approvedAt, rejectionReason,
generatedJobId, generatedVideoUrl,
sourceHandle, sourceViews, sourceEngagementRate, sourceOutlierRatio,
sourceCaption, sourceHookLine, sourceEmotions,
createdBy, createdAt
```

### `contentGenJobs` (generation jobs)
```
_id,
modelId, modelName, brief, provider,
status: 'Pending'|'Queued'|'Generating'|'Done'|'Failed',
progress (0-100), etaSeconds,
startingImageUrl, referenceVideoUrl,
outputVideoUrl, thumbnailColor,
replicatePredictionId,
createdAt, completedAt
```

---

## Step-by-Step Pipeline

### Step 1: Source material (Hub → saved posts)
- **Where:** Intelligence tab → user saves posts via `intelligence.toggleSave`
- **What's stored:** `scrapedPosts` with R2 videoUrl + thumbnailUrl + AI analysis
- **Query:** `api.intelligence.getSavedPosts` (all optional filters)
- **Status:** ✅ Complete

### Step 2: Scene creation
- **Trigger:** "New Scene" button in ContentGenFeaturePage header
- **UI:** `NewSceneModal.tsx` — 4-col post grid, model pills, provider picker, description textarea
- **Mutation:** `api.scenes.createFromPost` — denormalises post snapshot into scene record
- **Result:** Scene in `draft` state, `startingImageStatus: 'missing'`
- **Status:** ✅ Complete

### Step 3: Starting image preparation ← CRITICAL GAP
This is the core creative step. Two paths:

#### Path A: Manual upload (current)
- User uploads a JPG/PNG via the detail panel
- `POST /api/content-gen/upload-image` → R2 → returns public CDN URL
- `api.scenes.updateStartingImage({ status: 'ready', url })` 
- Status: ✅ Working (URL bug fixed 2026-04-12 to use `R2_PUBLIC_URL`)

#### Path B: 3-pass FLUX generation (to build)
See dedicated section below.

### Step 4: Approval
- **Condition:** `startingImageStatus === 'ready'`
- **Mutation:** `api.scenes.approve({ sceneId, approvedBy })` 
- **Effect:** `approvalState → 'approved'`, `status → 'Queued'` (if image ready)
- **UI:** "Approve & queue" button in SceneDetailPanel footer
- **Status:** ✅ Complete

### Step 5: Dispatch to Generate
- **Condition:** `approvalState === 'approved' && startingImageStatus === 'ready' && status ∈ ['Pending','Queued']`
- **Action:** `api.replicate.dispatchKlingJob` (Convex action)
- **Params:** sceneId, modelName, brief, provider, startingImageUrl, referenceVideoUrl, mode, characterOrientation
- **Effect:** Creates `contentGenJobs` record, calls Replicate API, links job to scene via `scenes.linkGenerationJob`
- **Status:** ✅ Complete (bug fixed 2026-04-12: isReadyToGen condition now includes status='Queued')

### Step 6: Generation monitoring
- **Webhook:** `POST /api/replicate/webhook` → `contentGen.updateFromWebhookPublic`
- **Updates:** job status, progress, outputVideoUrl
- **R2 download:** `replicate.downloadToR2` downloads completed video to permanent storage
- **UI:** Generate tab (`LivePipelinePage`) — live job cards, ETA countdown, history
- **Status:** ✅ Complete

### Step 7: Gallery & delivery
- **UI:** Gallery tab (`GalleryFeaturePage`) — completed jobs grid
- **Approval:** `contentGen.updateOutcome` sets Approved/Rejected
- **Delivery:** Google Drive push — ❌ not implemented (Settings has OAuth UI)
- **Status:** Partial

---

## The Starting Image Generation Sub-pipeline (3-pass FLUX)

### Goal
Produce a photo of the actual talent (face preserved) in the correct pose/outfit/background matching the first frame of the reference reel. This becomes `startingImageUrl` for Kling motion control.

### Inputs required
1. **Reference frame** — first frame extracted from `referenceVideoUrl` (or `referenceThumbnailUrl` as proxy)
2. **Model reference photos** — 5-10 photos of the talent's face (`models.referencePhotos[]`) ← field doesn't exist yet

### 3-pass pipeline

```
Reference frame (pose/outfit/background analysis)
        +
Model reference photos (face identity)
        │
        ▼
Pass 1 — Clothes swap
  Input:  model face photo + reference frame
  Prompt: "Person wearing [outfit from reference frame], same face, studio lighting"
  Output: model in reference outfit (face preserved)
        │
        ▼
Pass 2 — Background swap  
  Input:  Pass 1 output + reference frame background
  Prompt: "[Pass 1 image] in [reference background scene], same person, same outfit"
  Output: model in reference outfit + reference background
        │
        ▼
Pass 3 — Pose match
  Input:  Pass 2 output + reference frame pose skeleton
  Prompt: "Same person, same outfit, same background, pose matching [reference frame]"
  Output: model in reference pose/outfit/background → STARTING IMAGE
        │
        ▼
scenes.updateStartingImage({ status: 'ready', url: finalOutputUrl })
```

### Implementation plan
1. Add `referencePhotos: v.optional(v.array(v.string()))` to `models` table schema
2. Add reference photo upload UI to `ModelPanel.tsx` (multi-image drag-drop, already has `PanelPreview`)
3. Create `convex/startingImage.ts` — orchestration mutations:
   - `kickoff({ sceneId })` → sets `startingImageStatus: 'generating'`, schedules pass 1
   - `completePass({ sceneId, pass, imageUrl })` → schedules next pass or finalises
4. Create `POST /api/content-gen/generate-starting-image` — calls FLUX via Replicate for each pass
5. UI: Replace "Generate from reference — coming soon" badge in `SceneDetailPanel` with active button (enabled when model has referencePhotos AND scene has referenceVideoUrl)

---

## Missing Pieces (Prioritised)

### P0 — Blocks the automated pipeline
| Item | File to change | What |
|------|---------------|------|
| `referencePhotos` field on models | `convex/schema.ts` | Add `referencePhotos: v.optional(v.array(v.string()))` to models table |
| Reference photo upload UI | `src/features/content-gen/components/ModelPanel.tsx` | Multi-image upload in PanelPreview section |
| `convex/startingImage.ts` | new file | 3-pass orchestration mutations |
| `/api/content-gen/generate-starting-image` | new file | FLUX API calls per pass |
| SceneDetailPanel generate button | `SceneDetailPanel.tsx:329` | Wire up when model has photos + scene has reference |

### P1 — UX completeness
| Item | File | What |
|------|------|------|
| Reference frame extraction | new API route | Extract first frame from videoUrl as image for analysis |
| Auto-tab switch after dispatch | `ContentGenFeaturePage.tsx` | After "Send to Generate", switch to Generate tab |
| New Scene modal shows video thumbnails | `NewSceneModal.tsx` | Currently shows thumbnailUrl — confirm R2 URLs loading |
| Scene card reference thumbnail | `SceneCard.tsx` | Check R2 URL validity for existing scenes |

### P2 — Pipeline completeness
| Item | What |
|------|------|
| Google Drive delivery | Push approved video to model's Drive folder |
| Notification on completion | Telegram/Slack ping when job Done |
| Retry/cancel for Generating jobs | Currently only Queued can cancel |
| Real video preview in history | Click thumbnail → inline mp4 player |

---

## Next Build Phase (Recommended)

### Phase A — Model reference photos (unblocks everything)
1. Schema: add `referencePhotos: v.optional(v.array(v.string()))` + `npx convex dev --once`
2. UI: add multi-photo upload to ModelPanel (reuse existing `PanelPreview` drag-drop pattern)
3. Upload API: extend `/api/content-gen/upload-image` or new route for model photos → R2

### Phase B — Starting image generation pipeline  
1. `convex/startingImage.ts` — 3-pass state machine
2. `/api/content-gen/generate-starting-image` — FLUX Replicate calls
3. `SceneDetailPanel` — wire up generate button, show pass progress (Pass 1/2/3)

### Phase C — Auto-flow polish
1. After "Send to Generate" → auto-switch to Generate tab
2. Webhook → scene `generatedVideoUrl` update (already partially wired)
3. Gallery "Approve" → mark scene Done

---

## Key File Reference

| Purpose | Path |
|---------|------|
| Scenes Convex backend | `convex/scenes.ts` |
| Generation jobs backend | `convex/contentGen.ts` |
| Replicate dispatch + R2 | `convex/replicate.ts` |
| Replicate webhook | `src/app/api/replicate/webhook/route.ts` |
| Starting image upload API | `src/app/api/content-gen/upload-image/route.ts` |
| Scene list + detail UI | `src/features/content-gen/components/scenes/` |
| New Scene modal | `src/features/content-gen/components/scenes/NewSceneModal.tsx` |
| Model panel | `src/features/content-gen/components/ModelPanel.tsx` |
| Schema | `convex/schema.ts` |
| DB schema tables | scrapedPosts:264, models:7, scenes:408, contentGenJobs:480 |
