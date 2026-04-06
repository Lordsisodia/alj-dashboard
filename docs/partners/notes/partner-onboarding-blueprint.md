# Partner Partner-Onboarding Blueprint

**Scope:** Define the pre-dashboard partner onboarding experience (UX, copy beats, data capture, and Supabase schema plan).  
**Last Updated:** November 24, 2025  
**Status:** Draft for planning review – incorporates Nov 24 stakeholder decisions.

---

## Experience Goals
- Gate `/partner` access until partners complete a short, high-signal wizard that feels like a guided orientation instead of a cold form.
- Balance inputs with value: every step teaches something (program pillars, projection math, expectations) before asking for data.
- Follow the brand system tokens in `docs/shared/brand-system/color-system.md` and `typography-and-spacing.md` for gradients, typography, chip geometry, and CTA styles so the new flow matches the existing Academy/Dashboard visuals.
- Capture the minimum data required for downstream automations: full name, WhatsApp (primary contact), location, experience, current role, revenue target, price per client (project size), capacity (clients/mo), referral source, experience notes, and onboarding completion flags.
- Persist partial progress to Supabase so abandoned sessions resume on the exact step and the wizard never reappears after completion.

---

## Surface Map & Step Detail

> **Route entry:** `/partners/onboarding` (PartnerAuthGuard-protected). Redirect pending partners here before granting `/partner` dashboard access.

| Surface | Purpose & Content | Inputs / Components | Resume Behavior |
| --- | --- | --- | --- |
| **0. Guarded Landing (Partner Route Hero)** | When `/partner` loads for first-time users, show a hero block with micro-copy (“Unlock the partner desk”), bullet list of what the portal offers, and a CTA to start onboarding. This page also hosts a short FAQ accordion so the experience is half informational before the form begins. | - `SettingsGroupCallout`-style hero using `bg-siso-bg-secondary`, gradient accent border, stat chips for “Avg deal value” etc.<br>- CTA button using `siso-gradient-primary` background with `hero-label` typography.<br>- `Continue onboarding` CTA enters Step 1. | If `progress.status !== complete`, auto-open Step 1 modal/wizard; otherwise deep link to dashboard. |
| **Step 1. Identity & Contact** | Sets trust tone: shows copy like “We coordinate via WhatsApp – here’s why.” Present short list of onboarding perks before requesting data. | - Fields: `full_name` (text), `preferred_name` (optional text), `whatsapp_number` (phone input limited to digits but no OTP), `email` (prefilled/disabled if already known), `country` (searchable select w/ top chips + “Other” text). No timezone or preferred-hours capture per stakeholder request.<br>- Provide helper text referencing confidentiality and why WhatsApp is primary. | On blur, persist to `partner_onboarding_profiles`. Progress row stores `completed_steps = ["identity"]`. |
| **Step 2. Work Snapshot** | Emphasize “You bring the clients, HQ closes the deals,” focusing the copy on lead generation instead of partner archetypes. | - Chip groups with `section-label` typography: `current_role` (chips: Sales, Agency Owner, Freelancer, Content Creator, Other) and `experience_level` (chips: “I’ve closed clients”, “New but hungry”, etc.). Selecting “Other” reveals a small custom input (`max 40 chars`). <br>- Optional `experience_notes` textarea limited to 240 chars, default collapsed.<br>- **Referral source** selector (chips: Discord, YouTube, Referral, Paid Ad, Other + custom input). | Save chip selections to `experience_meta` JSON, store `referral_source`, and mark `completed_steps` accordingly. |
| **Step 3. Revenue Target (Goal Slider)** | Motivational copy (“Let’s map your first $10K month”) plus slider-driven stat card. | - Slider `monthly_revenue_goal` range `$1k–$10k` (increments $250). Display hero stat using `stat-value` typography with supporting pill (“Per month”). <br>- Secondary slider `avg_project_value` (“Average price per client”) range `$500–$10k`. Copy hints at raising package value. | Store numeric values and auto-calc `clients_needed = ceil(goal / avg_project_value)` for the preview card. |
| **Step 4. Capacity & Breakdown** | Shows interactive breakdown card: “You’ll need X clients/month at $Y each.” Let partners tweak “How many clients can you realistically manage per month?” slider (0–100). If capacity < required clients, show alert with recommended actions (link to training). | - Slider `max_clients_per_month` 0–100 (step 1). <br>- Summary card displays: revenue goal, avg project value, clients needed, difference vs capacity. <br>- Include informational list of “How to hit this number” (lead gen, follow-ups, etc.). | Save slider + derived values. This is the last data-heavy step before the VSL. |
| **Step 5. VSL & Orientation Recap** | Embed the VSL (YouTube) and recap bullet list of next steps (“Check dashboard widgets”, “Start Intro Course”). Include acknowledgement checkbox “I’ve watched the intro” (non-blocking but track). CTA => Dashboard. | - `iframe` embed inside card with `card-radius-main`. Leverage YouTube’s native transcript/subtitle support; no extra accessibility layer required at launch. <br>- Recap list referencing the three main program pillars. <br>- CTA buttons: `Go to dashboard` (primary) + `Start Intro Course` (secondary). | On CTA click, set `onboarding_completed_at`, `onboarding_status = complete`, and never show wizard again. If they close before finishing, `current_step = 5` ensures they resume here. |

