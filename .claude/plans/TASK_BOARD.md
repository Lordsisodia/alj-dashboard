# Agency Owner Dashboard -- TASK BOARD

## Overview

Build the `/agency` owner/manager dashboard for the ISSO OFM agency SaaS tool. This dashboard gives Alex (the agency owner) a high-level view of P&L, model roster, staff management, billing, recruitment, and team comms. The work is split into 8 phases across 3 tiers: foundation (Phase 1), existing page upgrades (Phase 2a/2b/2c), and new page builds (Phase 3a/3b/3c/3d).

**PROJECT_ROOT:** `/Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard`

**AD Source Reference:** `/Users/shaansisodia/Downloads/AD/extracted/` (NOTE: path unverified at plan time -- workers must locate the actual AD folder tree; if unavailable, build from the detailed specs below using existing ISSO patterns as the style guide)

**Design System:** ISSO light theme -- white content card (`#ffffff`), `text-neutral-900` primary text, `text-neutral-400` muted, `#f5f5f4` inner surfaces, `#ff0069` / `#833ab4` accent gradient. All components wrapped in `ContentPageShell`. See `ISSO_UI_RULES.md` and `ISSO_DASHBOARD_CONTEXT.md` for full spec.

---

## Phases

### Phase 1: Sidebar + Routing Foundation -- [ ] PENDING

**Files (modify):**
- `src/app/agency/sidebar-config.tsx`
- `src/app/agency/layout.tsx`

**Files (delete):**
- `src/app/agency/ideas/page.tsx`
- `src/app/agency/reports/page.tsx`

**Files (create):**
- `src/app/agency/staff/page.tsx`
- `src/app/agency/staff/tasks/page.tsx`
- `src/app/agency/comms/page.tsx`
- `src/app/agency/recruitment/page.tsx`
- `src/app/agency/recruitment/applicants/page.tsx`

**What:**

1. **Rewrite `sidebar-config.tsx`** -- Replace the entire `OWNERS_NAV_CONFIG` and `OWNERS_PERSISTENT_NAV` exports with the new navigation structure:

   **OWNERS_NAV_CONFIG** (SectionConfig[]):
   - **Section `overview`** (hotkey `Cmd+1`, icon `LayoutDashboard`):
     - Dashboard `/agency` (icon: `LayoutDashboard`)
     - Analytics `/agency/analytics` (icon: `TrendingUp`)
     - Billings `/agency/billings` (icon: `CreditCard`)
   - **Section `operations`** (hotkey `Cmd+2`, icon `Briefcase`):
     - Models `/agency/models` (icon: `Users2`)
     - Staff `/agency/staff` (icon: `UserCheck`)
     - Tasks `/agency/staff/tasks` (icon: `CheckSquare`)
     - Recruitment `/agency/recruitment` (icon: `UserPlus`)
   - **Section `team`** (hotkey `Cmd+3`, icon `Users2`):
     - Team `/agency/team` (icon: `Users2`)
     - Comms `/agency/comms` (icon: `MessageSquare`)

   **OWNERS_PERSISTENT_NAV** (NavItem[]):
   - Schedule `/agency/schedule` (icon: `Calendar`)
   - Settings `/agency/settings` (icon: `Settings`)

   Keep the same type imports from `@/shared/layout/isso-sidebar/sidebar-config` (`SectionConfig`, `NavItem`). Use `'use client'` directive. Import all icons from `lucide-react`.

2. **Update `layout.tsx`** -- No structural changes needed (it already imports from `./sidebar-config`), but verify the import of `OWNERS_NAV_CONFIG` and `OWNERS_PERSISTENT_NAV` still works after the rewrite. The `appName` should remain `'Owners'`.

3. **Delete route stubs:**
   - Delete `src/app/agency/ideas/page.tsx` entirely
   - Delete `src/app/agency/reports/page.tsx` entirely

