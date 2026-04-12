# Research: Team Scheduling, Shift Management & Workforce Tools
**Date:** 2026-04-12
**Author:** agency.agency-dash
**Purpose:** Evaluate Deputy, When I Work, Toggl Track, and Homebase as reference tools for building the `/agency/schedule` route in isso-dashboard.

---

## 1. Tool Overviews

### 1.1 Deputy
**Category:** Full workforce management (scheduling + time + compliance + HR)
**Target market:** Shift-based SMBs and enterprise — retail, hospitality, healthcare, construction
**Scale:** 1.5M+ workers, 375K+ workplaces, 100+ countries

**Pricing (2026)**
| Plan | Price |
|---|---|
| Scheduling | $4.50/user/month |
| Time & Attendance | $4.50/user/month |
| Premium | $6.00/user/month |
| Enterprise | Custom |
- Annual billing available. 31-day free trial.
- HR and analytics are sold as add-ons at extra cost.

---

### 1.2 When I Work
**Category:** Scheduling-first with integrated time tracking and messaging
**Target market:** SMBs — retail, hospitality, education, hourly-worker environments
**Scale:** Widely adopted across single and multi-location businesses

**Pricing (2026)**
| Plan | Price |
|---|---|
| Single Location / Schedule | $3/user/month |
| Multiple Locations & Schedules | $5/user/month |
- Month-to-month or annual. 14-day free trial, no credit card required.
- Both plans include the same core feature set — no feature gating on essentials.

---

### 1.3 Toggl Track
**Category:** Time tracking only — no scheduling, no shift management
**Target market:** Agencies, freelancers, knowledge workers, IT teams
**Scale:** Popular with small teams; free plan up to 5 users

**Pricing (2026)**
| Plan | Price |
|---|---|
| Free | Free (up to 5 users) |
| Starter | $9/user/month (billed annually) |
| Premium | $18/user/month (billed annually) |
| Enterprise | Custom |
- 30-day free trial. 10% discount on annual billing.
- No per-location pricing — pure per-seat model.

---

### 1.4 Homebase
**Category:** All-in-one for hourly teams — scheduling + time clock + payroll + HR + messaging
**Target market:** Small businesses with hourly workers, single or few locations
**Scale:** 150,000+ small businesses

**Pricing (2026)**
| Plan | Price |
|---|---|
| Basic | Free (1 location, up to 20 employees) |
| Essentials | $20/location/month (annual) / $24.95/month |
| Plus | $48/location/month (annual) / $59.95/month |
| All-in-One | Custom (includes payroll, full HR) |
- **Per-location pricing, not per-seat** — adding a second location immediately costs $24.95–$99.95/month extra.
- 14-day free trial on All-in-One plan.

---

## 2. Feature Deep-Dives

### 2.1 Shift Calendar UX (Week / Day / Month Views)

**Deputy**
- Default view: week grid
- Supports day, week, and multi-week views
- Color-coded by role/department; shifts visible as blocks on the grid
- Schedule can be published and pushed to employees via email, SMS, or push notification

**When I Work**
- Explicit support for Day, Week, 2-Week, and Month views; toggle via dropdown
- Month view shows up to 6 shifts per day cell; overflow shown as "View All (X more)" link
- Month view recommended for review only — full editing done in Day/Week views
- Position View and Coverage View available alongside User View; useful for role-based staffing

**Toggl Track**
- No scheduling calendar. Track-only tool.
- Calendar view exists only for reviewing logged time entries, not for planning shifts.

**Homebase**
- Drag-and-drop schedule builder with week view as primary surface
- Template-based recurring schedules (autopilot scheduling based on availability, skills, labor budget)
- AI scheduling assistant available for automated schedule generation

---

### 2.2 Drag-to-Assign

**Deputy**
- True drag-and-drop: shift blocks draggable between employees and time slots
- AI auto-scheduler generates a full roster based on demand, sales forecasts, and budget constraints
- Rules engine: set shift lengths, start times, shift equity across employees

**When I Work**
- Drag-and-drop interface for moving shifts between employees and time slots
- Auto-assign feature: builds a full week's schedule in minutes using defined rules
- Copy last week's schedule with one click; coverage gaps visible at a glance

