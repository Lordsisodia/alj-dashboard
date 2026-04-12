# CRITIC FIXES — Wireframe Review
**Date:** 2026-04-12
**Reviewed by:** agency.agency-dash (critic pass)
**Source wireframes:** 5 pages across 3 dashboards
**Method:** Cross-wireframe analysis against shared schema (CONVEX_SCHEMA_ADDITIONS.md), design system, and internal consistency

---

## HOW TO READ THIS DOCUMENT

Each page section lists every change the critic recommends before implementation begins.
Severity markers: `[BLOCKER]` = must fix before build | `[MAJOR]` = fix in planning | `[MINOR]` = fix during implementation

---

---

## PAGE 1: R&D Table (`/editor/rd-table`)
**File:** `editor-dashboard/pages/rd-table-wireframe.md`

### CUTS

- `[MINOR]` **Remove `hookScore` from the wireframe column set.** The canonical schema (`rdEntries`) has no `hookScore` field — that field lives on `scrapedPosts` / `postAnalyses`. The R&D table stores human-curated ideas, not scraped analytics. Using `priorityScore` (0–100) is the correct field to surface here. Rename the column header "Priority" and wire to `rdEntries.priorityScore`.
- `[MINOR]` **Remove `ScoreRing` component from the R&D table** — it's designed for `scrapedPosts` hook scores (0–10 numeric ring). It does not map to `rdEntries.priorityScore` (0–100). Replace with a simple `PriorityBadge` chip (HIGH/MED/LOW derived from score ranges) to match the Raw Content Queue pattern.
- `[MINOR]` **Remove `sourceHandle` + `sourceVerified` + `sourceEngagementRate` + `sourceOutlierRatio` + `sourceEmotions` from `RDRowDetailPanel`.** These fields (`sourceHandle`, `sourceViews`, `sourceEngagementRate`, etc.) exist on `rdEntries` only as optional carry-overs when the idea was sourced from a scraped post. The `ImportedReferenceCard` adapter (`toSceneShape`) is bloated — it fills fields that will almost always be null for manually-entered ideas. Simplify the detail panel: show source fields only when `rdEntries.referencePostId` is populated; fall back to a plain text description card otherwise.
- `[MINOR]` **Remove Gallery View (tab 3) from P2 scope.** The Gallery view requires `PostCard` adaptation and a 5-column responsive grid. It adds no decision-making value vs the Table View. Cut to P4 or later to reduce build scope. Keep the tab shell (hidden/disabled) to avoid future rework.

### ADDITIONS

- `[BLOCKER]` **Add `description` field to table columns.** The schema defines `rdEntries.description` as a required string (the full idea description), yet the wireframe table shows only `title`. Without `description` the editor has to expand every row to understand the idea. Add a truncated description sub-line under the title in `RDTitleCell` (1 line, `text-xs text-neutral-400 truncate`). No new column — render inline below the title.
- `[MAJOR]` **Add `source` column to the table.** `rdEntries.source` is an enum (`editor_sunday` | `analytics` | `model_swipe` | `ai_suggestion` | `manual`) and is critical for editors to understand where an idea came from. Add a `SourceBadge` chip to the table. This is a filter category already listed in `RD_FILTER_CATEGORIES` but absent from the column spec.
- `[MAJOR]` **Add `category` filter to `RD_FILTER_CATEGORIES`.** The schema defines `rdEntries.category` (`hook_reel`, `tutorial`, `thirst_trap`, etc.) but the filter config in the wireframe omits it. Add `category` as a 6th filter category alongside the existing 5.
- `[MAJOR]` **Add `assignedTo` / `contentRequestId` display in the expanded row panel.** When `rdEntries.contentRequestId` is set, the idea has already been turned into a brief. The detail panel should show this linkage with a "Brief sent →" badge that links to `/editor` (the content queue). Without this, editors have no way to know an idea is already in flight.
- `[MINOR]` **Add `createdBy` to the detail panel.** The schema has `rdEntries.createdBy`. Show a "Added by [name]" tag in the panel — useful for tracking whether an idea came from a Sunday session, a model swipe, or an AI suggestion.
- `[MINOR]` **Add a "Run batch now" permission guard.** The wireframe mentions `currentUser.role === 'senior'` as the gate. Per `ROLE_MATRIX.md`, the correct check is `roles.includes('Partner') || roles.includes('Owner')`. The `'senior'` string is not a valid role in the schema. Fix the condition.

### CHANGES

