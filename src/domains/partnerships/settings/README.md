# Settings

## Scope
- **Category:** settings
- **Primary routes:** `/partners/(mobile)/settings/...`
- **Flow order:** `01-general`, `02-my-account`, `03-profile`, `04-devices`, `05-security`, `06-privacy`, `07-legal`, `08-integrations`, `09-wallet`, plus `shared/`.
- **Core use cases:** manage account preferences, security, privacy, legal compliance, integrations, wallet.

## Ownership
- **Squad / DRI:** Partner Platform
- **Dependencies:** Navigation adapter (menu registry), shared auth/query providers, feeds into workspace/profile experiences.

## Layer Overview
| Layer | Exists? | Notes |
|-------|---------|-------|
| domain | ✅ populated | Slices per tab (general, notifications, profile, etc.).
| application | ✅ populated | Route registries, orchestrators, hydrators.
| infrastructure | ✅ populated | Clerk/Supabase hooks and other adapters.
| ui | ✅ populated | Numbered folders per section (`01-`..`09-`) plus shared components/shells.

## Legacy Docs
- Portal archive: `src/domains/partnerships/settings/shared/docs/portal-archive`
- Specs: `docs/partners/architecture/portal-archive/STANDARDS.md` (settings)

## Open Questions / TODOs
- [ ] Align `partner-nav-config.json` with any new tabs before shipping.
- [ ] Expand notification hooks to cover SMS/push flows.

## Testing Strategy
- Unit coverage via `settings/domain/*` and future integration tests per tab.
