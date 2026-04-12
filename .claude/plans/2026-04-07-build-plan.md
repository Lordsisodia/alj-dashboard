# Build Plan — April 7, 2026
**Owner:** agency.clients-pm (Shaan's planning brain)
**Goal:** All 5 ISSO nav sections fully working — real UI, real AI, real DB, real Drive — by EOD.

---

## The 5 Sections (pipeline order: collect → analyze → curate → generate → monitor)

| # | Icon | Hotkey | Pages | Status |
|---|------|--------|-------|--------|
| 1 | Recon | ⌘1 | Creators, Feed, Scraping Log | UI exists, seed data only |
| 2 | Intelligence | ⌘2 | Trends, Analysis, Insights | UI exists, seed data only |
| 3 | Hub | ⌘3 | Swipe & Rate | UI exists, swipe mechanics broken |
| 4 | Content Gen | ⌘4 | Dashboard, Scenes, Generate, Gallery, Models | UI partial, no real pipeline |
| 5 | Agents | ⌘5 | Activity, Reports, Requests | UI exists, no real execution |

**Persistent nav also needs:** Schedule, Analytics, Models, Team, Notifications (not built), Tools

---

## Today's Priority Stack

### P0 — Content Gen (⌘4) — The Core Product
This is the whole reason ISSO exists. Get this working end-to-end first.

**Pages:**
- `/isso/content-gen` — Dashboard: job status, pipeline overview, cost tracker
- `/isso/content-gen/scenes` — Scene manager: upload source clips, assign model face ref
- `/isso/content-gen/generate` — Fire FLUX (face transfer) → Kling (video gen) jobs
- `/isso/content-gen/gallery` — Review completed videos, send to Drive
- `/isso/content-gen/models` — Model config: face reference image, niche, handle

**AI to wire:**
- FLUX.2 Dev API — face transfer (scene image + face ref → output image)
- Kling v3 / Higgsfield DoP — video generation (output image → 8s video)
- Anthropic/Gemini — auto-caption, brief suggestion per scene

**DB to wire:**
- Convex `content`, `mediaUploads`, `costs`, `agentDebugLogs` tables
- Real-time job status updates via Convex subscriptions (not polling)

**Drive to wire:**
- Complete the OAuth token save flow (currently Settings page only shows the button)
- Auto-upload approved gallery videos to client's Drive folder
- Delivery receipt written back to Convex

---

### P1 — Recon (⌘1)
**Pages:**
- `/isso/recon` — Creators: tracked accounts table (Airtable-style, in-progress redesign per `creators-table-airtable-redesign.md`)
- `/isso/community` — Feed: real scraped posts OR working interactive mock
- `/isso/recon` (tab) — Scraping Log: live event stream from Convex `agentDebugLogs`

**AI to wire:**
- Niche scoring per creator (Claude API call on scrape)
- Viral velocity detection — flag accounts with >5x engagement spike

**DB:** Convex `trackedAccounts`, `analytics`, `agentDebugLogs`

---

### P2 — Intelligence (⌘2)
**Pages:**
- `/isso/intelligence` (tab: Trends) — keyword trend cards with sparklines
- `/isso/intelligence` (tab: Analysis) — AI breakdown of top-performing content patterns
- `/isso/intelligence` (tab: Insights) — Pulse Report: async Claude job → structured brief

**AI to wire:**
- Claude API: analyze scraped posts → extract hooks, pacing, caption patterns
- Gemini: trend keyword extraction from community feed

**DB:** Convex `intelligence` table — store analysis results with timestamps

---

### P3 — Hub (⌘3)
**Pages:**
- `/isso/community` — Swipe & Rate: keyboard (←/→) + click swipe mechanics need to actually fire Convex mutations (approve/reject/save)

**AI to wire:**
- Rating data feeds back into Intelligence scoring model
- Auto-tag content type on swipe (hook/transition/CTA/lifestyle)

**DB:** Swipe decisions write to Convex `approvals` or new `ratings` table

---

### P4 — Agents (⌘5)
**Pages:**
- `/isso/agents` (tab: Activity) — Live Convex subscription to `agentDebugLogs`
- `/isso/agents` (tab: Reports) — Claude-generated daily summary of agent runs
- `/isso/agents` (tab: Requests) — Human-in-the-loop queue: agent asks for approval before proceeding

**AI to wire:**
- Claude API: summarize agent run logs into readable daily report

**DB:** `agents`, `agentDebugLogs` — real-time subscriptions

---

### P5 — Persistent Nav Gaps
- `/isso/notifications` — **NOT BUILT**. Needs creating. Pulls from viral alerts, generation complete, approval pending, Drive delivery. Simple list with badge.
- `/isso/schedule` — Calendar grid exists. Wire Convex `schedule` mutations for drag-to-create.
- `/isso/analytics` — Charts exist. Wire real data from Convex `analytics` table.

---

## Integration Checklist

| Integration | Status | Notes |
|-------------|--------|-------|
| Convex DB | ✅ Schema defined | Needs real queries/mutations wiring into UI |
| Clerk Auth | ✅ Working | Done |
| Google Drive OAuth | ⚠️ UI only | Token save + auto-upload flow missing |
| FLUX.2 API | ❌ Not wired | ALJ has the scripts — port into Convex action |
| Kling v3 API | ❌ Not wired | ALJ has the scripts — port into Convex action |
| Anthropic Claude | ⚠️ SDK in package.json | No active API calls yet |
| Gemini | ⚠️ Ideas page stub | Needs real API key wired |
| Instagram scraper | ❌ Seed data | Real scraper not integrated |

---

## Agent Delegation Map (for ~10 agent team)

Shaan is low on Sonnet tokens this week (~80% weekly used). Route heavy execution to minimax-capable agents.

| Agent | Task | Model |
|-------|------|-------|
| **clients-pm (me)** | Planning, decisions, architecture review | Sonnet (use sparingly) |
| **client-builder A** | Content Gen pipeline UI + Convex wiring | Minimax 2.7 |
| **client-builder B** | Recon + Intelligence page wiring | Minimax 2.7 |
| **client-builder C** | Hub swipe mechanics + Agents live feed | Minimax 2.7 |
| **client-builder D** | Notifications page + persistent nav gaps | Minimax 2.7 |
| **client-builder E** | Google Drive OAuth completion + auto-upload | Minimax 2.7 |
| **client-builder F** | FLUX + Kling Convex actions (port from ALJ scripts) | Minimax 2.7 |
| **client-evaluator** | QA each section after builder ships | Minimax 2.7 |

---

## Definition of Done (EOD April 7)

- [ ] All 5 icon sections are navigable with working tabs/pages
- [ ] Content Gen: can fire a real FLUX job and see result in Gallery
- [ ] Content Gen: approved video auto-uploads to Google Drive
- [ ] Recon: scraping log shows real (or real-time mock) events from Convex
- [ ] Intelligence: at least one AI analysis report generates on demand
- [ ] Hub: swipe left/right actually writes to DB
- [ ] Agents: Activity tab subscribes to real Convex `agentDebugLogs`
- [ ] Notifications page exists and shows system events
- [ ] No TypeScript errors (`npm run build` passes)
- [ ] All seed data replaced with real Convex queries where possible

---

## Open Questions (must answer before EOD)

1. **FLUX + Kling API keys** — are they already in `.env.local`? Or do we need to set them up?
2. **Google Drive folder ID** — where does ALJ's output go? Needs a fixed folder per client.
3. **AI provider for briefs** — Claude or Gemini? (Gemini is cheaper for high-volume brief gen)
4. **Scenes page** — `/isso/content-gen/scenes` route doesn't exist yet. Build from scratch or redirect to content upload?
5. **Swipe data schema** — write swipe decisions to `approvals` (reuse) or new `ratings` table?

---

## Key Files to Know

| File | Why it matters |
|------|---------------|
| `src/shared/layout/isso-sidebar/sidebar-config.tsx` | The 5 sections + all page routes — source of truth for nav |
| `convex/schema.ts` | All 15+ DB tables |
| `src/features/content/` | Content upload — reference for Content Gen scenes |
| `industries/model_management/clients/ALJ_OFM/alex-ofm/CONTEXT.md` | The real FLUX→Kling pipeline workflow |
| `memory/journal.md` | Last session state |
| `.omc/plans/creators-table-airtable-redesign.md` | Recon creators table in-progress |
| `.omc/plans/intelligence-section-redesign.md` | Intelligence redesign in-progress |