- `[BLOCKER]` **Rename `status` enum values to match the canonical schema.** The wireframe defines status as `pending | approved | rejected | batch_scheduled`. The actual `rdEntries.status` enum in the schema is: `proposed | approved | assigned | in_production | completed | rejected`. These do not match. The `ApprovalStatusBadge` component must cover all 6 schema values, not 4 wireframe values. `batch_scheduled` is not a schema state — remove it. `assigned` and `in_production` need badge variants.
- `[BLOCKER]` **`SundayBatchIndicator` logic must use `rdEntries.status === 'proposed'`, not `'pending'`.** The batch runs on `proposed` ideas, not `pending` ones — `pending` does not exist in the schema. Fix the Convex query: `api.rdEntries.countByStatus({ status: 'proposed' })`.
- `[MAJOR]` **`RDTanStackTable` column for `model` should default to hidden** for the Sunday batch workflow. On Sundays, all ideas are reviewed as a batch regardless of model. The `VisibilityPill` default state should have `model: false` for the batch view, toggling on when using the "All Models" filter context.
- `[MAJOR]` **The `AddRDEntryModal` `niche` options are hardcoded** (`fitness | lifestyle | fashion | wellness`). The schema stores `niche` as a free string (`v.string()`), not an enum. Replace the hardcoded pill selector with a combobox that loads distinct niche values from `api.models.getNiches()` and allows free-text entry. This prevents niche divergence across the system.
- `[MINOR]` **`PipelineStatusStrip` prop mapping is wrong.** The wireframe maps `lastBatchAt → latestScrapeAt`. `PipelineStatusStrip` was designed for the Intelligence feature where `latestScrapeAt` means social scrape time. For R&D context this is the last approval batch time — semantically different. Either rename the prop on the strip or build a `RDStatusStrip` variant. Do not silently reuse a misleading prop name.
- `[MINOR]` **Graph View D3 nodes should use `rdEntries.niche` not a hardcoded niche set.** The wireframe hardcodes cluster nodes (`fitness`, `lifestyle`, `fashion`). Pull cluster labels dynamically from `api.rdEntries.distinctNiches()` so new niches appear automatically.

### SCHEMA FIXES

- `[BLOCKER]` **The wireframe defines its own `rdEntries` schema** (section 4.1) that diverges from `CONVEX_SCHEMA_ADDITIONS.md`. Key conflicts:
  - Wireframe adds `hookScore: v.optional(v.number())` — NOT in canonical schema. Remove.
  - Wireframe uses `status: 'pending' | 'approved' | 'rejected' | 'batch_scheduled'` — canonical schema uses `'proposed' | 'approved' | 'assigned' | 'in_production' | 'completed' | 'rejected'`. Use canonical.
  - Wireframe omits `description: v.string()` (required in canonical). Add it.
  - Wireframe omits `category`, `priorityScore`, `performanceTags`, `linkedPostAnalysisId`, `contentHash`, `createdBy`, `contentRequestId`. These are all defined in canonical schema.
  - Wireframe adds `batchId: v.optional(v.string())` — not in canonical. Omit or add to canonical consciously.
  - **Resolution:** Delete the wireframe's section 4.1 schema block and reference `CONVEX_SCHEMA_ADDITIONS.md` exclusively. The implementation worker must not create a new table definition.
- `[MAJOR]` **`RDSortId` should include `'highest-priority'`** as a sort option (maps to `rdEntries.priorityScore` descending). Currently `'most-likes'` and `'most-views'` are listed — these fields do not exist on `rdEntries`. Replace with domain-appropriate sort options: `newest | oldest | highest-priority | lowest-priority | model`.

---

---

## PAGE 2: Content Requests (`/model/requests`)
**File:** `model-dashboard/pages/content-requests-wireframe.md`

### CUTS

- `[MAJOR]` **Remove the `[+ New]` action button from the model's header.** Models do not create content requests — they receive them. The button dropdown (`+ New Brief`) is an agency/editor action and belongs on the agency-side or editor-side dashboard. The model view is an inbox only. Remove the button entirely; the header should be read-only.
- `[MINOR]` **Remove `DoneView` as a separate component.** Completed requests are a filter state of the same `RequestInboxView` list, not a separate component with its own render tree. A `variant="done"` prop on `RequestCard` + tab filter is sufficient. A separate `DoneView` component adds complexity for no gain.
- `[MINOR]` **Remove `canvas-confetti` package dependency.** The `PointsEarnedBurst` uses `canvas-confetti` for early bonus. This is a heavy package for an edge case. Use a pure CSS/Framer Motion burst animation instead — scale + opacity pulse on the star icon achieves the same effect without an npm install.

### ADDITIONS

- `[BLOCKER]` **Add `editorName` and `tips` to the `contentRequests` schema from the wireframe.** The wireframe's `TipsCard` displays `tips` and `editorName`. The canonical schema in `CONVEX_SCHEMA_ADDITIONS.md` has `tips: v.optional(v.string())` and no `editorName` field. Add `editorName: v.optional(v.string())` to the `contentRequests` table. Without this, `TipsCard` has nowhere to read the editor's name from.
- `[BLOCKER]` **Add `referenceVideoUrl` to `contentRequests` schema.** The `ReferenceVideoCard` requires `brief.referenceVideoUrl`. The canonical schema has `briefVideoUrl` (not `referenceVideoUrl`). The wireframe uses a different field name. Align: use `briefVideoUrl` throughout the component, not `referenceVideoUrl`.
- `[MAJOR]` **Add `thumbnailUrl` derivation logic for `RequestCard`.** The wireframe shows a `[16:9 thumb]` in every card, but `contentRequests.briefThumbnailUrl` is optional. When null, the wireframe falls back to a `<Video size={18} />` icon. This is correct but underdocumented — specify that fallback explicitly in the component spec so the worker doesn't skip it.
- `[MAJOR]` **Add a `deletedAt` filter fix.** The Convex query in section 3.1 filters `q.neq(q.field('deletedAt'), undefined)` — this is backwards. It would return only soft-deleted records. The correct filter to exclude deleted records is `.filter(q => q.eq(q.field('deletedAt'), undefined))` (equality to undefined = not deleted). This is a logic bug that would show the model only deleted requests.
- `[MINOR]` **Add `in_progress` status to `RequestCard` variant handling.** The wireframe defines `variant?: 'pending' | 'urgent' | 'done'` but the canonical schema has `status: 'pending' | 'in_progress' | 'submitted' | 'approved'`. The `in_progress` state (model has started recording) has no visual variant. Add `variant: 'in_progress'` with a distinct treatment (e.g. animated recording dot overlay).

