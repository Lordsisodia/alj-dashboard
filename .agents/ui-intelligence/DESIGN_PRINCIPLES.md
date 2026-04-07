# UI Design Principles — ISSO Dashboard
**Owner:** ui.intelligence.manager
**Date:** 2026-04-07
**Scope:** All dashboard and tab layouts across the Intelligence, Recon, Content Gen, and Hub sections.

---

## 1. Split width is dictated by content, never by formula

There is no default split. Each component pair gets the width it actually needs — sometimes 70/30, sometimes 80/20, sometimes full width, sometimes 3 unequal columns. The only rule is: don't waste space. If a column has dead air, it's too wide.

**Ask:** What is the minimum width this component needs to be readable? Give it that. Give the rest to the other column.
**Avoid:** Defaulting to 50/50 because it's "safe" — equal splits feel like a spreadsheet, not a product.

## 1b. Dashboard scrolls. Everything else fits on screen.

The dashboard is the one exception where scrolling is intentional and acceptable — it's a briefing page with multiple sections. All other tabs (Qualify, Analysis, Insights) should fit their primary content on one screen without scrolling. If it doesn't fit, it needs a "See all" expanded view, not more vertical stacking.

---

## 2. Visual content earns full width. Text and stats don't.

A row of video thumbnails, a large chart, a funnel — these need horizontal breathing room. Text bullets, stat chips, and list rows do not. Give visual content all the space it wants. Pack text tighter.

**Rule:** If a full-width component contains only text or numbers, it probably belongs in a column.

---

## 3. Companion columns — related context lives side by side

If two pieces of information answer the same question ("what's happening right now?"), they belong in the same horizontal band. Don't stack them sequentially.

**Example:** Intelligence brief (5 insight bullets) + What the system is learning (3 signals) = same question = same row, 65/35.
**Example:** Format chart + Niche leaderboard = same question = same row, 55/45.

---

## 4. Dashboard is a briefing. Analytics tabs are for depth.

A dashboard shows summaries. If a chart or table already lives on another tab, the dashboard shows one line of derived insight + a link. It never duplicates the full component.

**Rule:** If you can see it on Qualify or Analysis, it doesn't belong on Dashboard at full size.
**Instead:** One sentence insight + "View in Qualify →" link.

---

## 5. Every number is a door

Any stat, KPI tile, or count should be clickable and navigate to the relevant tab or filtered view. Numbers that go nowhere are wasted.

**Examples:**
- "11 Outliers this week" → clicks to Qualify filtered to outliers
- "642 Needs analysis" → clicks to Analysis queue
- "751 Posts indexed" → clicks to Qualify table

---

## 6. Scroll is acceptable. Duplication is not.

You can scroll on a dashboard — that's fine. What's not fine is showing the same data the user already saw on another tab. Every component below the fold must earn its presence by adding information that isn't elsewhere in the app.

**Test:** "Can the user get this information in one click from another tab?" If yes, remove or reduce to a summary line.

---

## 7. Strip components are free

A single-row strip (pipeline status, trending signal, action queue) costs almost nothing in vertical height (~44px). Use them liberally between sections to break up the page and add information density without visual weight.

---

## 8. Insight density over chart space

5 scannable one-liner insights communicate more actionable signal than one 200px bar chart. The human brain processes bullet points faster than it processes chart axes.

**Prefer:**
```
· Meme carousels leading — 22.9% avg ER
· @minaxash Lifestyle dominating top 10%
· Hook avg improved +0.4 this week
· 3 accounts entered top 10% baseline
· Best posting window: Thu 6-8pm
```

**Over:** A full-width bar chart of the same data

---

## 9. Max chart height ~160px on dashboards

Charts on a dashboard are summary-scale, not analysis-scale. A chart that needs more than ~160px height to be readable belongs on its own tab, not the dashboard. On the dashboard, compress it or replace it with a derived insight.

---

## 10. Section headers cost nothing — use them

Every group of components should have a `text-[10px] font-semibold text-neutral-400 uppercase tracking-wide` label above it. It costs 12px of height and makes the page scannable in 2 seconds.

---

## Application to existing layouts

| Section | Current issue | Fix |
|---------|--------------|-----|
| Dashboard trending strip | 1 insight full-width | 5 insights in 65% col + learning signal in 35% col |
| Dashboard analysis charts | HooksTable, PatternInsights, HashtagCorrelation, HookLineGallery, RuleCards duplicated from other tabs | Remove all — replace with 1-line summaries + links |
| Qualify StatsBar | 5 chips full-width | Already fine — strip component, keep |
| Analysis pipeline strip | 3 big tiles, lots of whitespace | FunnelChart (done) — already fixed |
| Insights InsightCards | Hidden behind card wrapper | Show as visible inline bullets (done) |

---

## The layout decision tree

When designing a new dashboard section, ask in order:

1. **Is it visual?** (thumbnails, chart, funnel) → Give it full width or a large column
2. **Is it a summary?** (stats, KPIs, counts) → Grid of tiles, full width
3. **Is it insight text or signals?** → Put it in a column next to related context (companion column rule)
4. **Is it a detailed chart/table?** → Does it already exist on another tab? Remove from dashboard. If not, cap height at 160px.
5. **Is it an action?** (queue, CTA) → Strip component, full width, minimal height
