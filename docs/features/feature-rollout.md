# Feature Rollout (MVP)

## Goal
- Move from “UI built” to a production-ready MVP with a single, ordered feature list.
- Make trade-offs explicit (impact vs. effort vs. risk) so we ship the smallest valuable slice first.

## Guiding Principles
- Ship user value early; cut scope before cutting quality signals (telemetry, accessibility, performance).
- Default to feature flags and progressive exposure; prove with metrics before 100% rollout.
- Keep risk-contained slices (one reversible change per deploy) to simplify rollback.
- Measure first value: define a single activation event and optimize toward it.

## Scoring Rubric
Score each candidate 1–5, then compute a weighted priority. Use decimals if needed.

| Factor | Definition | Weight |
| --- | --- | --- |
| Impact | How much this moves the activation/NPS/ARR needle. | 0.4 |
| Effort | Estimated build + QA + rollout. (Higher score = more effort.) | 0.2 |
| Risk Reduction | Lowers operational/support/security risk. | 0.2 |
| Confidence | How certain we are about impact/estimate. | 0.1 |
| Strategic Fit | Aligns with near-term narrative/launch story. | 0.1 |

Priority score:

```
priority = ((impact * 0.4) + (risk_reduction * 0.2) + (confidence * 0.1) + (strategic_fit * 0.1)) / max(1, effort * 0.2)
```

### Candidate Feature Intake (template)
Record each item before scoring:
- Problem & user segment
- Success metric and target
- Guardrails (perf budget, SLA, accessibility)
- Rollout constraints (flag? region? cohort?)
- Dependencies / tech enablers

Use the table below to prioritize; replace placeholder rows with your backlog.

| Feature | Impact | Effort | Risk Red. | Confidence | Strat. Fit | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| Partners landing page (explain value, CTA to onboarding) | 4 | 2 | 2 | 4 | 5 | 2.9 |
| Partner onboarding flow (link → profile + Q&A → dashboard) | 5 | 3 | 3 | 3 | 5 | 3.4 |
| Partnership Hub (PWA prompt + checklist + stats) | 5 | 2 | 3 | 4 | 5 | 3.8 |
| Dashboard snapshot with onboarding checklist + CTAs | 4 | 2 | 2 | 3 | 4 | 2.7 |
| Submit Client → Prospects (pipeline intake) | 5 | 3 | 3 | 3 | 5 | 3.4 |
| Courses track (unlock, progress, completion eventing) | 4 | 3 | 2 | 3 | 4 | 2.7 |
| PWA prompt + install/accept tracking | 3 | 2 | 2 | 4 | 4 | 2.4 |
| VSL watch (gated, view % + CTA completion) | 3 | 2 | 2 | 3 | 4 | 2.3 |

## Rollout Phases
- **Phase 0 – Readiness**: telemetry baseline (events for activation), feature-flag harness, perf budgets, error budgets, on-call owner, QA checklists.
- **Phase 1 – Activation Core**: top 3 scored features that directly create first value; release behind flags to a small cohort (5–10% traffic).
- **Phase 2 – Stickiness**: next 3 features that increase repeat use/retention; add success metrics and in-product prompts.
- **Phase 3 – Reliability & Scale**: hardening items (rate limits, backups, SLO alerts), broaden rollout to 50% → 100% once SLOs hold.

## Cadence & Owners
- Weekly: re-score board, pull next 1–2 items into the rollout lane.
- Daily: surface blockers, update flag exposure levels.
- After each release: 48–72h observation window; promote or roll back based on metrics.
- Roles: PM owns scoring inputs, Eng owns effort/risk, Design/Research owns activation metric definition, QA/DevEx owns checklists.

## Definition of Done (per feature)
- Eventing in place and visible on dashboard.
- Rollout plan defined (flag key, cohorts, kill switch).
- Playbook written for support/on-call (common failures, log links).
- Post-launch review scheduled with metric check (tied to the success target set in intake).

## Next Steps to Kick Off
- Populate the candidate table with your backlog.
- Run a 30–45 min scoring session to lock the first 5 items.
- Move Phase 0 readiness tasks to the current sprint if any are missing.

## Priority #1 – Partner Onboarding Flow

### Scope (MVP slice)
- Deep link to `/partners` → create/confirm Supabase profile row → start onboarding Q&A.
- Persist answers and basic org/user metadata to Supabase; surface in dashboard state.
- Land on partners dashboard with onboarding checklist and next-step CTAs.
- `/partners` landing page: concise value prop, how the partnership works, primary CTA into onboarding; include fallback contact CTA if token missing/invalid.
- Partnership Hub: show PWA prompt, onboarding checklist, progress meter, next tasks, quick stats; hide items once completed.

### Entry & Data
- Entry: signed URL or invite token to `/partners/onboarding?invite=<token>`.
- Collect: company basics, role, goals, current tools, readiness flags (PWA capable, video access), consent for comms.
- Supabase: single transaction to create user/org, store answers JSONB, record invite + completion timestamp.

### Dashboard Tasks (first experience)
- PWA: prompt to install; record `pwa_prompt_shown`, `pwa_install_accept`, `pwa_install_decline`.
- VSL: embedded player with `vsl_started`, `vsl_50pct`, `vsl_100pct`, CTA click.
- Courses: show starter course list; allow mark-as-started/completed; track progress percent.
- Snapshot: progress meter (answers saved, PWA status, VSL done, courses started), with CTA buttons that deep-link to each task.

