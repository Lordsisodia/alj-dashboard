# MASTER FEATURE GAPS SUMMARY

**Date:** 2026-04-12
**Sources:** Research reports 01-12 + Agency Dashboard Spec V2
**Cross-reference:** Market landscape vs. isso-dashboard product spec

---

## SECTION 1: FEATURES WE ALREADY HAVE THAT COMPETITORS DON'T

These are genuine differentiators in our spec that no single competitor offers. This is the moat.

| # | Feature | Spec Reference | Why No Competitor Has It |
|---|---------|---------------|--------------------------|
| 1 | **5-dashboard unified product** (Agency + Content Gen + Model + Chat + TBD) | Spec 1.0 | Competitors are single-persona tools. Infloww = chatters only. Later = scheduling only. CreatorHero = shift management only. Nobody ships owner + editor + model + chatter views in one product. |
| 2 | **Swipe Deck for models** (Tinder-style content discovery with one-tap recording) | Spec 6.5 | No OFM tool or social scheduling tool has a swipe-to-create content discovery mechanism. Closest analog is Pinterest browsing, but we add the direct-to-camera action. |
| 3 | **Full content pipeline as a closed loop** (Analytics > R&D > Request > Create > Edit > PTP > Schedule > Analytics) | Spec 7.0 | Every competitor handles 1-2 stages. Later/Buffer = schedule+analytics. Frame.io = review only. Airtable = table only. We close the entire 10-step loop in one product. |
| 4 | **Model gamification system** (XP, levels, streaks, challenges, leaderboard, rewards) | Spec 6 + enhancements | No OFM tool gamifies model behavior. No social scheduling tool has gamification. This is completely greenfield. |
| 5 | **Unified social + webcam + OF earnings in one P&L** | Spec 3.2 + 3.6 + 6.4 | No tool combines Instagram analytics + webcam streaming stats + OnlyFans/Fans.ly revenue in a single owner P&L. Metricool/Hootsuite = social only. CreatorHero = OF only. Restream = streaming only. |
| 6 | **R&D Table with Graph View** (content idea relationships as a network) | Spec 7 (R&D step) | Airtable has table views. Notion has table views. Nobody offers a D3 force-directed graph of content idea clusters alongside a structured table. |
| 7 | **PTP approval with unlimited version tracking + side-by-side comparison** | Spec 3.5 + enhancement 10 | Frame.io has version stacks but no scheduling integration. Planable has approval but no version comparison. We combine version diff + approval + one-click scheduling in one flow. |
| 8 | **AI video analysis (Gemini) feeding directly into editor briefs** | Spec 5.2 | Opus Clip clips videos. Descript edits transcripts. Nobody auto-generates structured editor briefs (hook, caption, tags, format) from raw footage analysis and feeds them into an editing queue. |
| 9 | **Content request inbox with in-app one-tap recording** | Spec 6.3 | Content Snare collects documents. No tool sends video briefs to talent and lets them record + upload from the same screen on mobile. |
| 10 | **Multi-platform webcam live view from agency dashboard** | Spec 3.6 | Restream streams to platforms. No tool lets an agency owner watch a model's live stream from within their management dashboard across 17+ adult platforms. |
| 11 | **Payroll deduction with agency commission logic** | Spec 3.7 + 3.10 | Deputy/Homebase handle standard overtime wages. No scheduling tool handles agency commission splits, expense advance recovery, or contractor vs. PAYE mixed rosters. |
| 12 | **Role-based multi-view switching** (same user can hold multiple roles and switch dashboards) | Spec 1.0 (Roles) | Most tools have fixed role = fixed view. We allow a partner to switch between owner view and marketing manager view with full action capability in both. |

---

## SECTION 2: FEATURES WE'RE MISSING THAT COMPETITORS ALL HAVE (Table Stakes)

These are present in virtually every competitor in the category. Shipping without them makes us look incomplete.

### Agency Dashboard (Owner/Manager)

