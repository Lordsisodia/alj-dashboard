# 01-general / application

Purpose
- 🧭 Holds application-layer hooks for the General Settings page.
- 🧩 Split into `sections/*` so appearance, language, notifications can evolve independently while sharing page-level state if needed.

What lives here
- `useGeneralSettings` – page-level orchestrator that pulls stats + summaries.
- `sections/appearance` – UI-facing state helpers for theme, contrast, motion, haptics.
- `sections/language` – locale, timezone, formatting helpers.
- `sections/notifications` – notification preferences placeholder (UI-only today).

Guidelines
- Keep cross-section wiring in `useGeneralSettings`; keep section-specific UI helpers in `sections/*`.
- If logic becomes shared across other settings pages, move it to `src/domains/partnerships/settings/shared/application` instead.
- Prefer explicit imports (no barrel in sections) to avoid circular deps.

Future tidy options
- If sections stay light, you can flatten to `application/appearance`, `application/language`, etc. after ensuring imports are updated.