### CHANGES

- `[BLOCKER]` **`contentRequests` schema in section 8 conflicts with canonical schema.** The wireframe defines its own `contentRequests` table (section 8) that diverges:
  - Wireframe uses `senderLabel: v.string()` — canonical uses `sentBy: v.optional(v.string())`. Align to canonical; derive `senderLabel` at query time from the `sentBy` value.
  - Wireframe has no `rdEntryId` — canonical has `rdEntryId: v.optional(v.id('rdEntries'))`. The wireframe schema would create a table missing this critical foreign key.
  - Wireframe adds `driveFileId` and `driveUrl` — canonical has `googleDriveFileId` (not `driveFileId`). Align field names.
  - Wireframe adds `earlyBonusApplied: v.optional(v.boolean())` — canonical has `submittedEarly: v.optional(v.boolean())`. Use canonical name `submittedEarly`.
  - **Resolution:** Do not create a new table. Reference `CONVEX_SCHEMA_ADDITIONS.md` exclusively.
- `[MAJOR]` **`UploadConfirmationOverlay` must handle `error` state.** The wireframe defines `state: 'uploading' | 'success' | 'error'` in the interface but only specifies `uploading` and `success` visual states. The `error` state has no wireframe treatment. Define it: show a red X icon, "Upload failed — try again" message, and a "Retry" button that re-invokes `useUploadToGoogleDrive`.
- `[MAJOR]` **`useOneTapRecord` — iOS Safari fallback is insufficient.** The spec says "use `<input type="file" capture="environment">` as fallback on iOS". However, this fallback is the same as the primary approach — `getUserMedia` is listed first but should be the fallback (desktop Chrome). On iOS Safari, `<input capture="environment">` must be the primary path, not a fallback. Swap the priority order in `useOneTapRecord.ts`.
- `[MINOR]` **`ProgressTracker` milestone markers are visual-only.** The spec shows tick marks at 25%, 50%, 75% but provides no implementation detail for them. Add explicit CSS: `before:` pseudo-elements or `div` markers at calculated `left` positions inside the progress container. Without this the worker will skip the markers.
- `[MINOR]` **`DeadlineCountdown` refresh interval should use `useInterval` not raw `setInterval`.** Raw `setInterval` in `useEffect` leaks if the component unmounts mid-interval. Use a custom `useInterval` hook or `clearInterval` in the cleanup return. Document this in the spec.

### SCHEMA FIXES

- `[MAJOR]` **`contentRequests.status` enum mismatch.** Wireframe defines `'pending' | 'in_progress' | 'submitted' | 'approved'`. Canonical schema defines `'draft' | 'sent' | 'acknowledged' | 'in_progress' | 'uploaded' | 'overdue' | 'cancelled'`. These are fundamentally different state machines. The wireframe's model-facing view needs to map canonical statuses to simplified display states:
  - `draft` + `sent` → show as `pending` to the model
  - `acknowledged` + `in_progress` → show as `in_progress`
  - `uploaded` → show as `submitted`
  - `overdue` → show as `urgent`
  - `cancelled` → hide from model inbox
  - This mapping must live in a `getModelFacingStatus()` helper, NOT in the schema.
- `[MAJOR]` **Points calculation field:** `contentRequests.pointsAwarded` stores final awarded points, but `basePoints` and `earlyBonusMultiplier` used in the wireframe's `PointsPreviewCard` do not exist in the canonical schema. Add these two fields: `basePoints: v.optional(v.number())` and `earlyBonusMultiplier: v.optional(v.number())` and `earlyWindowHours: v.optional(v.number())` to `contentRequests` in `CONVEX_SCHEMA_ADDITIONS.md`.

---

---

## PAGE 3: Raw Content Queue (`/editor`)
**File:** `editor-dashboard/pages/raw-content-queue-wireframe.md`

### CUTS

- `[MAJOR]` **Remove `api.rdTable.getById` query reference in `ContentDetailPanel`.** The wireframe queries `api.rdTable.getById` to fetch the reference video inside the detail panel. There is no `rdTable` Convex module — the table is called `rdEntries`. Change to `api.rdEntries.getById`. This is a naming error that would cause a runtime crash.
- `[MINOR]` **Remove the "All Models" tab's `NicheGroup` → `ModelGroup` adaptation note.** This is speculative complexity. The "All Models" tab grouping by model is a P2+ feature. Mark it as future scope in the spec rather than including implementation instructions that will tempt workers to over-build.
- `[MINOR]` **Remove `HubQuickActions` reuse note (section 5.3).** `HubQuickActions` is a 3-column action strip designed for the community hub. Using it for the `ClaimItemDropdown` would create a visual mismatch — the claim dropdown is a flyout list, not a grid. Remove this reuse instruction and specify a simple `<ul>` dropdown list instead.

