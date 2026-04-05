# Shared UI (Earnings)

Cross-feature presentation pieces that are reused by multiple earnings sections.
- `components/` currently holds navigation glue like `EarningsNavSync` and shared affordances such as `EarningsHeroBackLink`.
- Keep section-specific UI inside the numbered folders to avoid coupling; promote into this shared area only when it’s used by 2+ sections.