4. **Create new route stubs** -- Each is a minimal page.tsx that imports a placeholder component. Since the actual feature components do not exist yet (built in Phases 2/3), each stub should render a temporary placeholder:

   ```tsx
   // Pattern for each new stub:
   import type { Metadata } from "next";
   export const metadata: Metadata = { title: "{PageName} | Agency | ORACLE" };
   export default function Agency{PageName}Page() {
     return (
       <div className="flex-1 flex items-center justify-center p-8">
         <div className="text-center">
           <p className="text-lg font-semibold text-neutral-900">{PageName}</p>
           <p className="text-sm text-neutral-400 mt-1">Coming soon</p>
         </div>
       </div>
     );
   }
   ```

   Create stubs for:
   - `src/app/agency/staff/page.tsx` -- title "Staff | Agency | ORACLE"
   - `src/app/agency/staff/tasks/page.tsx` -- title "Tasks | Agency | ORACLE"
   - `src/app/agency/comms/page.tsx` -- title "Comms | Agency | ORACLE"
   - `src/app/agency/recruitment/page.tsx` -- title "Recruitment | Agency | ORACLE"
   - `src/app/agency/recruitment/applicants/page.tsx` -- title "Applicants | Agency | ORACLE"

**Success criteria:**
- Sidebar shows 3 product icon sections (Overview, Operations, Team) + 2 persistent nav items (Schedule, Settings)
- All sidebar links navigate to correct routes
- `/agency/ideas` and `/agency/reports` routes no longer exist (404 is acceptable)
- All 5 new route stubs render their placeholder text without errors
- Existing routes (`/agency`, `/agency/analytics`, `/agency/billings`, `/agency/models`, `/agency/team`, `/agency/schedule`, `/agency/settings`) continue to work
- `npx tsc --noEmit` passes with zero errors related to agency routes
- Dev server loads at `localhost:3100/agency` without crashes

---

### Phase 2a: Analytics Upgrade -- [ ] PENDING

**Files (create):**
- `src/features/agency/analytics/components/AgencyAnalyticsPage.tsx`
- `src/features/agency/analytics/components/index.ts`
- `src/features/agency/analytics/components/charts/EngagementBars.tsx`
- `src/features/agency/analytics/components/charts/FollowerChart.tsx`
- `src/features/agency/analytics/components/stats/StatCard.tsx`
- `src/features/agency/analytics/components/tables/TopPostsTable.tsx`
- `src/features/agency/analytics/components/insights/AudienceInsights.tsx`
- `src/features/agency/analytics/types.ts`
- `src/features/agency/analytics/constants.ts`

**Files (modify):**
- `src/app/agency/analytics/page.tsx`

**What:**

Build an owner-focused analytics page under `src/features/agency/analytics/`. This is NOT the same as the existing `src/features/analytics/` (which is the ISSO content-gen analytics). The agency analytics focuses on cross-model business metrics from the owner's perspective.

1. **Create `AgencyAnalyticsPage.tsx`** -- Owner-framed analytics page using `ContentPageShell`:
   - Wrap in `ContentPageShell` with title "Analytics", icon gradient `#ff0069 -> #833ab4`
   - Tabs: Overview, Growth, Revenue (same as existing analytics but with owner-specific data)
   - Filter chips: 7d, 30d, 90d, 1y
   - Content sections (all light-themed, white cards with `rgba(0,0,0,0.07)` borders):
     - **KPI row** (4 cards): Total Revenue, Avg Engagement, Active Models, Content Output
     - **Follower Chart**: SVG line/area chart showing aggregate follower growth across all models
     - **Engagement Bars**: Horizontal bar chart per model showing engagement rate comparison
     - **Top Posts Table**: Table with columns: Post, Model, Likes, Comments, Saves, Engagement Rate
     - **Audience Insights**: Demographics breakdown (age, gender, location) as horizontal bars

