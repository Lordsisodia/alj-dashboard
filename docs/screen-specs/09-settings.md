# Screen 09 — Settings

**Route:** `/settings`  
**File:** `src/app/settings/page.tsx` (644 lines)

---

## What it does

Account configuration hub. 6 tabs covering every admin-configurable aspect of the dashboard. Uses a left sidebar nav (within the page) + animated tab content area.

---

## Tab structure

Left sidebar nav with icon + label. Active tab shows pink left-border indicator (Framer Motion `layoutId`).

Tabs: Profile | Connected Accounts | Integrations | Content Defaults | Team & Permissions | Billing

---

## Tab 1 — Profile

- Avatar (initials circle, gradient)
- Display Name, Email, Timezone, Role (read-only grid)
- **Notifications section:**
  - Email alerts toggle
  - Slack notifications toggle
  - Push notifications toggle
  - All use `AnimatedToggle` — spring-animated pill switch (`#ff0069` when on)

---

## Tab 2 — Connected Accounts

Grid of linked creator accounts (2-col):

Each account card:
- Avatar + handle + creator name
- "Connected" (green) or "Not Connected" (amber) status badge
- Follower count
- Active ✓ or Reconnect ⚠ indicator

"Connect New Account" button (full-width, gradient)

---

## Tab 3 — Integrations

List of connected services:

| Service | Status in ref |
|---------|--------------|
| Google Drive | Connected — auto-sync clips |
| Airtable | Connected — pipeline & content management |
| Telegram Bot | Connected — @NVTIMEBOT |
| Meta Graph API | Not Connected — post scheduling & insights |

Each row:
- Service icon + name + description note
- If connected: last synced time + breathing green dot + "Configure" button
- If not connected: "Not Connected" badge + "Connect" gradient button

---

## Tab 4 — Content Defaults

**Model & Niche section:**
- Default Niche dropdown
- Default Model dropdown

**AI Enhancement section:**
- "Auto-enhance clips" toggle
- Enhancement level slider (Subtle / Moderate / Aggressive)

**Posting Defaults section:**
- Default Drive Folder path display
- "Auto-generate hashtags" toggle
- Default Post Time: "Best performing hours" radio (recommended)

---

## Tab 5 — Team & Permissions

Simpler team table (compared to full `/team` screen):
- Name, Role badge, Access description, chevron
- "Generate Invite Link" button

---

## Tab 6 — Billing

**Plan card (holographic gradient border):**
- Current plan: "IGINFULL Platform" / $19/mo → ISSO pricing
- "Active" status badge
- Usage progress bars: Accounts (30%), Clips this month (47%) — animated on mount
- "Upgrade Plan" + "Manage Subscription" buttons

**Invoice History table:**
- Month, Date, Status (Paid green badge), Amount, PDF download

**Referral card:**
- "Refer a friend, earn free months"
- 1 month free per paying referral
- "Get link" button

---

## Data needed (Convex)

```ts
// settings table (per workspace/agency)
{
  agencyId: string,
  profile: {
    displayName: string,
    email: string,
    timezone: string,
    role: string,
    avatarInitials: string,
  },
  notifications: {
    email: boolean,
    slack: boolean,
    push: boolean,
  },
  contentDefaults: {
    defaultNiche: string,
    defaultModelId: string,
    autoEnhance: boolean,
    enhancementLevel: number,   // 0-100
    defaultDriveFolder: string,
    autoHashtags: boolean,
    defaultPostTime: "best" | "custom",
  },
  integrations: {
    googleDrive: { connected: boolean, lastSynced?: number },
    airtable: { connected: boolean, lastSynced?: number },
    telegram: { connected: boolean, botUsername?: string, lastSynced?: number },
    metaGraph: { connected: boolean },
  },
  billing: {
    plan: string,
    price: number,
    status: "active" | "cancelled" | "trialing",
    nextBillingDate: number,
    usage: {
      accounts: { used: number, limit: number },
      clipsThisMonth: { used: number, limit: number },
    },
    invoices: { month: string, date: number, amount: number, status: string, pdfUrl?: string }[],
  },
}
```

---

## OFM adaptations

| Reference | ISSO |
|---|---|
| "IGINFULL Platform" $19/mo | ISSO pricing (see business plan) |
| Connected Accounts = IG handles | Connected Accounts = OF handles |
| Meta Graph API integration | OF API integration (if available) |
| Telegram Bot: @NVTIMEBOT | ISSO Telegram Bot (rename) |
| "Best performing hours" for IG | "Best performing hours" for OF (different peak times) |
| Default Drive folder path | Same — Google Drive is part of ISSO workflow |

---

## Key design details to preserve

- `AnimatedToggle` — spring pill switch with `motion.span layout`
- Settings tab sidebar with `layoutId="settings-tab-indicator"` animated left border
- `AnimatePresence mode="wait"` for tab content transitions (slide left/right)
- Billing plan card: `billing-plan-card` CSS class (holographic gradient border)
- Connected status: `connected-glow` CSS class (breathing green dot animation)
- Enhancement level slider with label: Subtle / Moderate / Aggressive

---

## Open questions

- OPEN: What are ISSO's actual pricing tiers? (reference is $19/mo — need real ISSO pricing)
- OPEN: Does ISSO have a Telegram bot already? (@NVTIMEBOT is Alex's personal setup)
- OPEN: Is OF API actually available for direct integration? (OF has a very limited public API)
- ASSUMED: Google Drive integration is core to the workflow and stays.
