# Recon — Feature Documentation

ISSO's competitor intelligence product. Scrapes public Instagram/TikTok profiles, surfaces content patterns, and feeds insights into the rest of the pipeline.

---

## Pipeline position

```
Recon  →  Intelligence  →  Hub  →  Content Gen  →  Schedule  →  Analytics
 ↑
 You are here
```

---

## The Four-Tab Flow

Each tab is one stage. The step numbers (①②③④) are visible in the tab bar.

```
① Discovery  →  ② Creators  →  ③ Pipeline  →  ④ Community Feed
   Find            Approve &       Scraper         Browse what
   candidates      track           runs             they post
```

---

## ① Discovery pill

**Route:** `/isso/recon` (default tab)
**Orchestrator:** `components/creators/DiscoveryTab.tsx`

A candidate triage queue. Profiles land here from manual additions, bulk paste, or (Phase 2) Apify niche auto-discovery.

### Features

| Feature | Description |
|---|---|
| **Outlier ratio** | `avgViews ÷ followers` — primary breakout signal. Queue always sorted descending by this. |
| **Ratio badge** | Colour-coded pill on every row and in the detail panel. Pink ≥2×, amber ≥1.5×, green ≥1×, grey below. Zap icon fires at ≥2×. |
| **Viral velocity alert threshold** | Configurable 5×/10×/20× selector. When a creator's ratio spikes above this, an alert fires. |
| **Candidate queue** | Filtered by All / Pending / Approved / Rejected. Sorted by outlier ratio desc within each filter. |
| **Auto-advance** | After approve/reject, cursor jumps to the next highest-ratio pending candidate. |
| **Detail panel** | Right-side card: gradient header, ratio hero block, stat grid, discovery source, 6-post sample grid, Approve/Reject/Restore CTAs, Instagram link. |
| **Run Discovery** | 2.4s simulated batch find — drops 2 new pending candidates at top (2.50× and 1.80× ratio). |
| **Stat bar** | Total candidates / Pending / Approved mini-cards. |
| **Add Handle modal** | Single handle + niche → added as pending. |
| **Bulk Import modal** | Paste handles (one per line or comma-separated) + niche → all added as pending. |

### Candidate status lifecycle

```
Pending ──► Approved (→ Creators)
        ──► Rejected (faded)
Both Approved/Rejected can be Restored → Pending
```

### Component tree

```
DiscoveryTab.tsx                        ← orchestrator (state + layout, ~120 lines)
├── discovery/MiniStat.tsx              ← stat card in top bar
├── discovery/AlertThresholdPicker.tsx  ← 5×/10×/20× viral alert selector
├── discovery/CandidateRow.tsx          ← queue list item (avatar, meta, ratio badge, actions)
├── discovery/DetailPanel.tsx           ← right-side candidate detail card
│   ├── discovery/RatioBadge.tsx        ← colour-coded outlier ratio pill
│   └── discovery/SamplePostGrid.tsx    ← 3×2 gradient thumbnail grid
└── discovery/EmptyState.tsx            ← empty queue placeholder + CTA

discovery/data.ts       ← SEED_CANDIDATES (12), RUN_DISCOVERY_RESULTS (2)
discovery/constants.ts  ← STATUS_FILTERS, STATUS_STYLE, ALERT_THRESHOLDS
discovery/utils.ts      ← fmtViews(), getRatioColor()
```

### Candidate type

```ts
interface Candidate {
  id: number;
  handle: string;             // e.g. "@gfe.royale"
  displayName: string;
  niche: string;              // e.g. "GFE", "ABG", "Fitness"
  nicheColor: string;         // hex brand colour per niche
  avatarColor: string;        // may differ from nicheColor
  initials: string;           // auto-generated
  followers: string;          // display e.g. "67K"
  followersRaw: number;       // numeric for ratio calculation
  avgViews: number;           // avg views per post
  outlierRatio: number;       // avgViews / followersRaw — the KEY signal
  engagementRate: string;     // display e.g. "9.3%"
  postsPerWeek: number;
  suggestedBy: string | null; // null = manually added
  discoveredAt: string;       // display e.g. "Today", "3 days ago"
  status: 'pending' | 'approved' | 'rejected';
  sampleGradients: [string, string][]; // 6 colour pairs for placeholder thumbnails
}
```

---

## ② Creators — Active tracking list

**Route:** `/isso/recon?tab=creators`
**Component:** `components/creators/CreatorsTable.tsx`