2. **Create sub-components** following the existing analytics pattern (see `src/features/analytics/components/` for reference):
   - `StatCard.tsx` -- Light-themed stat card: white bg, `rgba(0,0,0,0.07)` border, `text-neutral-900` value, `text-neutral-400` label, colored icon badge
   - `FollowerChart.tsx` -- SVG area chart (no chart libraries -- use custom SVG paths per ISSO_UI_RULES)
   - `EngagementBars.tsx` -- Horizontal bars using Framer Motion for animation
   - `TopPostsTable.tsx` -- Light table with `text-neutral-900` text, `rgba(0,0,0,0.05)` row borders
   - `AudienceInsights.tsx` -- Demographic bars with age/gender/location breakdowns

3. **Create `types.ts`** with tab type and data interfaces.

4. **Create `constants.ts`** with seed data for 4 models (Tyler Rex, Ren Rhinx, Ella Mira, Sam Chase).

5. **Create `index.ts`** re-exporting `AgencyAnalyticsPage`.

6. **Update `src/app/agency/analytics/page.tsx`** -- Change import from:
   ```tsx
   import AnalyticsFeaturePage from '@/features/analytics/components/AnalyticsFeaturePage';
   ```
   To:
   ```tsx
   import { AgencyAnalyticsPage } from '@/features/agency/analytics/components';
   ```
   And update the component usage accordingly.

**Key styling rules (ISSO light theme):**
- Card backgrounds: `#ffffff` with `border: 1px solid rgba(0,0,0,0.07)`
- Page content area background: `#fafafa`
- Text: `text-neutral-900` (primary), `text-neutral-400` (muted), `text-neutral-500` (labels)
- Icon badges: colored `bg-{color}/10` backgrounds with matching icon color
- NO dark theme styles (no `rgba(255,255,255,...)`, no `text-white`)
- Use Framer Motion `fadeUp` animation pattern for staggered entry

**Success criteria:**
- `/agency/analytics` renders the new owner-focused analytics page
- 4 KPI stat cards display with animated count-up
- Follower chart renders as SVG (no external chart library)
- Engagement bars animate on mount
- Top posts table shows 5+ seed posts
- Audience insights show age, gender, location breakdowns
- All components are light-themed matching ISSO design system
- `npx tsc --noEmit` passes

---

### Phase 2b: Models Upgrade -- [ ] PENDING

**Files (create):**
- `src/features/agency/models/components/AgencyModelsPage.tsx`
- `src/features/agency/models/components/index.ts`
- `src/features/agency/models/components/roster/RosterView.tsx`
- `src/features/agency/models/components/roster/ModelRosterCard.tsx`
- `src/features/agency/models/components/performance/PerformanceView.tsx`
- `src/features/agency/models/components/onboarding/OnboardingView.tsx`
- `src/features/agency/models/components/AddModelDrawer.tsx`
- `src/features/agency/models/types.ts`
- `src/features/agency/models/constants.ts`

**Files (modify):**
- `src/app/agency/models/page.tsx`

**What:**

Build an owner-focused models management page. Unlike the existing `src/features/models/` (which is the content pipeline tracker for chatters), this version frames models as revenue-generating assets with health metrics.

1. **Create `AgencyModelsPage.tsx`** -- Owner models page using `ContentPageShell`:
   - Title: "Models", icon gradient, action button: "Add Model" with `UserPlus` icon
   - Tabs: Onboarding, Roster, Performance
   - Filter chips on Roster tab: All, Active, Onboarding, Paused, No Brief

2. **Create `RosterView.tsx`** -- Grid of model cards showing:
   - Model avatar (colored initials circle)
   - Name and handle
   - Revenue this month (e.g. "$4,200")
   - Health score indicator (green/amber/red dot)
   - Subscriber count
   - Status badge (Active/Onboarding/Paused)
   - Last active timestamp

3. **Create `ModelRosterCard.tsx`** -- Individual card component:
   - White card, `rgba(0,0,0,0.07)` border, rounded-xl
   - Top: avatar + name + handle
   - Middle: revenue + subscriber count
   - Bottom: status badge + health indicator
   - Hover: subtle shadow lift (`hover:shadow-md transition-shadow`)

