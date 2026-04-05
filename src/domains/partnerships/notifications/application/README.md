Feature **application/** folder

- Holds orchestration logic: hooks, stores, use-cases, service combinators.
- May import from `domain/` and `infrastructure/`, but never from `ui/`.
- Should expose typed hooks/components for the UI layer (e.g., `useTierProgress()`).