### ADDITIONS

- `[BLOCKER]` **Add `assignedTo` field to `ContentItem` type and the Convex query.** The wireframe defines `ContentItem.assignedTo?: string` but the Convex query in section 3.1 does not filter by `assignedTo` for the "My Items" tab. Add explicit filter: `.filter(q => q.eq(q.field('assignedTo'), currentUserId))` for the `my-items` tab. Without this, "My Items" shows all items, not just the current editor's.
- `[BLOCKER]` **Add PTP rejection source display.** The wireframe mentions a `SourceBadge` overlay for `ptp-rejection` source items but the Convex query (`api.contentRequests.list`) would not naturally return PTP-rejected reels — those live in `api.reels.listRejected` (referenced in `EditorQueueFeaturePage` section 3.1). The two queries return different data shapes. Specify a union/merge step: fetch both `contentRequests` (new content) and `reels` with `ptpStatus='revision'` (PTP rejections), normalize both into `ContentItem[]`, and merge before rendering. Without this architecture note, the worker will query only one table and miss PTP rejections.
- `[MAJOR]` **Add optimistic rollback on drag error.** Section 4.1 mentions "rollback local state, show error toast" on Convex mutation error but does not specify what `rollback` means. Document: store the pre-drag `columns` snapshot in a `useRef`, and on error restore `setColumns(previousSnapshot)`.
- `[MINOR]` **Add `updatedAt` timestamp to `ContentQueueCard` footer.** The wireframe shows model name, niche, priority, and duration but omits the age of the item. The `ContentItem.createdAt` field is in the schema — show a relative timestamp ("added 2d ago") in the card footer. Editors need to know how long items have been waiting.

### CHANGES

- `[BLOCKER]` **`contentRequests` table has no `priority` field.** The wireframe defines `ContentItem.priority: 'high' | 'medium' | 'low'` and shows `PriorityBadge` on every card, but the canonical `contentRequests` schema in `CONVEX_SCHEMA_ADDITIONS.md` has no `priority` field. Either: (a) add `priority: v.optional(v.union(v.literal('high'), v.literal('medium'), v.literal('low')))` to the `contentRequests` table, or (b) derive priority from deadline proximity (overdue = high, <24h = medium, else low). Document the chosen approach. Currently it is undefined.
- `[BLOCKER]` **`contentRequests.needsTweaking` field is not in the canonical schema.** The wireframe adds `needsTweaking: v.boolean()` to the schema notes (section 8). The `CONVEX_SCHEMA_ADDITIONS.md` `contentRequests` table does not include this field. Add it explicitly to the canonical schema doc before building.
- `[MAJOR]` **Kanban state derives from wrong table for PTP rejections.** `KanbanState` is initialized from `useQuery(api.contentRequests.list, ...)` but PTP rejection items come from `api.reels.listRejected`. These are different Convex tables with different document shapes. The `ContentItem` interface must be populated from two separate queries and merged. The wireframe treats them as a single source — this will silently drop all PTP rejection cards. See ADDITIONS above for the union approach.
- `[MAJOR]` **`CapCutTipsPanel` data source is undefined.** Section 3.6 queries `api.capCutTips.forNiche` but the canonical schema does not have a `capCutTips` table in the original design. It exists as `capCutTemplates` (Part 2 of schema additions). Align the query: `api.capCutTemplates.forNiche({ niche: item.niche })` and map `CapCutTemplate[]` to the `CapCutTip[]` interface.
- `[MINOR]` **`useEditorFilters.ts` URL sync is mentioned but not specified.** Section 7 lists `useEditorFilters.ts` with a comment "URL sync" but provides no implementation notes. URL-synced filters are not trivial in Next.js App Router. Either remove the URL sync from P1 scope or document the `useSearchParams`/`useRouter` pattern to use.

### SCHEMA FIXES

- `[MAJOR]` **Add `priority` and `needsTweaking` fields to `contentRequests` table.** Neither exists in `CONVEX_SCHEMA_ADDITIONS.md`. These are required by the Raw Content Queue kanban. Add to the canonical schema file:
  ```
  priority: v.optional(v.union(v.literal('high'), v.literal('medium'), v.literal('low')))
  needsTweaking: v.optional(v.boolean())
  ```
  And add index: `.index('by_needs_tweaking', ['needsTweaking'])`.
- `[MAJOR]` **`ContentItem.source` enum is `'content-request' | 'ptp-rejection'`** but the canonical `reels.ptpStatus` uses `'revision'` not `'ptp-rejection'`. The source badge logic should derive from `ptpStatus === 'revision'` → display "PTP Rejection". Do not add a `source` field to `reels` — derive it.
- `[MINOR]` **`api.contentRequests.claim` mutation needs `assignedTo` as a teamMember ID, not a string.** The wireframe spec references `assignedTo` as a string, but the canonical schema uses `v.id('teamMembers')` for foreign keys. Update the mutation signature to accept `assignedEditorId: Id<'teamMembers'>`.

