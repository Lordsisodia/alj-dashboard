# Tasks — ui.content-gen

## P0 — Add the missing pill bar (minimax agent task)

**Pattern reference:** `src/features/intelligence/components/IntelligenceFeaturePage.tsx`
**Standard:** `ContentPageShell` + internal `useState<Tab>` + `AnimatePresence` + `StepNum` numbered pills

**The problem:** Every other icon (Recon, Intelligence, Hub, Agents) has one `*FeaturePage.tsx`
that passes `tabs` to `ContentPageShell`, which renders the pill bar. Content Gen instead uses
**separate Next.js routes** per page — so no shared shell, no pill bar.

**The fix:**

1. Create `src/features/content-gen/components/ContentGenFeaturePage.tsx` — copy the structure of `IntelligenceFeaturePage.tsx`:
   ```
   tabs: [
     { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={12} /> },
     { id: 'scenes',    label: 'Scenes',    icon: <StepNum n={1} /> },
     { id: 'generate',  label: 'Generate',  icon: <StepNum n={2} /> },
     { id: 'gallery',   label: 'Gallery',   icon: <StepNum n={3} /> },
     { id: 'models',    label: 'Models',    icon: <StepNum n={4} /> },
   ]
   nextProduct={{ label: 'Agents', icon: <ProductIcon product="agents" size={16} />, href: '/isso/agents' }}
   ```
2. Import existing sub-views (already built — just reuse them):
   - `DashboardFeaturePage` → tab `dashboard`
   - `ScenesFeaturePage` → tab `scenes`
   - `LivePipelinePage` → tab `generate`
   - `GalleryFeaturePage` → tab `gallery`
   - `ContentGenModelsFeaturePage` → tab `models`
3. Update `src/app/isso/content-gen/page.tsx` to render `<ContentGenFeaturePage />` instead of `<DashboardFeaturePage />`
4. Delete the now-redundant sub-route files:
   - `src/app/isso/content-gen/scenes/page.tsx`
   - `src/app/isso/content-gen/generate/page.tsx`
   - `src/app/isso/content-gen/gallery/page.tsx`
   - `src/app/isso/content-gen/models/page.tsx`
   - `src/app/isso/content-gen/queue/page.tsx`
5. Run `npm run build` — verify no TypeScript errors

**Do NOT rewrite the sub-view components.** Just wrap them in the new shell.

---

## Other open tasks
- [ ] Wire Replicate Kling video gen via Convex action (API key from Shaan pending)
- [ ] Wire FLUX face transfer via Convex action
- [ ] Complete Google Drive upload (`drive.files.create`) — read-only wired, upload not built
- [ ] Replace seed data in Dashboard, Scenes, Gallery with real Convex queries
- [ ] Fix `LivePipelinePage` — `cgApi = null` stub, retry/cancel are no-ops
- [ ] Add 3 AI features to dashboard (coordinate with feat.ai)

## Blocked
- Replicate API key — Shaan to provide
- Google Drive folder ID for ALJ delivery — Shaan to confirm

## Done
- [x] Dashboard pill component exists (`DashboardFeaturePage.tsx`)
- [x] All 5 sub-views built and polished
- [x] Models page wired to real Convex (`api.models.*`)
- [x] Drive read-only wired (`/api/drive/files`, `/api/drive/stream/[id]`)