**Toggl Track**
- Not applicable — no shift scheduling.

**Homebase**
- Drag-and-drop scheduling with template support
- AI scheduling assistant generates and fills schedules based on employee availability and role
- Autopilot rules for recurring patterns

---

### 2.3 Shift Swap

**Deputy**
- Employees can request swap, pick up open shifts, or give away shifts from the mobile app
- Manager receives notification and approves/declines with one click
- Microsoft Teams integration: shift swap requests surface as actionable cards in Teams channels

**When I Work**
- Employee-initiated: offer a shift to eligible coworkers
- Once a coworker accepts, request routes to manager for one-click approval
- Rated as the strongest shift-swap UX among scheduling tools in 2026 reviews

**Toggl Track**
- Not applicable — no scheduling layer.

**Homebase**
- Employee-to-employee coordination: claim open shifts, propose covers, submit swaps
- Manager is not the go-between — employees coordinate in-app and manager approves
- Real-time visibility of trades and covers in the manager dashboard

---

### 2.4 Time Tracking

**Deputy**
- Digital timesheets replace manual processes
- Automatic time card created at clock-out with total hours, breaks, and premium rates
- Manager can review, edit, and approve from desktop or mobile
- Attestation requests triggered on late clock-in, unscheduled time, missed breaks, or early departure

**When I Work**
- Integrated time tracking — clock-in/out via mobile or kiosk with geofencing
- Generates payroll reports; real-time labor hour monitoring
- Time entries feed directly into scheduling data for labor cost visibility

**Toggl Track**
- Real-time start/stop timer, manual time entry, or duration-only logging
- Browser extension with auto-track (keyword-triggered project association)
- Offline tracking supported; syncs across Windows, macOS, Linux, iOS, Android, web
- No break tracking built in — employees must clock out/in for each break manually
- No automatic timesheet generation from shifts — manual submission workflow
- Timesheet approvals require Premium plan; submitted timesheets cannot be edited by manager directly

**Homebase**
- Clock-in/out via web, mobile app, tablet kiosk, or POS device
- PIN-based clock-in or photo verification (anti-buddy-punching)
- GPS location stamp captured at clock-in/out moment only (not continuous tracking)
- Automatic break tracking with compliance calculations
- Hours flow directly into timesheets for manager review; one-click payroll export

---

### 2.5 Overtime & Lateness Alerts

**Deputy**
- Real-time overtime alerts when employees approach or exceed thresholds
- Missed break alerts sent to managers
- Compliance flagging for violations of local, state, and federal labor laws
- Automatically requests attestation when staff clock in late, work unscheduled time, miss breaks, or leave early

**When I Work**
- Real-time overtime alert before the employee hits the threshold — adjustment window available
- Shows per-shift labor cost in real time as schedule is built
- Alerts if a user is scheduled beyond their max hours (warning, does not block scheduling)
- Can set max hours per day/week and max consecutive days as hard rules

**Toggl Track**
- No real-time overtime alerts — overtime hours are counted within total but not flagged
- No lateness detection — tool is not aware of scheduled shifts
- Automated email/Slack reminders for employees who are below daily/weekly hour targets (available on paid plans) — this is the closest analog

**Homebase**
- Real-time overtime alerts before thresholds are crossed
- Alerts for early clock-ins, forgotten clock-outs, and missed breaks
- Automated break tracking and overtime calculations built into compliance engine
- AI timesheet correction flags anomalies (e.g. accidental 12-hour shift from missed clock-out)

---

### 2.6 Mobile Clock-In / Clock-Out

**Deputy**
- Web browser, smartphone (iOS/Android), or central kiosk
- Biometric facial recognition on tablet kiosk
- GPS location stamp on mobile clock-in
- Live attendance feed: managers see who is in, on break, or out in real time

**When I Work**
- iOS and Android apps
- Geofencing enforces location-based clock-in (employee must be on-site)
- Kiosk mode for shared devices
- Manager dashboard shows real-time attendance status