---

---

## PAGE 4: PTP Approval (`/agency/ptp`)
**File:** `agency-dashboard/pages/ptp-approval-wireframe.md`

### CUTS

- `[MAJOR]` **Remove `Delegate` button from `ApprovalActionRow`.** The wireframe adds a "Delegate" button to the action row (section 3m). The `approvalDelegations` table supports delegation as a standing grant (set up in Settings), not a per-reel action. A per-reel Delegate button creates ambiguity — does it delegate all future approvals for this model, or just this reel? Remove the per-reel button. Delegation belongs in `/agency/settings`, not in the approval action row.
- `[MINOR]` **Remove keyboard shortcut handler for `A`, `S`, `R` keys (section 4f).** Keyboard shortcuts conflict with text inputs in the rejection reason textarea and schedule time picker. Implement only the `Escape` and arrow key navigation; omit single-key action shortcuts until a proper key-listening guard is in place (checking `document.activeElement` is not an input).

### ADDITIONS

- `[BLOCKER]` **Add `aiAnalysis` data to `reels` table.** The wireframe uses `AiAnalysisPanel` in `PtpDetailPanel` which requires `reel.aiAnalysis`. The canonical `reels` table in `CONVEX_SCHEMA_ADDITIONS.md` has `viralityScore`, `captionAI`, `hookVariants` but no `aiAnalysis: AiAnalysisData` object. The wireframe defines a separate `AiAnalysisData` interface (`hookScore`, `emotions`, `suggestions`, `durationSeconds`). These fields exist individually in `reels` but not as a nested object. Add a mapping in `PtpDetailPanel` that constructs `AiAnalysisData` from the flat reel fields rather than adding a nested object to the schema. Document this adapter explicitly.
- `[BLOCKER]` **Add `queueAgeHours` as a computed field.** The wireframe adds `queueAgeHours` to `ApprovalItem` and queries it. The canonical schema does not store this — it must be computed at query time: `Math.floor((Date.now() - reel.updatedAt) / 3600000)`. Add a Convex query helper `api.reels.getPendingWithAge` that computes and returns `queueAgeHours` alongside reel data. Do not store it as a DB field (it would go stale immediately).
- `[MAJOR]` **Add `modelNiche` and `modelHandle` to the reel query response.** The wireframe adds `modelNiche` and `modelHandle` to `ApprovalItem`. These live on the `models` table, not on `reels`. The Convex query for `PtpReelGrid` must join `reels` + `models` to populate these. Add this join to the query spec.
- `[MAJOR]` **Add `SlaThresholdBadge` spec.** `PtpStatusStrip` includes `<SlaThresholdBadge />` in its `rightSlot` but this component is never specified anywhere in the wireframe. Define it: a pill showing the configured SLA threshold (e.g. "SLA: 48h") that turns amber when `avgSlaHours > threshold`. Add a `slaThresholdHours` config value (default 48) either from `settings` table or as a constant.
- `[MINOR]` **Add empty state for `PtpDetailPanel` when no card is selected.** The wireframe specifies `w-0 opacity-0` when `selectedItemId === null`, but an invisible panel with no empty state creates a jarring layout shift when the first card is selected. Add a proper empty state: centered "Select a reel to review" with a ghost card illustration.

### CHANGES

- `[BLOCKER]` **`ApprovalVersionEvent.eventType` enum is incomplete.** The canonical `reels.ptpStatus` includes `'editing'` but the `VersionHistoryLog` event types are `'submitted' | 'approved' | 'rejected' | 'revision_requested' | 'scheduled' | 'published'`. There is no `'editing'` event — that is a status state, not a history event. Additionally, the canonical schema stores version history in `reelVersions` table (each row is an immutable version snapshot with its own `status`), not in an `ApprovalVersionEvent[]` array on the reel. The `VersionHistoryLog` component must query `api.reelVersions.forReel({ reelId })` and reconstruct the event timeline from the `reelVersions` records, not from a denormalized array.
- `[BLOCKER]` **`VersionComparison` props use `thumbnailGradient` and `thumbnailIcon` as placeholder data.** These are mock-only fields — the canonical `reelVersions` table has `thumbnailUrl: v.optional(v.string())`. If `thumbnailUrl` is null, generate a deterministic CSS gradient from the `reelId` + `versionNumber` hash rather than accepting gradient as a prop. Remove `thumbnailGradient` and `thumbnailIcon` from the interface; handle placeholder generation internally.
- `[MAJOR]` **`BatchApprovalBar` position conflicts with `IssoSidebarShell`.** The bar is specified as `fixed bottom-6 left-1/2 -translate-x-1/2`. On the isso-dashboard layout, `IssoSidebarShell` is a fixed-width sidebar — `left-1/2` will be offset from the visual center of the content area. Use `left-[calc(50%+140px)]` (accounting for ~280px expanded sidebar) or render the bar inside the `ContentPageShell` content area as `absolute bottom-6` rather than `fixed`.
- `[MAJOR]` **`ScheduleDatePopup` pre-fill logic is vague.** Section 3g says "passed as prop from parent, computed from niche posting schedule." There is no `nichPostingSchedule` data source defined anywhere in the schema or wireframes. Either: (a) hardcode a simple "next weekday" default, or (b) define `api.schedule.getOptimalPostDate({ modelId, niche })` as a query that returns a recommendation based on historical `scheduledPosts` data. Document the chosen approach before build.
- `[MINOR]` **`PtpReelGrid` renamed from `ApprovalsTabContent`** but the enhancement strategy says "do NOT rebuild." The wireframe renames the file (`ApprovalsTabContent.tsx` → `PtpReelGrid.tsx`). Renaming a file is a rebuild risk if other parts of the codebase import from the old path. Check all imports of `ApprovalsTabContent` before renaming, and use an export alias if necessary.

