# Partners Changelog

## 2025-11-24
- Portal architecture is documentation-only; academy, settings, recruitment, community, earnings, and partnership hub all migrated into runtime feature folders.
- `npm run check:partners` now runs in strict mode locally and in CI; workflow `partner-portal-perf.yml` blocks on a new `partner-quality` job.
- Recurring structure/nav audit ritual added (first business day each sprint) with results logged to `/var/log/partners-structure.log` (fallback `logs/partners-structure.log`).