4. **Create `PerformanceView.tsx`** -- Owner performance comparison:
   - Revenue comparison bar chart (horizontal bars per model)
   - Engagement rate comparison
   - Growth rate comparison
   - Table: Model, Revenue, Subs, Engagement, Growth, Status

5. **Create `OnboardingView.tsx`** -- Pipeline for new models being onboarded:
   - Kanban-style columns: Application -> Profile Setup -> Content Brief -> Training -> Active
   - Cards show model name, stage, days in stage, assigned manager

6. **Create `AddModelDrawer.tsx`** -- Slide-out drawer with form fields:
   - Name, Handle, Platform, Niche, Notes
   - Save/Cancel buttons
   - Light-themed: white bg, neutral borders

7. **Create `types.ts`** and `constants.ts`** with model data for Tyler Rex, Ren Rhinx, Ella Mira, Sam Chase.

8. **Create `index.ts`** re-exporting `AgencyModelsPage`.

9. **Update `src/app/agency/models/page.tsx`** -- Change import to:
   ```tsx
   import { AgencyModelsPage } from '@/features/agency/models/components';
   ```

**Success criteria:**
- `/agency/models` renders the owner-focused models page
- Roster view shows 4 model cards in a responsive grid
- Performance view shows comparison charts and table
- Onboarding view shows pipeline columns
- Add Model drawer opens and closes
- All light-themed, no dark styles
- `npx tsc --noEmit` passes

---

### Phase 2c: Billings Upgrade -- [ ] PENDING

**Files (create):**
- `src/features/agency/billings/components/AgencyBillingsPage.tsx`
- `src/features/agency/billings/components/index.ts`
- `src/features/agency/billings/components/StatCard.tsx`
- `src/features/agency/billings/components/TeamPayrollTable.tsx`
- `src/features/agency/billings/components/ModelEarningsBreakdown.tsx`
- `src/features/agency/billings/components/PayStatusBadge.tsx`
- `src/features/agency/billings/types.ts`
- `src/features/agency/billings/constants.ts`

**Files (modify):**
- `src/app/agency/billings/page.tsx`

**What:**

Build an owner-focused billings page. The existing `src/features/billings/` uses dark theme styling (`rgba(255,255,255,...)` colors, dark backgrounds). This new version must be fully light-themed.

1. **Create `AgencyBillingsPage.tsx`** -- Owner billings using `ContentPageShell`:
   - Title: "Billings & Payouts", icon gradient
   - No tabs (single view)
   - Sections:
     - **4 KPI Cards** (grid-cols-4): Total Payroll ($3,520), Team Members (7), Pending Payouts ($2,750), Paid Out ($12,400)
     - **Team Payroll Table**: Name, Role, Department, Base, Commission, Bonuses, Deductions, Total, Status
     - **Model Earnings Breakdown**: Card per model showing name, revenue, margin, trend

2. **Create `StatCard.tsx`** -- LIGHT themed version:
   - White background, `rgba(0,0,0,0.07)` border
   - `text-neutral-900` for values, `text-neutral-400` for labels
   - Colored icon badge (`bg-{color}/10`)
   - Framer Motion fade-in animation

3. **Create `TeamPayrollTable.tsx`** -- LIGHT themed:
   - White background table with `rgba(0,0,0,0.05)` row borders
   - Header: `text-neutral-400` uppercase
   - Body: `text-neutral-900` for amounts, `text-neutral-500` for roles
   - Avatar circles with gradient background

4. **Create `ModelEarningsBreakdown.tsx`** -- Grid of model earnings cards:
   - Per model: avatar, name, revenue, margin percentage, trend arrow
   - Light card styling

5. **Create `PayStatusBadge.tsx`** -- Status badge (Paid/Pending/Processing):
   - Paid: green bg/text
   - Pending: amber bg/text
   - Processing: blue bg/text

6. **Create `types.ts`** and `constants.ts`** -- Reuse the same data shape as existing `src/features/billings/components/constants.ts` but ensure the types are standalone (no cross-imports).

7. **Create `index.ts`** re-exporting `AgencyBillingsPage`.