**Toggl Track**
- iOS, Android, Windows, macOS, Linux, web — all platforms supported
- No GPS or geofencing
- No kiosk mode or location verification
- Primarily a self-service timer — no manager attendance feed

**Homebase**
- iOS, Android, tablet, POS device, web
- GPS verification (captured at clock-in/out moment, not continuous)
- Photo capture to prevent buddy punching
- PIN-based clock-in for kiosk setups
- Location limited to 3 preset geofence options: 150 ft, 1 block, or 5 blocks — no custom boundary

---

### 2.7 Payroll Integration

**Deputy**
- No native payroll — requires external payroll provider
- Timesheets export/sync to: QuickBooks, ADP, Gusto, Square, BambooHR, and others
- Wages, overtime, and premium rates auto-calculated before export
- One-click timesheet approval then export to payroll

**When I Work**
- No native payroll processing
- Integrates with payroll and HR systems to reduce redundant data entry
- Labor cost visibility built into scheduling; exports to payroll providers
- Payroll-ready reports generated from time tracking data

**Toggl Track**
- No native payroll processing
- Only 1 direct payroll integration: QuickBooks (requires Starter plan or above)
- Timesheet approval required before export (Premium plan feature)
- Managers cannot edit submitted timesheets directly — requires employee re-submission
- Export to CSV/PDF available for manual payroll processing

**Homebase**
- Native payroll module available on All-in-One plan (taxes auto-calculated, withheld, filed)
- Integrations: QuickBooks, Gusto, ADP, Square, Xero (200+ total integrations)
- Hours flow from time clock directly to timesheets to payroll — no manual transfer
- Payroll deductions, tips, and wage calculations automated
- Recognized as Best Payroll Services 2026 by Forbes

---

### 2.8 Labor Cost Forecasting

**Deputy**
- AI-powered demand forecasting: uses historical sales, demand trends, weather to predict optimal staffing
- Labor budget alerts: flag when a schedule exceeds budget
- Analytics add-on provides customizable reports on attendance patterns and labor costs

**When I Work**
- Real-time per-shift cost display as schedule is built
- Labor budgeting and forecasting tools on Multiple Locations plan
- Insights into attendance trends and labor costs for smarter resource allocation

**Toggl Track**
- Project budget tracking (estimated vs. actual hours) — project-level, not workforce scheduling
- Project forecast predicts completion dates based on time estimates and tracked hours
- No workforce labor cost forecasting against schedules

**Homebase**
- Real-time labor-to-sales ratio dashboard
- Scheduled labor vs. actual labor comparison
- Labor cost broken down by hour, department, and role
- AI Payroll Assistant provides cost guidance and anomaly detection

---

## 3. Feature Comparison Matrix

| Feature | Deputy | When I Work | Toggl Track | Homebase |
|---|---|---|---|---|
| **Week View** | Yes | Yes | No (time log only) | Yes |
| **Day View** | Yes | Yes | No | Yes |
| **Month View** | Yes | Yes (limited editing) | No | Yes |
| **Drag-to-Assign** | Yes | Yes | No | Yes |
| **AI Auto-Scheduler** | Yes | Yes (auto-assign) | No | Yes |
| **Shift Swap (employee-initiated)** | Yes | Yes | No | Yes |
| **Manager 1-click Approval** | Yes | Yes | No | Yes |
| **Real-time Overtime Alert** | Yes | Yes | No | Yes |
| **Lateness / Missed Break Alert** | Yes | Partial (hours only) | No | Yes |
| **Mobile Clock-In (iOS/Android)** | Yes | Yes | Yes (timer only) | Yes |
| **Kiosk / Shared Device Mode** | Yes | Yes | No | Yes |
| **GPS / Geofencing** | Yes | Yes (geofencing) | No | Yes (limited options) |
| **Photo Verification** | Yes (facial recognition) | No | No | Yes |
| **Break Tracking** | Yes | Yes | No | Yes |
| **Timesheet Approvals** | Yes | Yes | Yes (Premium only) | Yes |
| **Native Payroll** | No | No | No | Yes (All-in-One) |
| **Payroll Integrations** | Many (QuickBooks, ADP, Gusto, etc.) | Yes (multiple) | QuickBooks only | 200+ (Gusto, ADP, Square, QB, Xero) |
| **Labor Cost Forecasting** | Yes (AI-powered) | Yes (Multi-location plan) | No (project only) | Yes (real-time) |
| **Labor-to-Sales Ratio** | Yes | Partial | No | Yes |
| **Compliance Flagging** | Yes | Partial | No | Yes |
| **Team Messaging** | Yes | Yes | No | Yes |
| **Reporting / Analytics** | Yes (add-on for advanced) | Yes | Yes (strong) | Yes |
| **Free Plan** | No (31-day trial) | No (14-day trial) | Yes (up to 5 users) | Yes (1 location, 20 employees) |
| **Starting Price** | $4.50/user/month | $3/user/month | $9/user/month (paid) | Free / $20/location/month |
| **Pricing Model** | Per user | Per user | Per user | Per location |