### SCHEMA FIXES

- `[MAJOR]` **`ApprovalItem` in `types.ts` needs a migration plan.** The wireframe adds 7 new fields to `ApprovalItem` (section 6). Several of these (`version`, `modelNiche`, `modelHandle`) are currently denormalized string fields. Since `ApprovalItem` is derived from the `approvals` Convex table (existing) AND the new `reels` table, clarify which table is the source of truth. Recommendation: `ApprovalItem` should be a view type assembled at query time from `reels` (primary) + `reelVersions` (version data) + `models` (niche/handle). Do not add all 7 fields to the `approvals` table.
- `[MAJOR]` **`reels.versionHistory` is referenced in section 6 as an `ApprovalVersionEvent[]` field to add to `reels`.** The canonical schema does NOT store a `versionHistory` array on `reels` — version history is normalized into the separate `reelVersions` table. Do not add `versionHistory: ApprovalVersionEvent[]` to `reels`. Query `reelVersions` instead.
- `[MINOR]` **`scheduledDate` field on `reels` is `v.optional(v.string())` (ISO string).** The `ScheduleDatePopup` sets `scheduledDate` when the owner approves. Ensure the Convex mutation `api.reels.approveAndSchedule` also creates a corresponding `scheduledPosts` record, otherwise the scheduler page will not know about this post. The wireframe's approve-and-schedule action must be atomic: update `reels.ptpStatus = 'scheduled'` + insert `scheduledPosts` row in a single mutation.

---

---

## PAGE 5: Content Scheduler (`/agency/schedule`)
**File:** `agency-dashboard/pages/content-scheduler-wireframe.md`

### CUTS

