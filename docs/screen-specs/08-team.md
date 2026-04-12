# Screen 08 — Team

**Route:** `/team`  
**File:** `src/app/team/page.tsx` (814 lines)

---

## What it does

Full team management screen. Manage who has access, what accounts they can touch, what they're allowed to do, and what they've been doing. Also separates **team members** (dashboard login) from **contacts** (models — no login, just tracked).

---

## Layout

### Page header
- "Team" title + description
- "Invite Member" button (pink gradient) → opens Invite Modal

### Stats row (4 cards)
- Total Members (with login access)
- Online Now
- Accounts Managed (across all members)
- Tasks This Week (across all members)

### 2-column layout (2:1)

**Left (2 cols) — Team Members list**

Each member card:
- Avatar (initials + gradient)
- Name + Role badge (Admin / VA / Editor / Model)
- Online status dot (green=online, yellow=away, grey=offline)
- Email address
- Account access pills (shows up to 4 account handles, "+N more" overflow)
- "X tasks this week" + "Active [time]"
- Edit button + Message button (per member)

Roles and badge colours:
- Admin: purple
- VA: cyan (`#00f4e2`)
- Editor: pink
- Model: amber

**Right (1 col) — Contacts (No Login Access)**

Simpler list for models:
- Avatar (gradient)
- Name + @handle
- Role badge (Model)

These are tracked but can't log in to the dashboard.

### Activity Log

Scrollable list (max 420px) of recent team actions:
```
[Avatar] Mikee approved content for @abg.ricebunny  · 2h ago
[Avatar] Yssa uploaded 3 clips to Content Pipeline   · 4h ago
[Avatar] Raphael completed 2 edits for @rhinxrenx   · 6h ago
```

### Permissions Matrix

Table: members as rows, permissions as columns.

Columns: Schedule | Upload | Approve | Analytics | Manage Team | Settings

Each cell: ✓ (green) or — (grey dash)

Current permissions in reference:
| Member | Schedule | Upload | Approve | Analytics | Manage Team | Settings |
|--------|---------|--------|---------|-----------|-------------|----------|
| Alex (Admin) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Mikee (VA) | ✓ | ✓ | ✓ | — | — | — |
| Yssa (VA) | ✓ | ✓ | — | — | — | — |
| Raphael (Editor) | — | — | — | ✓ | — | — |

---

## Invite Modal

Full-screen modal (blur backdrop):
- Full Name input
- Email input
- Role selector: VA / Editor (toggle buttons)
- Account Access: checkbox grid of all account handles
- Cancel / Send Invite buttons

---

## Data needed (Convex)

```ts
// teamMembers table
{
  name: string,
  email: string,
  role: "Admin" | "VA" | "Editor",
  status: "Online" | "Away" | "Offline",
  accountAccess: string[],    // model IDs they can manage
  permissions: {
    schedule: boolean,
    upload: boolean,
    approve: boolean,
    analytics: boolean,
    manageTeam: boolean,
    settings: boolean,
  },
  tasksThisWeek: number,      // computed or tracked
  lastActive: number,
  inviteAccepted: boolean,
}

// contacts table (models — no login)
{
  name: string,
  handle: string,             // OF or IG handle
  role: "Model",
  modelId: string,            // links to models table
}

// activity table
{
  actorId: string,
  actorName: string,
  action: string,
  target: string,
  timestamp: number,
}

// Convex mutations:
// team.invite(name, email, role, accountAccess) → sends email invite
// team.updatePermissions(memberId, permissions)
// team.updateStatus(memberId, status)        // from presence/heartbeat
```

---

## OFM adaptations

Minimal changes needed — team structure is identical:

| Reference | ISSO |
|---|---|
| "10 accounts managed" | Same — multiple OF accounts managed |
| VA role | Same — VAs handle scheduling, approvals |
| Editor role | Same — editors handle video editing |
| Account access = @igHandles | Account access = OF model accounts |
| "Message" button | Could link to Telegram/Slack |

---

## Key design details to preserve

- `StatusDot` component (online/away/offline indicator)
- `RoleBadge` component with role-specific colours
- `AccountPill` component for handle tags
- Permissions matrix grid layout (`gridTemplateColumns: "2fr repeat(6, 1fr)"`)
- Activity log with scrollable max-height container
- Invite modal with account access checkbox grid

---

## Open questions

- OPEN: Should online/offline status be real-time (Convex presence) or manual?
- OPEN: "Tasks this week" — is this tracked automatically from actions, or manually entered?
- OPEN: Should the invite flow send a real email, or just create a pending account they activate?
- ASSUMED: Permissions are admin-editable, not self-service.
