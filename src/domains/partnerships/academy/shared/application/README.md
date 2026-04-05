# Academy Shared Application

Hooks and services that coordinate data across multiple Academy pages (e.g., overall XP progress).

- Holds orchestration logic: hooks, stores, use-cases, service combinators.
- May import from `domain/` and `infrastructure/`, but never from `ui/`.
- Should expose typed hooks/components for the UI layer (e.g., `useTierProgress()`).