- `[MAJOR]` **Cut `DailyColumn` view from P1 scope.** The wireframe includes Daily, Weekly, and Monthly views. Daily view (`DailyColumn`) duplicates the DayDetailPanel (which already shows a single day's items inline in the monthly grid). Three calendar modes is over-engineering for an initial build. Cut daily view to P2. Keep the toggle UI but disable the daily option.
- `[MAJOR]` **Cut drag-to-reschedule from P1 scope (phases 8–9).** Drag interactions on a calendar grid require `@dnd-kit/core` wrapping around every cell and complex collision detection logic. This is the highest-complexity item in the build. The build order already marks it as phase 8–9. Formally cut it from MVP scope — the `onItemDrop` callback can be a no-op stub with a "Drag to reschedule — coming soon" toast.
- `[MINOR]` **Remove `right-click context menu` from the spec (section 6, Later.com patterns).** Right-click context menus are not part of the ISSO design system and are not implemented anywhere else in the dashboard. Remove this reference to avoid scope creep. The `···` dropdown on `DayDetailItem` covers the same actions.

### ADDITIONS

- `[BLOCKER]` **`ScheduledPost.id` is marked NEW and was missing.** The wireframe correctly flags `id: string` as missing from the current `ScheduledPost` type. However, in Convex all documents have `_id: Id<'scheduledPosts'>`. The `ScheduledPost` type must be a `Doc<'scheduledPosts'>` or include `_id`. Do not add a separate `id: string` field — use `_id` throughout.
- `[BLOCKER]` **`MetaDripQueue` has no Convex query specified.** The wireframe defines the component interface (`used`, `total`, `nextDripIn`, etc.) but never specifies where this data comes from. Define: `useQuery(api.scheduledPosts.getDripStatus, { accountHandle })` that returns aggregated slot data: count of records with `platform='instagram'` and `status='slot_assigned'` (= used slots), next `scheduledAt` timestamp (= nextDripIn), and `isPaused` from a per-account config. Add `isDripPaused: v.optional(v.boolean())` and `dripCooldownHours: v.optional(v.number())` fields to the `scheduledPosts` account config (or a separate `accountSettings` table).
- `[MAJOR]` **Add `IGGridPreview` data source spec.** The component requires `IGGridPost[]` — the last 9 published posts + next 3 scheduled. Specify the query: `api.scheduledPosts.getIGGridPosts({ accountHandle, limit: 12 })` which returns the last 9 `published` records + the next 3 `scheduled_meta` records ordered by `scheduledAt`. Without this query spec, workers will invent their own data fetching.
- `[MAJOR]` **Add `BestTimeRecommendation` data source.** The `ItemDetailDrawer` shows AI-recommended posting times (`Optimal: 12:00 PM Thu (+23% reach)`). There is no `api.schedule.getOptimalPostDate` defined in the schema. Either: (a) derive from historical `scheduledPosts` engagement data (requires `engagementRate` on `scheduledPosts` — currently missing), or (b) hardcode a time recommendation table per niche per day-of-week as a constants file. For MVP: use a constants approach. Document this explicitly.
- `[MINOR]` **Add `onAddItem` wiring for `DayDetailPanel`.** The panel has `[+ Add item for this day]` link that calls `onAddItem(day)`. The wireframe says this triggers `SchedulePostModal` pre-filled with that day's date. Add explicit prop threading: `ScheduleFeaturePage` must pass `onAddItem={(day) => { setScheduleModalDay(day); setShowScheduleModal(true); }}` through `CalendarView` → `DayDetailPanel`.

### CHANGES

- `[BLOCKER]` **`ScheduledPost` type conflicts with the canonical `scheduledPosts` schema.** The wireframe redefines `ScheduledPost` in `types.ts` but the canonical schema (`CONVEX_SCHEMA_ADDITIONS.md`) already defines `scheduledPosts`. Key conflicts:
  - Wireframe has `day: number` and `hour: number` and `minute: number` — canonical schema uses `scheduledAt: v.number()` (Unix ms, which encodes both date and time). Do not add separate day/hour/minute fields; derive them from `scheduledAt` using date utilities.
  - Wireframe has `modelId: string` — canonical has `modelId: v.id('models')`.
  - Wireframe has `status: 'scheduled' | 'pending' | 'published' | 'failed'` — canonical has a 7-value enum (`queued | slot_assigned | uploading_to_meta | scheduled_meta | published | failed | cancelled`). Map canonical statuses to display statuses at the component level.
  - Wireframe adds `aiScore`, `bestPostTime`, `approvedBy`, `approvedAt` — only `bestTimeScore` exists in canonical (maps to `aiScore`). `approvedBy` and `approvedAt` live on the related `reels` record, not on `scheduledPosts`. Fetch via join.
  - **Resolution:** `ScheduledPost` in `types.ts` must be `Doc<'scheduledPosts'>`. Derived/joined fields go in a separate `ScheduledPostView` type.
- `[MAJOR]` **`CalendarView` currently filters `SCHEDULED_POSTS` (a constants array).** The wireframe says "filter `SCHEDULED_POSTS` by `selectedModel` and `selectedAccount` (when not null)". This is filtering static mock data, not live Convex data. Specify the live query: `useQuery(api.scheduledPosts.listByMonth, { modelId: selectedModel, accountHandle: selectedAccount, month: currentMonth })`. The constants file is for development only.
- `[MAJOR]` **`WeeklyGrid` drag implementation uses `@dnd-kit/core`** but this conflicts with the CUTS recommendation above (drag cut from P1). Ensure `WeeklyGrid` is built in P1 without drag — items are click-only in P1, drag-enabled in P2. The `onItemDrop` prop exists but does nothing until P2.
- `[MAJOR]` **`ModelSelector` dropdown shows "post count badge"** for each model. There is no `postCount` field on `models` — this would require a Convex aggregate query. For MVP, remove the post count badge from the dropdown. Show only avatar + handle + niche tag.
- `[MINOR]` **`AccountSelector` disabled state says "Select model first"** — but on load the `selectedModel` may be null and the account selector would show this message immediately, which feels like an error state. Change to a greyed-out pill with label "Account" and no dropdown (not a disabled state with an error message) when no model is selected.
- `[MINOR]` **`IGGridPreview` shows "Next 3 posts shown in feed order"** but IG grid order is determined by publish time, not the order of `scheduledAt`. If two posts are scheduled for the same day, their position in the IG grid depends on exact publish time. Make the caption accurate: "Next 3 scheduled posts" rather than implying feed-position accuracy.

### SCHEMA FIXES

- `[BLOCKER]` **`ScheduledPost.metaDripSlot` (1–25) is the canonical field for Meta slot position** but the wireframe's `MetaDripQueue` shows 25 filled/empty cells with no direct link to individual `scheduledPosts` records. Specify the slot grid rendering: query `api.scheduledPosts.listSlots({ accountHandle })` which returns `scheduledPosts` records with `platform='instagram'` and `status IN ['slot_assigned', 'uploading_to_meta', 'scheduled_meta']` ordered by `metaSlotPosition`. Each record maps to a grid cell. Empty cells fill to 25.
- `[MAJOR]` **`scheduledPosts` is missing `engagementRate` for BestTime computation.** The AI best-time feature needs historical engagement data per time slot. Add `engagementRate: v.optional(v.number())` to `scheduledPosts` (backfilled after publish from the social analytics scraper). This enables the `BestTimeRecommendation` feature beyond MVP.
- `[MINOR]` **`IGGridPost` interface in the wireframe has `gradient: { from: string; to: string }` as a fallback.** This gradient is never stored — it must be generated deterministically from the post ID. Remove `gradient` from the `IGGridPost` interface and generate the placeholder gradient in the component from `id` using a hash function.

---

---

## SYSTEM-WIDE FIXES

### SW-1: Schema Authority Conflict (BLOCKER)
Three wireframes (R&D Table, Content Requests, PTP Approval) each define their own `convex/` schema blocks that conflict with `CONVEX_SCHEMA_ADDITIONS.md`. This creates a risk of workers implementing divergent tables.

**Fix:** Add this directive to every wireframe's Data Layer section:
> "DO NOT define table schemas here. The canonical schema is `CONVEX_SCHEMA_ADDITIONS.md`. Reference that file. Any additions needed go in that file first, then reference from here."

All worker agents must be briefed: only one schema file exists. If a wireframe schema contradicts it, the wireframe is wrong.

---

### SW-2: `contentRequests` Table Used by 3 Pages with Different Field Assumptions (BLOCKER)
- Content Requests page (model view) treats it as a brief delivery system with `senderLabel`, `referenceVideoUrl`, `earlyBonusApplied`
- Raw Content Queue (editor view) treats it as a kanban item with `priority`, `needsTweaking`, `assignedTo`
- Content Scheduler references it as a source for `scheduledPosts`

Each view adds fields that don't exist in the canonical schema. **These additions must be consolidated into a single schema change:**

Required additions to `contentRequests` in `CONVEX_SCHEMA_ADDITIONS.md`:
```
editorName: v.optional(v.string())
basePoints: v.optional(v.number())
earlyBonusMultiplier: v.optional(v.number())
earlyWindowHours: v.optional(v.number())
priority: v.optional(v.union(v.literal('high'), v.literal('medium'), v.literal('low')))
needsTweaking: v.optional(v.boolean())
```

These must be added to the schema doc before any build work begins.

---

### SW-3: Niche Is Free-String in Schema, Enum in Wireframes (MAJOR)
`rdEntries.niche`, `contentRequests.niche`, `reels.niche`, `scheduledPosts` (via models) — all use `v.string()` in the canonical schema. But wireframes hardcode niche options as `'fitness' | 'lifestyle' | 'fashion' | 'wellness'` in selectors, filter pills, and filter config arrays.

**Fix:** Create a shared `NICHES` constant in `src/features/shared/constants/niches.ts` that lists the current niche options. All dropdowns and filter pills source from this constant. The Convex schema stays as `v.string()`. This way adding a new niche requires changing one file, not hunting down every hardcoded enum.

---

### SW-4: `v.id('teamMembers')` vs `v.string()` for Actor Fields (MAJOR)
Multiple wireframes use plain strings for actor references (`approvedBy: string`, `assignedTo: string`, `sentBy: string`). The canonical schema uses `v.id('teamMembers')` in some places and `v.string()` in others (denormalized for display speed). This inconsistency will cause type errors.

**Fix:** Establish the pattern: use `v.id('teamMembers')` for all foreign key relationships; add a separate `*Name: v.string()` denormalized field for display. Example: `approvedBy: v.optional(v.id('teamMembers'))` + `approvedByName: v.optional(v.string())`. Enforce this pattern across all new tables.

---

### SW-5: Animation Library Usage Conflicts (MINOR)
All 5 wireframes use Framer Motion (`AnimatePresence`, `motion.div`) extensively. Some components also reference `useMotionValue` and `useTransform` (Content Requests, points count-up). Confirm Framer Motion is installed in `isso-dashboard` before workers begin. If it is only in `motion` v11+ API, update import paths from `framer-motion` to `motion/react` where required.

---

### SW-6: `IssoSidebarShell` + Fixed Position Bars (MINOR)
Three wireframes use `fixed` positioning for floating bars (`BatchApprovalBar` on PTP, sticky record bar on Content Requests, floating batch bar). On the isso-dashboard layout, `IssoSidebarShell` is `fixed` with a `z-index`. Fixed child elements inside a non-fixed ancestor can escape intended bounds. All `fixed` bars must account for sidebar width. Use `left-[var(--sidebar-width)]` CSS variable or `left-[calc(var(--sidebar-width)+theme(spacing.5))]` to align with the content area.

---

### SW-7: Google Drive Integration Has No Auth Spec (MAJOR)
Content Requests wireframe specifies `uploadToGoogleDrive` as a Convex action that calls Drive API v3. There is no specification for:
- How the Drive OAuth token is stored (service account vs. per-user OAuth)
- Which folder the files land in
- What happens when the Drive token expires

This is a backend integration that must be designed before the worker builds the action. Add a spike task: "Define Google Drive auth strategy" before building `useUploadToGoogleDrive.ts`.

---

### SW-8: Missing Empty States for Zero-Data Scenarios (MINOR)
None of the 5 wireframes specify what renders when there is no data at all (brand new account, no models, no content yet). Convex queries return `undefined` while loading and `[]` when empty. Workers must handle both states. Add to every page spec: `if (!data) return <LoadingState />; if (data.length === 0) return <EmptyState />;`

---

### SW-9: `ContentPageShell` `filterRightSlot` Overflow on Small Screens (MINOR)
The R&D Table, Raw Content Queue, PTP Approval, and Content Scheduler all pack multiple controls into `filterRightSlot` (4–6 pills). On a 1280px viewport with a 280px sidebar, the content area is ~920px. 6 pills at ~100px each = 600px — this is fine on desktop but will overflow at standard laptop sizes (1366px wide). Add `flex-wrap` to the filter right slot container, or move secondary filters to a `···` overflow menu when the viewport is below 1400px. Document this responsive behavior in each wireframe.

---

*End of CRITIC_FIXES.md — 2026-04-12*