8. **Update `src/app/agency/billings/page.tsx`** -- Change import to:
   ```tsx
   import { AgencyBillingsPage } from '@/features/agency/billings/components';
   ```

**Success criteria:**
- `/agency/billings` renders the new light-themed billings page
- 4 KPI cards display at top with correct values
- Team payroll table shows 7 employees with all columns
- Model earnings breakdown shows 4 model cards
- ALL styling is light theme (zero `text-white`, zero `rgba(255,255,255,...)`)
- Pay status badges show correct colors
- `npx tsc --noEmit` passes

---

### Phase 3a: Staff Page -- [ ] PENDING

**Files (create):**
- `src/features/agency/staff/components/AgencyStaffPage.tsx`
- `src/features/agency/staff/components/index.ts`
- `src/features/agency/staff/components/ShiftControlPanel.tsx`
- `src/features/agency/staff/components/ShiftStatusBanner.tsx`
- `src/features/agency/staff/components/ShiftActivityFeed.tsx`
- `src/features/agency/staff/components/AgencyCalendar.tsx`
- `src/features/agency/staff/components/LateEscalationDisplay.tsx`
- `src/features/agency/staff/types.ts`
- `src/features/agency/staff/constants.ts`

**Files (modify):**
- `src/app/agency/staff/page.tsx`

**What:**

Build a staff shift management page inspired by a Telegram-style shift interface. This gives the owner visibility into who is on shift, activity feeds, and escalation alerts.

1. **Create `AgencyStaffPage.tsx`** -- Main page using `ContentPageShell`:
   - Title: "Staff", icon gradient
   - Tabs: Active Shifts, Calendar, Escalations
   - Layout: Two-column on Active Shifts tab (left: control panel + activity feed, right: status banner)

2. **Create `ShiftControlPanel.tsx`** -- Panel showing:
   - Current shift info (who is on, shift time remaining)
   - Quick actions: Start Shift, End Shift, Break
   - Staff member list with online/offline status dots

3. **Create `ShiftStatusBanner.tsx`** -- Top banner showing:
   - Number of staff online
   - Current shift phase (Morning/Afternoon/Night)
   - Time remaining in current shift

4. **Create `ShiftActivityFeed.tsx`** -- Real-time-style feed:
   - Timestamped entries: "[10:32] Sofia started shift", "[10:45] Kristine took break"
   - Color-coded by type (start=green, break=amber, end=red, message=blue)
   - Scrollable container with max height

5. **Create `AgencyCalendar.tsx`** -- Monthly calendar grid:
   - Days showing shift assignments
   - Color dots for each staff member
   - Click to expand day details

6. **Create `LateEscalationDisplay.tsx`** -- Escalation alerts:
   - Cards for late staff with: name, expected time, actual time, delay duration
   - Red/amber color coding by severity
   - Action buttons: Send Reminder, Mark Excused

7. **Create `types.ts`** and `constants.ts`** with seed data for staff shifts.

8. **Create `index.ts`** re-exporting `AgencyStaffPage`.

9. **Update `src/app/agency/staff/page.tsx`** -- Replace placeholder with:
   ```tsx
   import { AgencyStaffPage } from '@/features/agency/staff/components';
   ```

**Success criteria:**
- `/agency/staff` renders the staff management page
- Active Shifts tab shows control panel + activity feed + status banner
- Calendar tab shows monthly grid with shift assignments
- Escalations tab shows late staff alerts
- All light-themed
- `npx tsc --noEmit` passes

---

### Phase 3b: Staff Tasks Page -- [ ] PENDING

**Files (create):**
- `src/features/agency/staff-tasks/components/AgencyStaffTasksPage.tsx`
- `src/features/agency/staff-tasks/components/index.ts`
- `src/features/agency/staff-tasks/components/TaskBoard.tsx`
- `src/features/agency/staff-tasks/components/TaskCard.tsx`
- `src/features/agency/staff-tasks/components/TaskListView.tsx`
- `src/features/agency/staff-tasks/components/TaskTableView.tsx`
- `src/features/agency/staff-tasks/components/CreateTaskModal.tsx`
- `src/features/agency/staff-tasks/types.ts`
- `src/features/agency/staff-tasks/constants.ts`