---

## 4. UX Patterns Worth Borrowing

### Shift Calendar
- **Week view as default** with sticky day/date headers — Deputy and When I Work both do this well
- **Color-coding by role** (not just employee) — Deputy's role-color system makes coverage gaps visually obvious
- **Coverage gap indicators** — When I Work shows unfilled positions inline on the calendar grid
- **Month view for read-only review** — When I Work's pattern of limiting editing in month view (use week/day for edits) is sensible for dense data

### Drag-to-Assign
- **Shift block drag between rows** (reassign to different employee) AND **drag within a row** (move time slot) — both interactions are expected
- **Snap-to-grid** on 15 or 30-minute increments is standard
- **Visual ghost/preview** of shift during drag before drop confirmation

### Shift Swap Flow
- **Employee-initiated offer** → coworker acceptance → manager approval (3-step When I Work pattern)
- Swap requests surfaced as a distinct notification type in manager inbox
- Open shift "pool" view where uncovered shifts can be claimed

### Overtime / Alerts
- **Pre-threshold warning** (e.g. "employee will hit overtime if this shift is added") — not post-hoc
- Alert surfaced inline on the schedule grid next to the employee row, not buried in a sidebar
- Separate visual treatment for: (a) overtime risk, (b) missed clock-in, (c) missed break, (d) unscheduled work

### Mobile Clock-In
- GPS stamp on clock-in (not continuous tracking) — Homebase's privacy-respecting approach
- Photo capture for verification on shared/kiosk devices
- Live attendance feed for managers: who's in / on break / clocked out, updated in real time

### Labor Cost
- **Real-time cost display** as shifts are added to schedule — When I Work and Homebase both show this inline
- Labor-to-sales ratio as a headline metric — Homebase's approach of showing budget vs. actual side-by-side

---

## 5. Feature Gaps — Agency Shift Tracker with Payroll Deductions

This section maps what an agency-specific scheduler (isso-dashboard `/agency/schedule`) needs that none of these tools solve out of the box.

### 5.1 Model / Talent-Specific Scheduling Concepts
None of the four tools understand:
- **Booking slots vs. employment shifts** — agency models work bookings, not standard employee shifts. A "shift" maps to a client booking with variable start/end, location, and rate.
- **Multi-client concurrency rules** — a model may be booked by multiple clients in a week; the scheduler needs to prevent double-booking across client calendars.
- **Exclusive / non-compete windows** — some contracts lock a model out of competing brands for a period.
- **Rate tiers per booking** — base rate vs. overtime rate is standard; agency models may have day-rate, half-day rate, usage fees, and expense reimbursements in a single booking.

### 5.2 Payroll Deductions (Agency-Specific)
Standard tools handle wage calculation and overtime. They do not handle:
- **Agency commission deduction** — % cut taken by the agency from gross model earnings before payout
- **Expense advances and recovery** — if agency fronts travel/accommodation costs, recovery from model's next payout
- **Split-pay scenarios** — multiple models on one booking, earnings split by contribution/hours
- **Tax withholding variance by model type** — PAYE employees vs. self-employed contractors on the same roster

### 5.3 Calendar Integration Gaps
- None of the four tools natively sync with client-side booking systems (e.g. Airtable, custom CRMs)
- No concept of a "booking confirmation" state that differs from a published shift
- No client-visible calendar portal — all four tools are manager/employee-facing only

