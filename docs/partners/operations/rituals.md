# Partnerships Operations Rituals

## Structure & Navigation Audit
- **Owner:** Partnerships Architect (or delegate)
- **Cadence:** First business day of every sprint at 10:00 local timezone.
- **Steps:**
  1. Pull the latest `main` branch.
  2. Run `npm install` to ensure shared ESLint plugins/scripts are present.
  3. Execute `npm run check:partners` (now runs structure, lint, and nav-sync in strict mode).
  4. Run `node scripts/check-portal-docs.mjs` to confirm the archives remain markdown-only (CI also runs this on every push/PR).
  5. If either command fails, create a ticket immediately and post the summary + direct link in #partners-dev.
  6. If both succeed, post a ✅ update with the `logs/partners-structure.log` entry for traceability.
- **Artifacts:**
  - `npm run check:partners` now writes a timestamped summary to `/var/log/partners-structure.log` (falls back to `logs/partners-structure.log` inside the repo when `/var/log` is unavailable).
  - Slack post in #partners-dev with pass/fail status and follow-up links.

## CI Gate
- Workflow `.github/workflows/partner-portal-perf.yml` now runs a blocking `partner-quality` job that executes `npm run check:partners` before perf budgets. Any structural/lint/nav regression blocks merges.

## Nightly Structure Check
- Workflow `.github/workflows/partner-nightly-structure.yml` executes every day at 06:00 UTC (plus optional manual dispatch).
- Steps: `npm run check:partners`, `node scripts/check-portal-docs.mjs`, and artifact upload of `*_partners-structure.log` for historical traceability.
- Owners review the artifact each morning; failures trigger an incident in #partners-dev.

Keep this file updated whenever the cadence, owners, or tooling change.