**Files (modify):**
- `src/app/agency/staff/tasks/page.tsx`

**What:**

Build a task management hub for assigning and tracking staff work.

1. **Create `AgencyStaffTasksPage.tsx`** -- Main page using `ContentPageShell`:
   - Title: "Tasks", action button: "New Task" (opens CreateTaskModal)
   - Tabs: Board, List, Table
   - Filter chips: All, My Tasks, Urgent, Completed

2. **Create `TaskBoard.tsx`** -- Kanban board:
   - Columns: Backlog, In Progress, Review, Done
   - Each column shows count badge
   - Cards are draggable (visual only -- no DnD library needed, just layout)

3. **Create `TaskCard.tsx`** -- Individual task card:
   - Title, assignee avatar, priority badge (High/Medium/Low), due date
   - Status-colored left border (backlog=gray, progress=blue, review=amber, done=green)
   - White card with light border

4. **Create `TaskListView.tsx`** -- Flat list of tasks with grouping by status.

5. **Create `TaskTableView.tsx`** -- Full table view:
   - Columns: Task, Assignee, Priority, Status, Due Date, Created
   - Sortable headers (visual only)

6. **Create `CreateTaskModal.tsx`** -- Modal form:
   - Fields: Title, Description, Assignee (dropdown), Priority (pills), Due Date
   - Save/Cancel buttons
   - Light-themed modal with dark backdrop

7. **Create `types.ts`** and `constants.ts`** with seed tasks assigned to staff members.

8. **Create `index.ts`** re-exporting `AgencyStaffTasksPage`.

9. **Update `src/app/agency/staff/tasks/page.tsx`** -- Replace placeholder with import.

**Success criteria:**
- `/agency/staff/tasks` renders the tasks hub
- Board view shows 4 kanban columns with task cards
- List and Table views render correctly
- Create Task modal opens and closes
- All light-themed
- `npx tsc --noEmit` passes

---

### Phase 3c: Comms Page -- [ ] PENDING

**Files (create):**
- `src/features/agency/comms/components/AgencyCommsPage.tsx`
- `src/features/agency/comms/components/index.ts`
- `src/features/agency/comms/components/ChannelList.tsx`
- `src/features/agency/comms/components/MessageThread.tsx`
- `src/features/agency/comms/components/AnnouncementBanner.tsx`
- `src/features/agency/comms/types.ts`
- `src/features/agency/comms/constants.ts`

**Files (modify):**
- `src/app/agency/comms/page.tsx`

**What:**

Build an agency internal communications page for team messaging and announcements.

1. **Create `AgencyCommsPage.tsx`** -- Main page using `ContentPageShell`:
   - Title: "Comms", icon gradient
   - Tabs: Channels, Announcements, Direct Messages
   - Two-column layout: left sidebar (channel list), right panel (message thread)

2. **Create `ChannelList.tsx`** -- Left sidebar:
   - Channel items: #general, #models, #chatters, #managers, #urgent
   - Each shows: channel name, last message preview, timestamp, unread badge
   - Active channel highlighted with subtle background

3. **Create `MessageThread.tsx`** -- Right panel:
   - Message bubbles with: avatar, name, timestamp, message text
   - Input bar at bottom with send button
   - Light-themed bubbles (own messages slightly tinted)

4. **Create `AnnouncementBanner.tsx`** -- Pinned announcements:
   - Card with gradient accent border
   - Title, body, author, timestamp
   - Pin icon indicator

5. **Create `types.ts`** and `constants.ts`** with seed channels and messages.

6. **Create `index.ts`** re-exporting `AgencyCommsPage`.

7. **Update `src/app/agency/comms/page.tsx`** -- Replace placeholder with import.

