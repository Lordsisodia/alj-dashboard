# Tasks — ui.recon

## Open
- [ ] Wire Scraping → Scraped columns: scraped posts/content should populate col 4 (Scraped) and scraping progress should reflect in col 3 (Scraping) when Scrape button is clicked on an approved card
- [ ] Replace remaining seed data with real Convex queries on Discovery page
- [ ] Finish Airtable-style creators table (see `creators-table-airtable-redesign.md`)
- [ ] Real-time scraping log / live events (verify or document mock pipeline)
- [ ] AI feature #3 — viral velocity alert (flag accounts with >5x engagement spike)
- [ ] Add AI feature #2 to dashboard (suggest: niche scoring per tracked creator)
- [ ] Remove temp @tongohmm seed (inserted as pending on every page load — confirm working first)

## Done
- [x] Dashboard pill built
- [x] Discovery / Creators / Community Feed pages built
- [x] Weekly Intel Digest AI feature (1/3)
- [x] Lazy-loaded non-default tabs (perf round 1)
- [x] Dashboard quick-action bar (Scrape Now / View Full Log / Filter by Niche below PostsScrapedChart)
- [x] Kanban redesign — 4-column layout (Unapproved / Approved / Scraping / Scraped), removed tab toggle
- [x] Scrape button on Approved cards (Scrape 10% / 50% / All dropdown → /api/recon/enrich-candidate)
- [x] Related handles → Unapproved (scrape returns relatedHandles, inserted as pending candidates, capped at 10)
- [x] Instagram icon on all cards (opens profile in new tab)
- [x] Duplicate detection + Clear duplicates (clearDuplicates Convex mutation, badge in Unapproved header)
- [x] Discovery Pipeline title + Run Now/Every 6h moved to top bar (title removed, schedule picker in tab bar, Run Discovery button wired)
- [x] Scraping cards simplified (removed Reels/Photos/Carousels/Stories breakdown, percentage inline with handle)