### Post-Onboarding Surfaces (Dashboard)
1. **Dashboard Unlock Modal** – Passive toast or modal confirming completion, summarizing their inputs (revenue target, required clients, CTA to edit profile).  
2. **Intro Course Card** – Auto-pin a `Training Hub` card titled “Start Here” with progress meter. Includes deep link to the introduction course playlist.  
3. **Revenue Goal Widget** – Display the slider results on the dashboard so partners see their commitment every login. Widget echoes the wizard gradients but overlays a translucent “Locked until you start the intro course” panel with CTA buttons so data remains visible yet clearly gated.  
4. **Notification Setup Nudge** – Suggest enabling WhatsApp notifications if we ever add verification (future).

---

## Copy & Content Decisions (Finalized Nov 24, 2025)

### Chips & Selectors
| Input | Default Options | Behavior Notes |
| --- | --- | --- |
| `current_role` | `Sales Closer`, `Agency Owner`, `Freelancer`, `Content Creator`, `Community Builder`, `Other` | Selecting `Other` reveals a single-line custom input (`max 40 chars`). Store both chip slug + custom text for analytics. |
| `experience_level` | `I've closed high-ticket deals`, `New but hungry`, `Marketing operator`, `Systems & ops support`, `Still figuring it out`, `Other` | Chips use `micro-label` typography. If “Other” selected, show helper text “Give us a phrase that describes you best.” |
| `referral_source` | `Discord`, `YouTube`, `Existing partner`, `Paid ad`, `Other` | Always required. When “Existing partner” is chosen, surface optional text input so they can name the person (store as `referral_source_note`). |
| `country` | Searchable select seeded with `United States`, `United Kingdom`, `Canada`, `Australia`, `United Arab Emirates`, `Singapore` quick chips plus “Other” for manual entry. | No timezone/communication-hour capture. |

### CTA & Label Strings
- Guarded landing hero heading: **“Activate Your Partner Desk”** with supporting copy “Get the playbook, projections, and tools before you ever pitch.”  
- Hero CTA button: **“Start onboarding”** (primary) + ghost link **“Preview dashboard”** which is disabled until onboarding complete.  
- Step 1 primary button: **“Lock in my contact info”**; helper microcopy “We’ll use WhatsApp for fast deal support.”  
- Step 2 setup copy: “You bring the clients, we close the deals. Tell us how you prospect so we can support you.” Primary button stays **“Save my background”**; optional “Skip notes for now” link retains chips but clears textarea.  
- Step 3/4 combined CTA: **“Calculate my path”** to move from sliders to VSL step.  
- Step 5 CTA buttons: **“Go to dashboard”** (primary gradient) and **“Start intro course”** (secondary outline).  
- Dashboard overlay copy on locked widgets: “Finish the Start Here course to unlock actions” with CTA buttons **“Start Intro Course”** and **“Dismiss for now”**.

### Intro Course Route
- All “Start Intro Course” CTAs deep link to `/partners/academy/getting-started`, the Getting Started route defined in `docs/partners/architecture/PARTNERSHIP-PAGES-PLAN.md`.  
- Tracking event payload should include `{ destination: "/partners/academy/getting-started", source: "partner_onboarding" }`.  
- Dashboard “Start Here” card copies this link and marks `intro_course_started_at` on click.

---

## Interaction, Content, and Brand Notes
- **Visual system:** Follow the palette + shadows from `docs/shared/brand-system/color-system.md` (dark surfaces with `border-white/10`) and typography tokens from `typography-and-spacing.md` (hero-label, section-label, micro-label). The wizard shell should reuse `SettingsGroupCallout` geometry: `rounded-[26px]`, `siso-shadow-md`.
- **Copy tone:** Future-focused, “You” statements, aspirational but concrete (“Here’s how to unlock your first $10K month”). Include microcopy explaining why each data point matters (e.g., WhatsApp for faster deal support). No compliance consent screens are needed per stakeholder call, so keep Step 1 lightweight.
- **Information density:** Each step opens with a 2–3 bullet “Why this matters” list before showing inputs to keep the informational vibe.
- **Chips + custom input:** Chips handle 90% of responses; selecting “Other” reveals a small text input (`max 40 chars`). Persist both the selected option and any custom label.
- **Progress UI:** Show a 5-step tracker (numbers + labels) anchored at top; lighten completed steps using `siso-gradient-text`. Offer `Save & exit` link that closes the wizard but stores progress.
- **Empty states:** If data fails to save, show inline error using `--siso-error` and keep inputs dirty (no toast-only errors).

