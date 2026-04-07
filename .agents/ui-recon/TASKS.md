# Tasks — ui.recon

## Open
- [ ] **[dashboard]** Add a small section below PostsScrapedChart + ScrapingReport on desktop — compact bar or quick-action buttons to fill the empty space (e.g. scrape now, view log, filter by niche)
- [ ] **[discovery]** Redesign DiscoveryTab into full-width 4-column Kanban: Unapproved → Approved → Scraping → Scraped. Remove tab toggle, split into separate columns (grid-cols-4). Keep ScrapingColumn progress boxes exactly as-is. Tracking column merges into Approved. RejectedPanel collapses to ghost row at bottom of Unapproved. Header + collapsible analytics stay untouched.
- [ ] Add AI feature #2 to dashboard (suggest: niche scoring per tracked creator)
- [ ] Add AI feature #3 to dashboard (suggest: viral velocity alert — flag accounts with >5x engagement spike)
- [ ] Replace remaining seed data with real Convex queries on Discovery page
- [ ] Finish Airtable-style creators table (see `creators-table-airtable-redesign.md`)
- [ ] Verify scraping log shows real-time events (or document the mock pipeline)

## Done
- [x] Dashboard pill built
- [x] Discovery / Creators / Community Feed pages built
- [x] Weekly Intel Digest AI feature (1/3)
- [x] Lazy-loaded non-default tabs (perf round 1)
