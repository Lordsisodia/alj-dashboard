# Earnings

## Scope
- **Category:** earnings / growth
- **Primary routes:** `/partners/earnings`, `/partners/earnings/wallet`, `/partners/earnings/tier-progression`, `/partners/earnings/achievements`, `/partners/earnings/leaderboard`, `/partners/earnings/challenges`.
- **Flow order:** `01-dashboard`, `02-wallet`, `03-tier-progression`, `04-achievements`, `05-leaderboard`, `06-challenges`, plus `07-missions`, `08-overview`, `09-badges`, `shared/`.
- **Core use cases:** tier progression, wallet payouts, challenges/leaderboards.

## Ownership
- **Squad / DRI:** Partner Growth
- **Dependencies:** Supplies KPIs to `partnership-hub`; consumes shared auth/query providers.

## Layout
- `shared/` — cross-section UI helpers only (navigation + shared affordances).
- `01-dashboard/` — dashboard widgets.
- `02-wallet/` — wallet & payout screens.
- `03-tier-progression/` — tier progress.
- `04-achievements/` — achievements feed + certificates.
- `05-leaderboard/` — leaderboard.
- `06-challenges/` — challenges/boosters.
- `07-missions/`, `08-overview/`, `09-badges/` — supporting experiences.

## Docs
- Section-specific READMEs now live in each numbered folder under `docs/`.
- Architecture context: `docs/partners/architecture/partner-route-inventory.md`

## Open Questions / TODOs
- [ ] Replace wallet fixtures with live payouts integration.
- [ ] Wire tier progression to analytics once API stabilized.

## Testing Strategy
- Unit: `earnings/03-tier-progression/domain/tier-definitions.ts`
- Integration: add once wallet API client exists.
