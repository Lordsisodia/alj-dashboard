This template defines the required structure for every `src/domains/partnerships/<feature>` folder.

```
feature/
├── domain/          # Business types, entities, validation rules
├── application/     # Hooks, stores, orchestration, use-cases
├── infrastructure/  # API clients, adapters, external services
├── ui/              # Screens + components, presentation only (placeholder README included)
└── data/            # Optional fixtures (clearly labeled as demo-only)
```

Copy this skeleton into a feature folder and replace the placeholder README files with concrete documentation as you build out the layers.

When adding a new feature, run `pnpm generate:partner-feature` (TBD) to copy this structure and register it in the architecture docs.