| # | Missing Feature | Who Has It | Impact if Missing |
|---|----------------|-----------|-------------------|
| 1 | **Global date range selector** (one picker updates every chart on the page) | Metricool, Hootsuite, Buffer, Baremetrics | Every analytics page needs this. Without it, users configure date ranges per-widget. Research report 02 confirms no social tool does this well but Baremetrics does. |
| 2 | **Exportable white-label reports** (PDF/PPT with agency branding) | Metricool (Advanced+), Hootsuite (Advanced+) | Agency owners share reports with partners/investors. No export = manual screenshot work. |
| 3 | **Competitor benchmarking** (track rival accounts' posting frequency and engagement) | Metricool (up to 10 profiles), Hootsuite | Owners want to see how their models compare to competitors. Without it, they use Metricool separately. |
| 4 | **Team messaging / internal chat** | Deputy, When I Work, Homebase, Slack | Staff need to coordinate shifts, content handoffs, and emergencies. Without built-in messaging, they use WhatsApp/Telegram outside the tool. |
| 5 | **Shift swap workflow** (employee-initiated swap > coworker accepts > manager approves) | Deputy, When I Work, Homebase | Standard in every shift management tool. Not in our spec. |
| 6 | **GPS/location-verified clock-in** | Deputy, When I Work, Homebase | Prevents buddy punching and verifies remote workers are where they say they are. |

### Editor View

| # | Missing Feature | Who Has It | Impact if Missing |
|---|----------------|-----------|-------------------|
| 7 | **Frame-accurate video annotation** (click on a frame, leave a timestamped comment) | Frame.io (core feature) | Editors and reviewers communicate via text descriptions instead of pointing at the exact frame. Massive productivity loss. |
| 8 | **Comment-to-task conversion** (reviewer comment becomes an actionable to-do) | Filestage | Without this, rejection feedback is unstructured text. Editors must manually parse comments into work items. |
| 9 | **Virality/quality score on finished clips** | Opus Clip (Virality Score 0-99) | Editors and approvers have no data-driven signal for which clips will perform. Approval becomes purely subjective. |

### Model View

| # | Missing Feature | Who Has It | Impact if Missing |
|---|----------------|-----------|-------------------|
| 10 | **Push notification with send-time optimization** | Duolingo, every mobile-first app | Our spec mentions notifications (Spec 9) but has no AI-driven optimal send-time. Generic blast notifications get disabled by users. |

### Content Pipeline

| # | Missing Feature | Who Has It | Impact if Missing |
|---|----------------|-----------|-------------------|
| 11 | **Bulk/CSV import for scheduling** | Hootsuite (up to 350 posts via CSV), Later | When scheduling content for 5+ models across multiple platforms, one-by-one is painful. |
| 12 | **Best-time-to-post recommendations** | Later, Buffer, Hootsuite, Metricool | Without this, scheduling is guesswork. Every scheduling tool has this. |
| 13 | **Hashtag suggestions and grouping** | Later, Hootsuite, Planoly | Editors manually research hashtags outside the tool. |

---

## SECTION 3: HIGH-VALUE FEATURES TO ADD

Features from competitors that would significantly improve our product but are not in the spec yet. Ranked by impact.

### HIGH IMPACT

| # | Feature | Source | Dashboard | Why It Matters |
|---|---------|--------|-----------|---------------|
| 1 | **Fan CRM with spend segmentation** (Whales / Mid / Low tiers) | Infloww, FansMetric, CreatorHero | Chat Dashboard (deferred) / Agency Dashboard | Every OFM tool segments fans by spend. When chat launches, this is non-negotiable. Start the data model now even if chat is deferred. Revenue per fan = the core OFM metric. |
| 2 | **Chatter performance tracking** (revenue attribution per chatter per shift) | CreatorHero, FansMetric, Infloww | Agency Dashboard | The spec tracks shift attendance (3.7) but not revenue attribution per chatter. Alex needs to know which chatter generates the most revenue, not just who clocked in on time. |
| 3 | **AI-assisted caption + hook generation at upload time** | Opus Clip (hooks), TikTok Creative Center (scripts), Gemini API | Editor View | Spec 5.4 says "AI auto-reviews uploaded reel" for captions. Expand this: also generate 3 hook variants, recommended hashtags, and a virality estimate. The Gemini + Opus Clip stack from research 09 makes this achievable. |
| 4 | **Real-time trend intelligence feed** (trending hashtags, sounds, formats) | TikTok Creative Center (free) | Editor View (Ideas Lab) | Spec 5.2 (Ideas Lab) has AI suggestions but no live trend data. TikTok Creative Center is free and provides real-time trend signals. Embed this into the Ideas Lab as a "Trending Now" panel. |
| 5 | **Content calendar with Instagram grid preview** | Later, Planoly | Agency Dashboard / Marketing Manager | Spec 3.4 has a calendar but no visual grid preview. Instagram-first agencies need to see how the feed will look aesthetically before publishing. Later and Planoly built their businesses on this. |
| 6 | **Drag-and-drop schedule builder with real-time labor cost** | Deputy, When I Work, Homebase | Agency Dashboard (Schedule) | Spec 3.8 describes schedule views but no drag-to-assign or cost display. Every competitor shows cost-per-shift inline as you build the schedule. |

### MEDIUM IMPACT

| # | Feature | Source | Dashboard | Why It Matters |
|---|---------|--------|-----------|---------------|
| 7 | **Approval SLA tracking** (time-in-queue per reviewer, bottleneck alerts) | Research 01 gap, Research 03 gap | Agency Dashboard | Spec mentions PTP approval but no SLA. If a partner takes 3 days to approve, the pipeline stalls. Track average approval time per person and flag overdue items. |
| 8 | **Semantic video search across content library** ("find all outdoor shoots with good lighting") | Gemini API embeddings, TwelveLabs | Editor View (Search & Suggest) | Spec 5.3 has keyword search. Upgrade to semantic search using Gemini embeddings over video metadata. Editors search by meaning, not just tags. |
| 9 | **Model utilization rate** (booked hours / available hours) | Research 07 gap | Agency Dashboard (Models Roster) | Spec 3.9 shows model details. Add utilization percentage -- key metric for agency capacity planning. Shows which models are underutilized. |
| 10 | **Automated quality scoring on chat messages** (tone, compliance, sales effectiveness) | Research 08 gap | Chat Dashboard (deferred) | No OFM tool does this. Pre-send quality scoring prevents brand voice drift and flags risky messages. Competitive differentiator for when chat launches. |
| 11 | **Split inbox for chatters** (divide one model's inbox across multiple chatters to prevent overlap) | FansMetric | Chat Dashboard (deferred) | When two chatters work the same model simultaneously, they can accidentally message the same fan. FansMetric solves this with split inboxes. |
| 12 | **Content performance tagging back to R&D** (auto-tag R&D entries with post performance data after publishing) | Research 02 gap | Content Pipeline (cross-role) | Spec enhancement 17 mentions this but it's approved, not built. When a post from the R&D table performs well, automatically update the original R&D entry with performance metrics. Closes the analytics loop. |
| 13 | **Shift handover context** (AI-generated brief for incoming chatter summarizing active conversations) | CreatorHero (AI summarizer) | Chat Dashboard (deferred) | When shifts change, chatters waste time re-reading conversations. An auto-generated handover brief saves ~2 min per subscriber per day. |

### LOW IMPACT (Nice-to-Have)

| # | Feature | Source | Dashboard | Why It Matters |
|---|---------|--------|-----------|---------------|
| 14 | **White-label client-facing approval portal** (external reviewers approve without creating an account) | Planable | Agency Dashboard (PTP) | Useful if the agency ever has external brand partners reviewing content. Low priority for current team size. |
| 15 | **TV/wallboard mode** (dashboard displayed on office monitor) | Geckoboard | Agency Dashboard | Office visibility of KPIs. Nice for team culture. Not critical. |
| 16 | **Recurring post scheduling with duplicate detection** | Planable, Research 01 gap | Content Pipeline | Prevents the same content being accidentally scheduled twice across models. Low frequency issue currently. |
| 17 | **Browser extension for quick content capture** | Buffer | Editor View | One-click save from Instagram/TikTok while browsing. Useful but not essential -- editors already have the Ideas Lab. |
| 18 | **AI voice cloning for audio corrections** | Descript (Overdub) | Editor View | Fix audio mistakes by typing. Very niche use case for the current team. |
| 19 | **Multi-camera management for streams** | Research 06 gap | Webcam Dashboard | Managing 2-4 camera setups across platforms. Only relevant when webcam operations scale significantly. |

---

## SECTION 4: RECOMMENDED TECH STACK

Based on research reports 10 (Frontend), 11 (Backend), and 12 (Creator Economy).

### Frontend

| Layer | Recommendation | Why |
|-------|---------------|-----|
| **Framework** | Next.js 16 App Router + React 19 + TypeScript 5 | Already in use. Industry standard 2026. |
| **Styling** | Tailwind CSS v4 + shadcn/ui | Already in use. Copy-paste model = full ownership. |
| **Charts/KPIs** | Tremor (built on Recharts + Tailwind) | Native Tailwind v4. 35+ dashboard components. Charts + KPI cards + data tables in one package. |
| **Data Tables** | TanStack Table v8 | Headless, TypeScript-first, MIT. Gold standard for Airtable-style table views. Pair with shadcn/ui. |
| **Calendar** | FullCalendar (@fullcalendar/react) | Most feature-complete. Plugin architecture keeps bundle lean. Requires `"use client"`. |
| **Kanban / Drag-and-Drop** | dnd-kit | Modern, accessible, MIT. Current gold standard. Production Kanban starters exist with Next.js + Tailwind. |
| **Swipe Gestures** | Framer Motion (motion) | 30k+ stars, active. Full gesture support (drag, swipe, tap). Build swipe cards with `drag` + `onDragEnd`. More flexible than react-tinder-card. |
| **Animations** | Framer Motion (motion) | Same library. Level-up celebrations, confetti, milestone modals. |
| **Graph View (R&D)** | D3.js (force-directed) | No off-the-shelf React graph component fits. D3 force layout with React wrapper. Already used in SISO Library knowledge graph. |
| **Admin Template Base** | shadcn/ui dashboard starter (MIT) | Already aligned with existing isso-dashboard patterns. |

### Backend / Infrastructure

| Layer | Recommendation | Why |
|-------|---------------|-----|
| **Database** | Convex (already in use) | Real-time, serverless. Keep as primary. |
| **Financial data sync** | google-spreadsheet (npm) for simple sync; @googleapis/sheets for bulk | Bridge to Google Sheets until full Convex migration. Service account auth. |
| **File storage sync** | @googleapis/drive | Google Drive integration for model content folders. Resumable uploads for video. |
| **Job queue** | BullMQ + Redis (Upstash managed) | Video processing, social API polling, sheet sync. Convex HTTP actions trigger producers. |
| **Background scheduling** | Inngest | Next.js-native cron/event-driven jobs. Approval notifications, scheduled posts, daily syncs. No separate infra. |
| **Approval workflows** | n8n (self-hosted Docker) | Visual approval pipelines. 183k stars, free self-hosted. Webhook from Convex into n8n. |
| **Social posting** | Ayrshare SDK (managed) | Fastest path to multi-platform posting. REST API, handles OAuth/token refresh. |
| **Social analytics** | Platform APIs directly (Instagram Graph API, Twitter API) + Ayrshare for aggregation | No single OSS aggregator is production-ready. |

### AI / Content Intelligence

| Layer | Recommendation | Why |
|-------|---------------|-----|
| **Video analysis** | Google Gemini 2.5 Pro | Frame analysis, OCR, scene segmentation, brief generation. Confirmed in spec. |
| **Auto-clip extraction** | Opus Clip Pro ($29/mo) | Virality scoring, active speaker tracking, vertical reframing. |
| **Trend intelligence** | TikTok Creative Center (free) | Real-time hashtag/sound/creator trends. |
| **Final editing** | CapCut Pro (~$8-20/mo) | AutoCut, 130+ language captions, social export. |
| **Content moderation** | NudeNet (OSS, ONNX) | NSFW detection for vault auto-tagging. 18-label classification. |

### Streaming

| Layer | Recommendation | Why |
|-------|---------------|-----|
| **RTMP relay** | SRS (Simple Realtime Server) | 28.7k stars, MIT, most capable OSS media server. RTMP + WebRTC + HLS. |
| **Multi-destination** | Restream API (for mainstream) + custom RTMP router (for adult platforms) | No single tool covers 17+ adult platforms. |

### Estimated Monthly Tool Cost (Full Stack)

| Tool | Cost |
|------|------|
| Ayrshare (social posting) | ~$50-100/mo (depends on profiles) |
| Opus Clip Pro | $29/mo |
| CapCut Pro (per editor) | ~$8-20/mo x 3 editors = ~$24-60/mo |
| Upstash Redis (BullMQ) | ~$10-30/mo |
| Inngest | Free tier (self-hosted) or ~$25/mo (cloud) |
| n8n | Free (self-hosted Docker) |
| SRS | Free (self-hosted) |
| Restream (if needed) | $49-239/mo |
| **Total external tooling** | **~$195-500/mo** |

---

## SECTION 5: MARKET POSITIONING

### Competitive Landscape Summary

| Competitor | What They Do | What They Don't Do |
|-----------|-------------|-------------------|
| **Infloww** | Best OFM chatter CRM. Smart Lists, Messages Pro, Vault Pro. | No social analytics, no scheduling, no editor tools, no webcam, no model-facing view. |
| **Supercreator** | Best AI chatter (Izzy co-pilot). Fan profiling, auto-captions. | No agency P&L, no shift management, no content pipeline, no model gamification. |
| **CreatorHero** | Best shift/team management. Chatter audit logs, revenue attribution. | No content creation tools, no social analytics, no scheduling, no model view. |
| **FansMetric** | Cheapest analytics. Split inbox, ROI tracking. | No scheduling, no content pipeline, no webcam, no model engagement. |
| **Later.com** | Best Instagram visual planning. Grid preview, auto-queue. | No OFM features, no approval workflows, no editor tools, no P&L. |
| **Hootsuite** | Most platforms (20+). Bulk CSV, approval workflows. | Expensive ($99-249/mo). No OFM, no talent management, no gamification. |
| **Buffer** | Simplest scheduling UX. Clean analytics. | No approval flow, no team management, no OFM, limited platforms. |
| **Planable** | Best approval workflow. Client-facing review portal. | No analytics, no OFM, no editor tools, no shift management. |
| **Deputy/When I Work** | Best shift scheduling. AI auto-scheduler, overtime alerts. | No content tools, no social analytics, no OFM, no creator economy features. |

### Where We Sit

**We are the only product that combines all five layers:**

```
1. AGENCY OPERATIONS (P&L, shifts, team, billing)
   +
2. CONTENT PIPELINE (ideas > creation > editing > approval > scheduling > analytics)
   +
3. SOCIAL ANALYTICS (multi-platform, multi-model, cross-account)
   +
4. WEBCAM/STREAMING MANAGEMENT (multi-platform, live view, earnings)
   +
5. MODEL ENGAGEMENT (mobile-first, gamified, swipe deck, content requests)
```

No competitor touches more than 2 of these layers. Most handle only 1.

### The Pitch

**For agencies:** "Stop paying for 6 different tools that don't talk to each other. One dashboard for your entire operation -- from content ideas to published posts to revenue tracking."

**For models:** "The only app that makes content creation feel like a game. Swipe for ideas, record in one tap, watch your level go up."

**Against Infloww/Supercreator:** "They handle DMs. We handle everything else -- and when our chat module launches, it'll have the analytics and team management built in from day one."

**Against Later/Hootsuite:** "They schedule posts. We run the entire operation behind those posts -- from the idea that sparked them to the revenue they generated."

### Defensibility

1. **Closed-loop pipeline** -- competitors would need to build 8 additional product surfaces to match us
2. **Vertical specificity** -- built for OFM agencies, not generic social media managers
3. **Model gamification** -- completely greenfield; no competitor is even attempting this
4. **Multi-platform earnings aggregation** (OF + Fans.ly + webcam + social) -- open market gap confirmed across all 12 research reports
5. **AI content intelligence** (Gemini video analysis > structured editor briefs) -- no competitor auto-generates production briefs from raw footage

### Key Risk

All OFM tools operate in a TOS grey zone. OnlyFans has no public API. Our architecture must treat OF data as pull-based with graceful degradation -- never tight-couple to private endpoints. Build the dashboard as a standalone management tool that works with or without OF API access.

---

## ACTION ITEMS

### Must-Do Before Launch (Table Stakes)
- [ ] Global date range selector on all analytics pages
- [ ] Best-time-to-post recommendations in scheduler
- [ ] Exportable reports (PDF minimum)
- [ ] Frame-accurate video annotation in PTP review
- [ ] Drag-and-drop shift builder with cost display
- [ ] Hashtag suggestions in scheduling composer

### Should-Do in Phase 2
- [ ] Fan CRM data model (even if chat is deferred, build the schema)
- [ ] Chatter revenue attribution tracking
- [ ] AI caption + hook generation at upload (Gemini + Opus Clip)
- [ ] TikTok Creative Center trend feed in Ideas Lab
- [ ] Instagram grid preview in calendar
- [ ] Approval SLA tracking dashboard
- [ ] Shift swap workflow
- [ ] Content performance > R&D feedback loop

### Phase 3 (Differentiation)
- [ ] Semantic video search (Gemini embeddings)
- [ ] Model utilization rate metric
- [ ] Split inbox for chatters
- [ ] Shift handover AI brief
- [ ] TV/wallboard mode
- [ ] Automated chat quality scoring

---

*Compiled from 12 research reports covering 40+ tools across scheduling, analytics, approval workflows, content pipelines, gamification, streaming, team management, chat/messaging, AI content intelligence, frontend libraries, backend infrastructure, and creator economy tooling.*