### 5.4 Reporting Gaps for Agency Context
- No tool produces an **agency P&L per model per period** (gross booking value, agency cut, model net, expenses)
- Labor cost forecasting assumes a fixed wage; agency revenue is variable and booking-dependent
- None surface a **utilization rate** metric (booked hours / available hours) per model — key for agency performance tracking

### 5.5 Compliance Gaps
- Standard overtime rules (e.g. 40-hour week threshold) do not map cleanly to talent whose "hours" span bookings, travel, and fitting prep
- No tool handles **minimum rest between bookings** as distinct from labor law rest breaks
- Certification / portfolio validity tracking (e.g. model card expiry, visa work authorization) is absent from all four

### 5.6 What to Build vs. What to Integrate
| Capability | Recommendation |
|---|---|
| Shift calendar (week/day view, drag-to-assign) | Build custom — use Deputy/When I Work UX as reference |
| Overtime / alert system | Build custom — standard alert patterns apply but trigger logic differs |
| Mobile clock-in | Deprioritize for agency — bookings are confirmed in advance, not shift-clock workflows |
| Payroll deductions (commission, advances) | Build custom — no existing tool covers agency deduction logic |
| Labor cost forecasting | Build custom with booking revenue as the input variable, not wage |
| Payroll export | Integrate with Xero or QuickBooks via their APIs — do not reinvent |
| Team messaging | Reuse existing isso-dashboard messaging layer if available; otherwise Homebase-style in-app messaging |
| Shift swap | Implement as "booking transfer" — different concept but same UX pattern |

---

## 6. Pricing Summary

| Tool | Model | Starting Price | Free Tier |
|---|---|---|---|
| Deputy | Per user | $4.50/user/month | No (31-day trial) |
| When I Work | Per user | $3/user/month | No (14-day trial) |
| Toggl Track | Per user | Free / $9/user/month | Yes (5 users) |
| Homebase | Per location | Free / $20/location/month | Yes (1 location, 20 employees) |

**Key takeaway:** Toggl Track and Homebase both have meaningful free tiers, but Toggl is not suitable for shift-based work. Homebase's per-location model becomes expensive fast for multi-location agencies. When I Work has the lowest per-seat entry price. Deputy is the most feature-complete for compliance-heavy, shift-driven operations.

---

## 7. Sources

- [Deputy — Official Site](https://www.deputy.com/)
- [Deputy Review 2026 — Connecteam](https://connecteam.com/reviews/deputy/)
- [Deputy Software — Capterra 2026](https://www.capterra.com/p/167811/Deputy/)
- [Deputy Employee Time Clock](https://www.deputy.com/features/employee-time-clock)
- [Deputy Scheduling — Everhour](https://everhour.com/blog/deputy-scheduling/)
- [When I Work Pricing 2026 — G2](https://www.g2.com/products/when-i-work/pricing)
- [When I Work Review — Business.com 2026](https://www.business.com/reviews/when-i-work/)
- [When I Work — Schedule Views Help](https://help.wheniwork.com/articles/schedule-views-computer/)
- [When I Work — Month View Help](https://help.wheniwork.com/articles/using-month-view-computer/)
- [Toggl Track Pricing — Official](https://toggl.com/track/pricing/)
- [Toggl Track Review 2026 — Connecteam](https://connecteam.com/reviews/toggl-track/)
- [Toggl Track Review 2026 — Clockify](https://clockify.me/reviews/toggl-track-review)
- [Toggl Track — Capterra 2026](https://www.capterra.com/p/247745/Toggl/)
- [Homebase — Official Site](https://www.joinhomebase.com)
- [Homebase Time Clock](https://www.joinhomebase.com/time-clock)
- [Homebase Review 2026 — GetApp](https://www.getapp.com/hr-employee-management-software/a/homebase/)
- [Homebase — Capterra 2026](https://www.capterra.com/p/153076/Homebase/)
- [Homebase Hourly Time Tracking Guide](https://www.joinhomebase.com/blog/hourly-employee-time-tracking-software)
