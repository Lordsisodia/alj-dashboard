# PartnerLP funnel

Structure mirrors the requested architecture pattern:

```
src/domains/partnerships/funnel/partner-lp/
  application/      # (placeholder for services/use-cases if needed)
  data/             # (placeholder for static/data hooks)
  domain/           # (placeholder for domain models)
  docs/             # (optional notes/docs)
  infrastructure/   # (placeholder for infra/adapters)
  ui/
    components/     # hero, sections, shared parts
    screens/        # entry screen (LandingPage)
```

Current UI entry: `ui/screens/LandingPage.tsx`.
Routes in `apps/partners` import from this path.
