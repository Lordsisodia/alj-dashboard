# Content Gen — Models Pill

The Models pill is the creator roster screen for the ISSO dashboard. Agency operators use it to manage every model they run content for — profile setup, niche tagging, handle linking, and a live view of each model's pipeline activity (ideas generated, clips queued).

**Route:** `/isso/content-gen/models`
**Sidebar entry:** Content Gen icon → Models pill (2nd item)
**Owner:** `agency.clients-pm`
**Stack:** Next.js 15 · TypeScript · Tailwind · Convex · Framer Motion

---

## File Map

```
src/features/content-gen/
├── types.ts                    ← Niche union, ModelDoc, PanelState
├── constants.ts                ← GRAD, NICHES colours, AVATAR_COLORS, FILTER_CHIPS
├── utils.ts                    ← completionPct, completionScore, stripAt
└── components/
    ├── ModelsFeaturePage.tsx   ← Orchestrator — Convex hooks, state, handlers
    ├── ModelGrid.tsx           ← Responsive card grid + ghost "Add" card
    ├── ModelCard.tsx           ← Portrait card with hover overlay
    ├── ModelPanel.tsx          ← Slide-out panel container + spring animation
    ├── PanelPreview.tsx        ← Avatar strip with drag-drop image upload
    ├── PanelForm.tsx           ← All form fields
    ├── PanelChecklist.tsx      ← Live completion checklist + delete zone
    ├── NicheChip.tsx           ← Color-coded niche badge
    ├── CompletionBar.tsx       ← Gradient/green profile completion bar
    ├── Field.tsx               ← Form field wrapper (label + hint + required)
    ├── SkeletonCard.tsx        ← Animated loading skeleton
    └── EmptyState.tsx          ← Zero-models state with Seed + Add CTAs

convex/
└── models.ts                   ← 7 queries/mutations

src/app/isso/content-gen/models/
└── page.tsx                    ← Next.js route → ModelsFeaturePage
```

All files ≤ 120 lines. Each component has a single responsibility.

---

## Data Layer — Convex

**Deployment:** `https://quiet-oriole-943.convex.cloud`
**Schema table:** `models`

| Field | Type | Notes |
|-------|------|-------|
| `name` | `string` | Required. Creator display name. |
| `niche` | `Niche` union | `'GFE' \| 'Fitness' \| 'Meme' \| 'Thirst Trap' \| 'Lifestyle'` |
| `ofHandle` | `string?` | OnlyFans username — stored without `@` |
| `igHandle` | `string?` | Instagram handle — stored without `@` |
| `avatarColor` | `string` | Hex color for card header background |
| `active` | `boolean` | `true` = Active, `false` = Draft |
| `bio` | `string?` | Style notes: lighting, makeup, location preferences |

**Convex functions (`convex/models.ts`):**

| Export | Type | Purpose |
|--------|------|---------|
| `list` | query | All models (active + draft), ordered by creation |
| `getAll` | query | Active models only |
| `ideaCountByModel` | query | `Record<modelId, count>` — drives card stats |
| `clipCountByModel` | query | `Record<modelId, count>` — drives card stats |
| `create` | mutation | Insert new model |
| `update` | mutation | Partial patch — strips undefined keys before write |
| `remove` | mutation | Delete by `Id<'models'>` |
| `seedModels` | mutation | Idempotent seed: Ren, Tyler, Ella, Amam (ALJ roster) |

---

## Component Architecture

### Responsibility map

```
ModelsFeaturePage         ← Convex hooks, filter state, panel open/close, save/delete handlers
├── ContentPageShell      ← Header, stat pill, filter chips, Add button (shared layout)
├── SkeletonCard[]        ← Shown while Convex query is undefined
├── EmptyState            ← Zero models — Seed + Add CTAs
├── ModelGrid             ← Grid + ghost card
│   └── ModelCard[]       ← Portrait card per model
│       ├── NicheChip     ← Colored niche badge
│       └── CompletionBar ← Profile % bar
└── ModelPanel            ← Slide-out add/edit panel
    ├── PanelPreview      ← Avatar strip + drag-drop upload
    ├── PanelForm         ← Name, niche grid, handles, status, color, bio
    │   └── Field         ← Label/hint wrapper
    └── PanelChecklist    ← Completion checklist + delete confirmation
```

### Design principles

| Principle | Implementation |
|-----------|----------------|
| **Portrait format** | `h-44` photo area above info strip — mirrors creator profile aesthetics |
| **Color = identity** | Each model gets a solid avatar color; niche chip overlaid on the photo |
| **Completion is visible** | Gradient bar on every card + live % in panel header — encourages profile fill |
| **Pipeline stats are inline** | Ideas + clips counts on the card — no drill-down needed for a quick status check |
| **Hover = intent** | Edit and Ideas actions only appear on hover — keeps the grid clean at rest |
| **Single spring panel** | One slide-out handles both Add and Edit — determined by whether `editingModel` is set |

