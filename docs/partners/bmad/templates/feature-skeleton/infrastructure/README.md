Feature **infrastructure/** folder

- Adapters for APIs, data sources, messaging, storage, analytics, etc.
- Responsible for converting raw responses into domain entities.
- Safe to import from `domain/`; never import from `ui/`.
