# Partner Onboarding Data Plan (App Layer Reference)

**Scope:** Schema + persistence plan for the `/partners/onboarding` flow so engineers know what to build when we wire up Supabase.  
**Last Updated:** November 24, 2025  
**Status:** Planning only – UI is live, persistence not yet implemented.

---

## Tables & Views

### `partner_onboarding_profiles`
| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | PK; generated upfront so we can reference before full partner profile exists. |
| `partner_id` | uuid | FK to `partner_profiles.id`; nullable until partner is provisioned. |
| `full_name` | text | Required. |
| `preferred_name` | text | Optional. |
| `whatsapp_number` | text | Raw digits; format later. |
| `email` | text | Prefill from auth; allow overrides. |
| `country_code` | text | ISO alpha-2. |
| `country_label` | text | Store friendly label when “Other” selected. |
| `current_role` | text | Chip value or `other`. |
| `custom_role_label` | text | Captures the freeform label when `current_role = other`. |
| `experience_level` | text | Chip value. |
| `experience_notes` | text | Optional textarea. |
| `referral_source` | text | `discord | youtube | existing_partner | paid_ad | other`. |
| `referral_source_note` | text | Optional freeform (“Name of partner” / “campaign id”). |
| `monthly_revenue_goal` | numeric | Range 1000–10000. |
| `avg_project_value` | numeric | Range 500–10000. |
| `clients_needed` | integer | Derived on save (`ceil(goal / avg_project_value)`). |
| `max_clients_per_month` | integer | Slider (0–100). |
| `onboarding_complete_at` | timestamptz | Set when Step 5 CTA fires. |
| `created_at` / `updated_at` | timestamptz | Defaults via Supabase. |

### `partner_onboarding_progress`
| Column | Type | Notes |
| --- | --- | --- |
| `partner_id` | uuid | PK + FK to partners. |
| `current_step` | smallint | 0–4. |
| `completed_steps` | jsonb | Array of strings (`["identity","snapshot",...]`). |
| `status` | text | `in_progress | completed`. |
| `last_seen_at` | timestamptz | Drives resume + nudge automation. |

### Partner profile extension
- Add `onboarding_status` (`pending | complete | skipped_manual`) and `intro_course_started_at` / `intro_course_completed_at` to the main partner profile table so dashboards know when to gate widgets.
- Create a convenience view `partner_onboarding_with_profile` joining `partner_profiles`, `partner_onboarding_profiles`, and `partner_onboarding_progress` for the `/partners/onboarding` page load.

---

## API Outline
1. **GET `/api/partner/onboarding`** – returns `profile`, `progress`, `formData`.  
   - Pulls from the view above, falling back to defaults if no record exists.
2. **PATCH `/api/partner/onboarding`** – upserts both tables per step.  
   - Body contains `stepKey`, `payload`, `completedSteps`.  
   - Server calculates `clients_needed` and ensures slider ranges are respected.
3. **POST `/api/partner/onboarding/complete`** – marks status complete, sets timestamps, emits analytics event `partner_onboarding_completed`.

All endpoints must enforce partner scoping via Supabase RLS (filter by `partner_id = auth.uid()` or the appropriate foreign key).

---

## Events & Analytics
- `partner_onboarding_step_viewed` – payload `{ step, partner_id }`.
- `partner_onboarding_step_saved` – `{ step, completion_pct }`.
- `partner_onboarding_resumed` – triggered when `last_seen_at` older than 24h.
- `partner_onboarding_completed` – include `monthly_revenue_goal`, `avg_project_value`, `clients_needed`.

---

## Redirect & Guard Logic (Once APIs Land)
1. Middleware checks `partner_profiles.onboarding_status`.  
   - If `pending`, redirect `/partner*` requests to `/partners/onboarding`.  
   - If `complete`, allow dashboard and optionally hide onboarding route.
2. `/partners/onboarding` fetches `GET onboarding` endpoint.  
3. Each step save hits `PATCH onboarding`.  
4. Finish CTA calls `POST onboarding/complete`, then route to `/partner?onboarding=done`.

---

## Outstanding Decisions
- Confirm whether admins need a manual reset endpoint (e.g., `POST /api/admin/partner/:id/onboarding/reset`).  
- Decide where to store VSL acknowledgement (currently `hasWatchedVsl` in UI; could map to boolean column if required).  
- Determine copy for automated WhatsApp nudge if `last_seen_at` > 48h with status `in_progress`.

This doc lives alongside the app code (`apps/partners/docs/`) so the UI + backend team can iterate without digging through the global docs folder. Update it once migrations start. 
