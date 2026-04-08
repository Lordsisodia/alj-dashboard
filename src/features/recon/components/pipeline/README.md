# Pipeline — Scraper ops & throughput dashboard

The Pipeline tab. Owns the operational view of the recon scraper: scrape job logs, throughput charts, per-creator scrape rows, and the funnel summary. It does NOT own the discovery kanban (see `../discovery/`) or the live scrape progress column (which lives in discovery).

---

## Component map

| File | Purpose |
|------|---------|
| `LogDashboard.tsx` | Top-level pipeline dashboard. Renders the funnel, charts, and the per-creator pipeline rows. |
| `PipelineFunnel.tsx` | Stage funnel visual (discovered → enriched → scraped → analysed). |
| `CreatorPipelineRow.tsx` | One row in the pipeline list, summarising scrape state for a single creator. |
| `VolumeChart.tsx` | Time-series chart of scrape volume. |
| `PostsScrapedChart.tsx` | Bar chart of posts scraped per period. |

---

## Data flow

The dashboard reads scrape job aggregates and per-creator scrape stats from Convex (queries owned by the parent recon feature page). All mutations (re-run, retry) are passed in as callbacks.

---

## Subfolder guide

| Folder | Contents |
|--------|---------|
| `funnel/` | Funnel-specific helpers and visuals: `funnelData.tsx` (stage definitions and seed data) and `StagePill.tsx` (one stage chip). |
