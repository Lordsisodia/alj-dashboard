# settings/shared/navigation

- Umbrella for navigation concerns in Settings.
- Contains:
  - `routing/` — slug/path → component resolution (lazy loaders, status flags).
  - `menu/` — user-facing nav model (grouping, labels, badges, visibility).
- Keep rendering logic in `routing` and presentation/grouping in `menu` to avoid coupling.
