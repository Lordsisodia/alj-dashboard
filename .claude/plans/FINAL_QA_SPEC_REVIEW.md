# Final QA — Spec vs Plan Review (Opus)

*2026-04-13 — VERDICT: REVISE (90% coverage, 10% gaps)*

---

## MISSING FROM FEATURE LIST (6 items)

1. **Agency front page** — Alex described this as the entry point, not just a marketing page. Deferred but not clearly justified.
2. **Two onboarding funnels** (Sales + Marketing) with call booking + applicant review. Deferred but the applicant review queue is also missing.
3. **Model onboarding** — model info sheet + auto Google Drive connect. Not in feature list.
4. **Content request types for OF side** — script suggestions, drips, custom requests. Only reel/video types captured.
5. **Marketing Manager should see R&D Table** — spec says "editors + marketing managers + models all have access." Plan only puts R&D in Editor Dashboard.
6. **Marketing Manager scope too narrow** — MM1-MM4 only lists 4 features but Alex said "everything minus financials." Missing: webcam stats, shifts, models roster.

## LOST IN TRANSLATION (4 qualitative requirements)

1. **"Treat models like 5 year olds"** — not enforced in page specs. Model pages are just as component-dense as others. Need explicit design constraints.
2. **"Every interaction gamified"** — no mapping of WHICH actions on EACH page earn points.
3. **Model webcam pages are LAPTOP not mobile** — despite dashboard being mobile-first.
4. **"Only 100% confirmed content, no faff"** — needs UI enforcement (confirmation gate) on R&D Table.

## CONTRADICTIONS (3 structural)

1. **4-icon sidebar constraint violated** — Editor has 3 icons, Model has 5.
2. **MM feature list vs Role Matrix disagree** — Matrix is more generous and correct.
3. **R&D Table access** — spec says editors + marketing + models. Plan only gives editors access.

## OPEN QUESTIONS FOR SHAAN

1. Is the Agency Front Page truly deferred or was that a misinterpretation?
2. What is the 5th dashboard?
3. Has the shift tracker time button code been received?
4. Are Honeymonster/Onlymonster being evaluated?
5. Call booking at end of onboarding — Calendly or custom?