### Success Metrics
- Onboarding start → completion rate.
- Time-to-first-dashboard and time-to-PWA-install.
- VSL 100% view rate and CTA click-through.
- Courses start and completion for first module.

### Rollout Slices
- Slice 0: `/partners` landing page with CTA into onboarding; handles missing/expired tokens gracefully.
- Slice 1: tokenized entry + Supabase profile/answers + minimal dashboard progress bar.
- Slice 1a: Partnership Hub shell with checklist + PWA prompt + “next task” cards.
- Slice 2: PWA prompt + install telemetry behind flag.
- Slice 3: VSL embed + eventing + CTA.
- Slice 4: Courses list + progress tracking.
- Slice 5: Polished snapshot UI + alerts for stalled steps.

## Importance Stack (quick cut)
- Level 1–2: Partnership Hub (landing + PWA + checklist), Submit Client → Prospects intake, Portfolio surface, core profile basics.
- Level 3: Partner profile completion (org/user), minimal dashboard snapshot.
- Level 4: App Plan Generator, Academy Training/Spotlight.
- Level 5–6: Community (chat/wins/announcements/messages), Pitch Kits, general settings (non-profile).
- Level 7–8: Help Center, Wallet, Tier Progression.
- Level 10–12: Recruitment performance, Integrations, lower-priority settings/legal.

## Settings – Make Functional
- **Profile basics (L2–3):** Wire to Supabase profile/org tables; allow name, company, role, contact channels; add avatar upload stub or URL; validate and persist.
- **General/Notifications (L5–6):** Toggle email/push/in-app channels; persist preferences; ensure defaults and kill switch; expose event logs for QA.
- **Security (L6+):** Password reset entry, MFA toggle placeholder, session/device list read-only until backend exists.
- **Privacy (L7–8):** Data export/delete request buttons (stub flows) and consent toggles stored in Supabase flags.
- **Devices (L7–8):** Read-only device list; revoke action stub.
- **Integrations (L10–12):** Leave gated/coming soon; show connect buttons behind feature flags.
- **Legal:** Static links (TOS/Privacy) + version stamp; no backend needed.
- **Telemetry:** Track setting_view, setting_save_success/fail per section; include validation errors.

### Supabase schema for settings (proposed minimal)
```sql
-- 1) Profile extension (keeps partners table light)
CREATE TABLE partner_profiles (
  partner_id UUID PRIMARY KEY REFERENCES partners(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT,
  timezone TEXT DEFAULT 'UTC',
  location TEXT,
  bio TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  marketing_opt_in BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2) Settings toggles (JSONB keeps UI flexible)
CREATE TABLE partner_settings (
  partner_id UUID PRIMARY KEY REFERENCES partners(id) ON DELETE CASCADE,
  notifications JSONB NOT NULL DEFAULT '{"email":true,"push":true,"in_app":true,"product_updates":true,"alerts":true}',
  theme TEXT DEFAULT 'system',
  language TEXT DEFAULT 'en',
  pwa_installed_at TIMESTAMPTZ,
  checklist_state JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3) Privacy / consent + legal accepts
CREATE TABLE partner_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL,           -- e.g., 'marketing', 'product_updates'
  granted BOOLEAN NOT NULL DEFAULT true,
  granted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE partner_legal_acceptances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL,               -- 'tos' | 'privacy'
  doc_version TEXT NOT NULL,            -- e.g., '2025-01'
  accepted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4) Devices (read-only for now; allow revoke when backend ready)
CREATE TABLE partner_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  user_agent TEXT,
  ip_address INET,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  is_revoked BOOLEAN DEFAULT false
);

-- 5) Integrations (kept behind flags)
CREATE TABLE partner_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,               -- e.g., 'slack', 'zapier'
  status TEXT DEFAULT 'disconnected' CHECK (status IN ('connected','disconnected','error','pending')),
  settings JSONB DEFAULT '{}',
  connected_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: one-liners to mirror partners policy
ALTER TABLE partner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_legal_acceptances ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_self" ON partner_profiles FOR ALL USING (partner_id::text = auth.uid()::text);
CREATE POLICY "settings_self" ON partner_settings FOR ALL USING (partner_id::text = auth.uid()::text);
CREATE POLICY "consents_self" ON partner_consents FOR ALL USING (partner_id::text = auth.uid()::text);
CREATE POLICY "legal_self" ON partner_legal_acceptances FOR ALL USING (partner_id::text = auth.uid()::text);
CREATE POLICY "devices_self" ON partner_devices FOR ALL USING (partner_id::text = auth.uid()::text);
CREATE POLICY "integrations_self" ON partner_integrations FOR ALL USING (partner_id::text = auth.uid()::text);
```

Implementation notes
- Use `partner_profiles` + `partner_settings` for the UI saves (General/Profile/Notifications). No schema change needed on `partners`.
- Checklist state can live in `partner_settings.checklist_state` for the Hub “next tasks” until a dedicated checklist service exists.
- Devices remain read-only until we trust device metadata; revoke = set `is_revoked=true`.
- Integrations table is feature-flagged; safe to leave empty while buttons show “coming soon.”

### Owners & Ops
- PM: questions list, success targets, invite rules.
- Eng: Supabase schema + API + eventing; feature flags for PWA/VSL/Courses.
- Design/Content: VSL asset, course copy, empty-state content, CTA labels.
- QA/DevEx: checklists per slice, rollback steps, Supabase data validation, event verification in analytics.