**Success criteria:**
- `/agency/comms` renders the comms page
- Channel list shows 5 channels with previews
- Clicking a channel shows its message thread
- Announcements tab shows pinned messages
- All light-themed
- `npx tsc --noEmit` passes

---

### Phase 3d: Recruitment Page -- [ ] PENDING

**Files (create):**
- `src/features/agency/recruitment/components/AgencyRecruitmentPage.tsx`
- `src/features/agency/recruitment/components/index.ts`
- `src/features/agency/recruitment/components/RecruitmentHub.tsx`
- `src/features/agency/recruitment/components/ApplicantsTable.tsx`
- `src/features/agency/recruitment/components/PipelineStageBar.tsx`
- `src/features/agency/recruitment/components/StatTile.tsx`
- `src/features/agency/recruitment/types.ts`
- `src/features/agency/recruitment/constants.ts`

**Files (modify):**
- `src/app/agency/recruitment/page.tsx`
- `src/app/agency/recruitment/applicants/page.tsx`

**What:**

Build a recruitment hub for hiring new team members (chatters, VAs, managers).

1. **Create `AgencyRecruitmentPage.tsx`** -- Hub page using `ContentPageShell`:
   - Title: "Recruitment", action button: "Post Opening"
   - Tabs: Overview, Applicants (navigates to `/agency/recruitment/applicants`)
   - Overview content:
     - **Stat tiles** (grid-cols-4): Open Positions (3), Total Applicants (24), Interviews Scheduled (5), Hired This Month (2)
     - **Pipeline Stage Bar**: Visual horizontal bar showing applicants per stage (Applied -> Screen -> Interview -> Trial -> Hired)
     - **Department filter pills**: All, Chatters, Social VAs, Managers
     - **Recent applicants list**: Top 5 recent with name, role applied, date, status badge

2. **Create `RecruitmentHub.tsx`** -- The overview content component.

3. **Create `ApplicantsTable.tsx`** -- Full applicants table for the `/applicants` sub-route:
   - Columns: Name, Role, Applied Date, Status, Stage, Rating, Actions
   - Search bar at top
   - Filter by status: All, New, Screening, Interview, Trial, Hired, Rejected
   - Expandable rows showing: cover letter snippet, notes, interview date
   - Status badges with color coding

4. **Create `PipelineStageBar.tsx`** -- Horizontal segmented bar:
   - Segments: Applied (gray), Screen (blue), Interview (amber), Trial (purple), Hired (green)
   - Each segment width proportional to applicant count
   - Count labels on each segment

5. **Create `StatTile.tsx`** -- Reusable stat tile:
   - Icon, label, value, optional change indicator
   - Light-themed card

6. **Create `types.ts`** and `constants.ts`** with seed applicant data (8-10 applicants across stages).

7. **Create `index.ts`** re-exporting `AgencyRecruitmentPage` and `ApplicantsTable`.

8. **Update route pages:**
   - `src/app/agency/recruitment/page.tsx` -- Import and render `AgencyRecruitmentPage`
   - `src/app/agency/recruitment/applicants/page.tsx` -- Import and render applicants view wrapped in `ContentPageShell`

**Success criteria:**
- `/agency/recruitment` renders the recruitment hub with stat tiles and pipeline bar
- `/agency/recruitment/applicants` renders the full applicants table
- Pipeline stage bar shows proportional segments
- Applicants table supports search and status filtering
- All light-themed
- `npx tsc --noEmit` passes

---

## Dependencies

```
Phase 1 (foundation)
  |
  +-- Phase 2a (Analytics)     -- can run in parallel with 2b, 2c, 3a, 3b, 3c, 3d
  +-- Phase 2b (Models)        -- can run in parallel with 2a, 2c, 3a, 3b, 3c, 3d
  +-- Phase 2c (Billings)      -- can run in parallel with 2a, 2b, 3a, 3b, 3c, 3d
  +-- Phase 3a (Staff)         -- can run in parallel with 2a, 2b, 2c, 3b, 3c, 3d
  +-- Phase 3b (Staff Tasks)   -- can run in parallel with 2a, 2b, 2c, 3a, 3c, 3d
  +-- Phase 3c (Comms)         -- can run in parallel with 2a, 2b, 2c, 3a, 3b, 3d
  +-- Phase 3d (Recruitment)   -- can run in parallel with 2a, 2b, 2c, 3a, 3b, 3c
```