### Design tokens

| Token | Value |
|-------|-------|
| Brand gradient | `linear-gradient(135deg, #ff0069, #833ab4)` |
| Card inner bg | `#f5f5f4` |
| Panel shadow | `-8px 0 40px rgba(0,0,0,0.12)` |
| Active status | `#34d399` (emerald-400) |
| Draft status | `#d4d4d4` (neutral-300) |
| Completion (100%) | `#10b981` (emerald-500) |

**Niche colors:**

| Niche | Background | Text |
|-------|-----------|------|
| GFE | `#fce7f3` | `#9d174d` |
| Fitness | `#d1fae5` | `#065f46` |
| Meme | `#fef3c7` | `#92400e` |
| Thirst Trap | `#ede9fe` | `#5b21b6` |
| Lifestyle | `#e0f2fe` | `#075985` |

---

## Features

### Roster Grid
- Responsive breakpoints: 2 → 3 → 4 → 5 columns
- Framer Motion fade-up per card (`opacity 0→1, y 10→0, 220ms`)
- Ghost "Add Model" dashed card always at the end of the grid
- Filter chips: All / Active / Draft (client-side, no extra query)

### Model Card
- **Photo area:** Solid `avatarColor` background + 2-letter monogram (40px black text, 60% opacity)
- **Status dot:** Emerald (active) / neutral (draft) — top right corner
- **Niche chip:** Color-coded, pinned to bottom-left of photo over a gradient scrim
- **Hover overlay:** Dark scrim + Edit (white) + Ideas (gradient) buttons, 150ms fade
- **Info strip:** Name, OF/IG handles (or "No handles linked" italic), completion bar + %, ideas/clips counts

### Profile Completion
- 4 checkable fields: niche, OF handle, IG handle, style notes
- Score 0–4 → 0–100%
- Gradient bar below 100%, solid emerald at 100%
- Live in panel header as user types

### Add / Edit Panel
- **Animation:** Spring slide from right (`stiffness: 320, damping: 34`)
- **Header:** "Add Model" / "Edit Model" + live completion pill + close ×
- **Preview strip:** 112px tall, `avatarColor` bg, drag-drop or click-to-upload image, status dot
- **Form:**
  - Name (required, text input)
  - Niche (3-col colored pill grid, ring on active)
  - Handles (OF + IG inline inputs with @ stripping)
  - Status (Active / Draft toggle buttons)
  - Card Color (9 color swatches, ring + scale on selected)
  - Style Notes (textarea, 3 rows)
- **Checklist:** 4-item live list with CheckCircle2 / Circle icons
- **Delete zone:** "Remove model" link → red confirmation card (edit mode only)
- **Footer:** Cancel + Save/Add (disabled until name filled, loading state)

### Empty State
- Shown when `models.length === 0` (not when filter returns empty)
- "Seed sample roster" → loads 4 ALJ OFM models idempotently
- "Add first model" → opens panel

### Seeded Roster (ALJ OFM)
| Name | Niche | Status |
|------|-------|--------|
| Ren | GFE | Active |
| Tyler | Fitness | Active |
| Ella | Meme | Draft |
| Amam | Lifestyle | Active |

---

## Future Pipeline

### Phase 2 — Ideas Engine
- `ideas` Convex table linked to `modelId`
- Ideas list per model: scriptable hooks, content angles, captions
- "Ideas" button on card hover activates the generator
- AI idea generation via Claude API using niche + style notes as context
- `ideaCountByModel` query already wired — cards will update automatically

### Phase 3 — Clip Queue Integration
- `clips` Convex table: status, prompt, face-transfer params, output URL
- Clicking a model opens their clip queue (not the global queue)
- Trigger FLUX face transfer from reference image → Kling/Higgsfield
- `clipCountByModel` query already wired — cards will update automatically

### Phase 4 — Reference Image Gallery
- Real image storage via Convex file storage (replacing local drag-drop preview)
- Multiple reference images per model (gallery strip in panel)
- Tag images by shoot context: solo / duo / outdoor / studio
- Image IDs fed directly into FLUX face-transfer prompt parameters

### Phase 5 — Model Analytics
- Per-model revenue + engagement pulled from OF API
- Historical clip performance: views, likes, revenue per clip
- Niche benchmark comparisons across roster
- Completion score correlated with output quality

### Phase 6 — Roles & Access
- Role-based visibility: agency owner sees all, model manager sees assigned models
- Creator portal (read-only): model sees own stats + upcoming content schedule
- Invite flow per model — sends onboarding link with pre-filled profile
