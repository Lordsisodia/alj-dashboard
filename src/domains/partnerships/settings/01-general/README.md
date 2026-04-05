# 01 General — Structure

- Purpose: entry point for general settings (appearance, language, quick prefs).
- Routes that should map here: `/partners/settings/general` and any sub-routes we attach (appearance, language, notifications shortcut if needed).
- Folder layout (today):
  - `application/` — hooks/services for general settings
  - `data/` — fixtures or seed data for appearance/language
  - `docs/` — section docs (now includes `appearance.md`, `language.md`, `index.md`)
  - `domain/` — types, enums, validation
  - `infrastructure/` — API clients/adapters
  - `ui/` — screens/components for general
- Related shared pieces live in `settings/shared/` (route registry, shared components, shells).