Master list of creators being actively tracked. Each row:
- Profile picture (enriched) or avatar initials
- Profile health bar (0–100% across 8 enrichable fields — `computeProfileHealth()`)
- Composite score badge, followers, eng. rate, posts/week
- 7-day SVG sparkline trend, coloured by niche
- Live stats merged from Convex (`useQuery(api.intelligence.getCreatorStats)`)

**Filters:** Niche, Platform, Scraping Status, Follower range, Eng. rate, Score, Health
**Actions:** Favourite, Enrich (simulated Apify), Pause/Resume, View on Instagram
**Click row:** Opens `CreatorDetailView` — full profile + reels FeedView

**Data:** `COMPETITORS[]` in `constants.tsx` — 8 real accounts (4 active, 4 paused).

---

## ③ Pipeline — Scraper operations

**Route:** `/isso/recon?tab=log`
**Component:** `components/creators/LogDashboard.tsx`

### Sub-components

| Component | What it shows |
|---|---|
| `PipelineFunnel.tsx` | 5-stage funnel: Basket → Scraped → Refined → Generated → Posted |
| `StatCard.tsx` | Posts today, Active creators, Total in library, Last run |
| `VolumeChart.tsx` | 14-day bar chart of daily scrape volume |
| `CreatorPipelineRow` (inline) | Per-creator progress bar (postsToday / 65 target), job badge, staleness dot |
| `ActivityFeed.tsx` | Timestamped scrape event log from `LOG_ENTRIES` |

### Funnel stages

```
Basket (8)  →  Scraped (284)  →  Refined (47)  →  Generated (12)  →  Posted (8)
```

Hover any stage to see conversion % from the previous stage.

### Run All Scrapers

Incrementing `runAllTrigger` in `ReconFeaturePage` triggers `LogDashboard`'s `useEffect` — sets all active creators to `running` for 3s, then resolves with a `postsToday` bump.

---

## ④ Community Feed — Browse scraped content

**Route:** `/isso/recon?tab=feed`
**Component:** `FeedView` from the Intelligence feature (reused)

Instagram-style grid of scraped posts. Sort, date range, visibility filters. Leaderboard sidebar shows top performers.

---

## State management — how everything connects

```
ReconFeaturePage.tsx
│
├── extraCandidates[]  ──► DiscoveryTab     merges + switches to Pending filter
│   (fire-once)
├── extraCreators[]    ──► CreatorsTable    dedup by id
│   (fire-once)        ──► LogDashboard     dedup by id
└── runAllTrigger      ──► LogDashboard     sets active creators → 'running' for 3s
```

**Fire-once pattern:**
```tsx
setExtraCandidates([newCandidate]);
setTimeout(() => setExtraCandidates([]), 0);
```

### Add button — per-tab actions

| Tab | Dropdown | Modal | Effect |
|---|---|---|---|
| ① Discovery | Add Handle | `AddCandidateModal` | Handle + niche → pending candidate |
| ① Discovery | Bulk Import | `BulkImportModal` | Paste handles → all pending candidates |
| ② Creators | Track Profile | `TrackProfileModal` | Handle + niche → directly active in Creators + Pipeline |
| ② Creators | Track Niche | `TrackNicheModal` | Phase 2 stub |
| ③ Pipeline | Run All Scrapers | (direct action) | All active creators → running for 3s |
| ③ Pipeline | Schedule Scrape | (Phase 2 stub) | — |

---

## File map