---

## Supabase Planning (Schema & Persistence)

### `partner_onboarding_profiles`
| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | Primary key (matches authenticated partner or stands alone until linked). |
| `partner_id` | uuid | Nullable until the account fully provisions; enforce unique constraint once linked. |
| `full_name` | text | Required Step 1. |
| `preferred_name` | text | Optional. |
| `whatsapp_number` | text | Store raw plus digits; future-ready for E.164 formatting. |
| `email` | text | Prefilled from auth. |
| `country_code` | text | ISO alpha-2; store `country_label` if they typed custom. |
| `current_role` | text | Selected chip or custom entry. |
| `experience_level` | text | Chip value (“Closer”, “New”). |
| `experience_notes` | text | Nullable. |
| `referral_source` | text | Chip/custom value from Step 2. |
| `referral_source_note` | text | Optional detail (name or context) when referral source = Existing partner or Other. |
| `monthly_revenue_goal` | numeric | Range up to 10000. |
| `avg_project_value` | numeric | Range up to 10000. |
| `clients_needed` | integer | Derived server-side when saving Step 3. |
| `max_clients_per_month` | integer | Step 4 slider (0–100). |
| `onboarding_complete_at` | timestamptz | Filled on Step 5 CTA. |
| `created_at` / `updated_at` | timestamptz | Standard audit fields. |

### `partner_onboarding_progress`
| Column | Type | Notes |
| --- | --- | --- |
| `partner_id` | uuid | PK + FK to partners. |
| `current_step` | smallint | 0–5; used to resume wizard. |
| `completed_steps` | jsonb | Array of step identifiers. |
| `status` | text | `in_progress`, `completed`. |
| `last_seen_at` | timestamptz | For analytics + nudge automation. |

### Partner Profile Extension
- Add `onboarding_status` (`pending`, `complete`, `skipped_manual`) and `intro_course_started_at` columns on the main partner profile/table (wherever we persist portal users) so dashboards can display widgets while enforcing a “locked until intro course starts” overlay.  
- Add a view or RPC to fetch onboarding data + partner profile in one query for the dashboard welcome modal.

### Data Flow
1. Wizard saves each step via Supabase `upsert` into `partner_onboarding_profiles`.  
2. `partner_onboarding_progress` row updates `current_step` and `completed_steps`.  
3. Middleware on `/partner` checks `onboarding_status`; if pending, redirect to wizard with `step` query param = `current_step`.  
4. After Step 5, set `status = completed`, timestamp the profile, and drop a “partner onboarding completed” event for analytics/notifications.

---

## Dashboard & Course Handshake
- Immediately after completion, redirect to `Partner Dashboard (Home)` with query `?onboarding=done`. Display a modal summarizing their plan and offering two CTAs: `View Dashboard` (dismiss modal) and `Start Intro Course` (deep link to Training Hub’s intro module).  
- Add a persistent “Start Here” card on the dashboard until the intro course is finished (progress pulled from Training Hub). The card mirrors wizard styling: gradient CTA, hero-label copy, and the same revenue goal stat to reinforce continuity.  
- For future automation, store `intro_course_started_at` when they click the CTA and `intro_course_completed_at` once Training Hub events confirm completion.

---

## Content & Implementation Checklist
1. **Copy draft** – ✅ Baseline microcopy + CTA strings captured above; refine per step-specific UX once wireframes exist.  
2. **VSL slot** – Embed code + placeholder thumb; confirm final YouTube URL and fallback image for browsers that block autoplay.  
3. **Country dataset** – Provide JSON for searchable select (include top partner countries as quick chips).  
4. **Analytics hooks** – Plan events: `partner_onboarding_step_viewed`, `partner_onboarding_completed`, `partner_onboarding_resumed`.  
5. **Edge states** – Decide what happens if an admin needs to reset onboarding (manual Supabase toggle).  
6. **Course deep link** – Confirm the canonical slug / route for the intro course so CTA remains stable.  
7. **Referral source chips** – ✅ Finalized list + helper copy (see “Copy & Content Decisions”).

---

## Open Questions for Stakeholders
None at this time (decisions captured November 24, 2025). Reopen this section when new inputs are needed.

Let’s review these items before building so schema + UI tickets can be created with confidence.