**Phase 1 MUST complete first.** All other phases can run fully in parallel after Phase 1.

---

## File Ownership Matrix (Race Condition Prevention)

| File | Phase | Action |
|------|-------|--------|
| `src/app/agency/sidebar-config.tsx` | 1 ONLY | Modify |
| `src/app/agency/layout.tsx` | 1 ONLY | Verify (minor touch) |
| `src/app/agency/ideas/page.tsx` | 1 ONLY | Delete |
| `src/app/agency/reports/page.tsx` | 1 ONLY | Delete |
| `src/app/agency/staff/page.tsx` | 1 creates stub, 3a replaces | Sequential (1 before 3a) |
| `src/app/agency/staff/tasks/page.tsx` | 1 creates stub, 3b replaces | Sequential (1 before 3b) |
| `src/app/agency/comms/page.tsx` | 1 creates stub, 3c replaces | Sequential (1 before 3c) |
| `src/app/agency/recruitment/page.tsx` | 1 creates stub, 3d replaces | Sequential (1 before 3d) |
| `src/app/agency/recruitment/applicants/page.tsx` | 1 creates stub, 3d replaces | Sequential (1 before 3d) |
| `src/app/agency/analytics/page.tsx` | 2a ONLY | Modify |
| `src/features/agency/analytics/**` | 2a ONLY | Create |
| `src/app/agency/models/page.tsx` | 2b ONLY | Modify |
| `src/features/agency/models/**` | 2b ONLY | Create |
| `src/app/agency/billings/page.tsx` | 2c ONLY | Modify |
| `src/features/agency/billings/**` | 2c ONLY | Create |
| `src/features/agency/staff/**` | 3a ONLY | Create |
| `src/features/agency/staff-tasks/**` | 3b ONLY | Create |
| `src/features/agency/comms/**` | 3c ONLY | Create |
| `src/features/agency/recruitment/**` | 3d ONLY | Create |

**No file appears in more than one parallel phase.** All parallel phases (2a-3d) are safe to run concurrently after Phase 1 completes. The route page.tsx files created as stubs in Phase 1 are modified by their respective Phase 2/3 workers -- this is safe because Phase 1 completes before any parallel work begins.

---

## Verification

**TypeScript check:**
```bash
cd /Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard && npx tsc --noEmit
```

**Dev server:**
```bash
cd /Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard && PATH="/opt/homebrew/bin:$PATH" npx next dev --port 3100
```

**Visual verification checklist:**
1. `localhost:3100/agency` -- Owner dashboard loads, sidebar shows new nav structure
2. `localhost:3100/agency/analytics` -- Owner analytics with KPIs, charts, tables
3. `localhost:3100/agency/models` -- Model roster with cards, performance, onboarding
4. `localhost:3100/agency/billings` -- Light-themed billings with payroll table
5. `localhost:3100/agency/staff` -- Staff shift management
6. `localhost:3100/agency/staff/tasks` -- Task board with kanban columns
7. `localhost:3100/agency/comms` -- Comms with channels and messages
8. `localhost:3100/agency/recruitment` -- Recruitment hub with pipeline bar
9. `localhost:3100/agency/recruitment/applicants` -- Full applicants table
10. `localhost:3100/agency/schedule` -- Still works (unchanged)
11. `localhost:3100/agency/settings` -- Still works (unchanged)
12. `localhost:3100/agency/team` -- Still works (unchanged)
13. `localhost:3100/agency/ideas` -- Returns 404 (deleted)
14. `localhost:3100/agency/reports` -- Returns 404 (deleted)

**Expected:** Zero TypeScript errors. All routes render. All pages use ISSO light theme. No dark-themed components.