```
src/features/recon/
├── README.md
├── types.ts                          Candidate, Competitor, Tab, DrawerState, DailyVolume
├── constants.tsx                     COMPETITORS[], DAILY_VOLUME[], LOG_ENTRIES[], computeProfileHealth()
├── hooks/                            reserved for Convex useQuery hooks
└── components/
    ├── ReconFeaturePage.tsx          top-level shell — tab routing + modal orchestration
    │
    ├── modals/
    │   └── AddActionModals.tsx       AddCandidateModal, BulkImportModal, TrackProfileModal, TrackNicheModal
    │                                 + makeCandidate(), makeCreator()
    │
    ├── discovery/                    Discovery pill sub-components (all ≤120 lines each)
    │   ├── data.ts                   SEED_CANDIDATES, RUN_DISCOVERY_RESULTS
    │   ├── constants.ts              STATUS_FILTERS, STATUS_STYLE, ALERT_THRESHOLDS
    │   ├── utils.ts                  fmtViews(), getRatioColor()
    │   ├── MiniStat.tsx              stat card in top bar
    │   ├── RatioBadge.tsx            colour-coded outlier ratio pill
    │   ├── SamplePostGrid.tsx        3×2 gradient thumbnail grid
    │   ├── EmptyState.tsx            empty queue placeholder + CTA
    │   ├── AlertThresholdPicker.tsx  5×/10×/20× viral alert selector
    │   ├── CandidateRow.tsx          queue list item
    │   └── DetailPanel.tsx           right-side candidate detail card
    │
    └── creators/
        ├── index.ts                  barrel exports
        ├── DiscoveryTab.tsx          ① orchestrator (~120 lines)
        ├── CreatorsTable.tsx         ② table with live Convex merge
        ├── CreatorDetailView.tsx     ② drill-down: profile + reels feed
        ├── LogDashboard.tsx          ③ container
        ├── PipelineFunnel.tsx        ③ 5-stage funnel strip
        ├── ActivityFeed.tsx          ③ event timeline
        ├── VolumeChart.tsx           ③ 14-day bar chart
        ├── StatCard.tsx              ③ animated stat card
        ├── ScoreBadge.tsx            shared: creator score pill
        ├── ScoreColumnHeader.tsx     shared: table column header with tooltip
        ├── ProfileHealthBar.tsx      shared: enrichment progress bar
        └── CreatorsFilterBar.tsx     ② filter controls
```

---

## Connecting real data (Apify + Convex)

1. **Schema additions needed in `convex/schema.ts`:**
   - `candidates` table — maps to `SEED_CANDIDATES`
   - `scrapeJobs` table — `{ accountId, status, startedAt, postsFound, error? }`
   - `trackedAccounts` — already exists (maps to `COMPETITORS`)
   - `scrapedPosts` — already exists (maps to Community Feed)

2. **Flow:**
   ```
   Apify actor  →  webhook  →  Convex HTTP Action  →  upsert candidates / scrapedPosts
   ```

3. **Wire components:**
   - `DiscoveryTab`: `useQuery(api.candidates.list)` + `useMutation` for approve/reject
   - `CreatorsTable`: already wired to `api.intelligence.getCreatorStats`
   - `LogDashboard`: `useQuery(api.scrapeJobs.list)` replaces `LOG_ENTRIES`
   - `PipelineFunnel`: derive stage counts from live Convex queries

---

## Future feature pipeline

### High priority — next sprint

| Feature | Location | Description |
|---|---|---|
| **Live outlier ratio** | Discovery + Creators | Compute `avgViews / followersRaw` server-side from real Apify data. Replace seed values with Convex query. |
| **Viral velocity alert firing** | Discovery | When a tracked creator's ratio crosses `alertThreshold`, push a cross-cutting Notification. |
| **Real post thumbnails** | DetailPanel | Replace 3×2 gradient placeholders with actual scraped image URLs from Convex. |
| **Approved → Creators graduation** | Discovery | When a candidate is approved, write to `trackedAccounts`. Appears in Creators without refresh. |
| **Scrape failure recovery** | Pipeline | Error reason inline per creator (rate limit / 404 / timeout). One-click Retry re-queues the Apify job. |

### Phase 2

| Feature | Location | Description |
|---|---|---|
| **Niche auto-discovery** | Discovery | Apify continuously scans a niche for new accounts, surfaces them in Discovery queue automatically. `TrackNicheModal` becomes real. |
| **Competitor model profile** | Creators | 90-day growth curves, posting cadence heatmap, content topic drift, estimated engagement decay per tracked creator. |
| **Alert channel routing** | Pipeline | Route alerts by niche/client to different Slack / Discord channels. HMAC-SHA256 signed webhook payloads. |
| **outlierRatio column in Creators** | Creators | Add `outlierRatio` column to `CreatorsTable`. Requires `avgViews` populated from Convex. |
| **Pulse Report** | Intelligence | Async keyword job → structured AI report (themes, outlier creators, hashtag clusters). |
| **Search relevance feedback** | Discovery | Thumbs up/down on discovery results. Accumulates as per-agency training signal for future niche scraping. |
| **White-label intelligence reports** | Intelligence | Branded weekly PDF/web report sent directly to model clients. |

### Speculative / future

| Feature | Description |
|---|---|
| **Usage burn dashboard** | Real-time API call burn rate, projected days remaining, per-feature cost inline. |
| **Video download pipeline** | Clip trending videos from Recon, feed them into Content Gen remixing workflow. |
| **OFM content archetype tagging** | Classify scraped content as teaser / PPV hook / reactivation sequence in Intelligence briefs. |
| **Cross-creator comparison** | Side-by-side outlier ratio + posting cadence for two tracked creators. |
