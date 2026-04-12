# Screen 06 — Approvals

**Route:** `/approvals`  
**File:** `src/app/approvals/page.tsx` (671 lines)

---

## What it does

The content review queue. Before anything goes live, it passes through this screen. VAs submit content (caption + hashtags + media), the admin reviews it, then approves, requests revision, or rejects. Called "PTP — Pre-Turned-Post · Client Review Portal" in the reference.

This is the **quality gate** before publishing.

---

## Layout

### Sticky top bar
- Page title: "Approvals" + subtitle
- Tab filter row: All / Pending / Approved / Revisions / Published (with active tab highlighted in pink)

### Stats row (4 cards)
- **Pending Review** — amber icon
- **Awaiting Client** — pink icon
- **Approved Today** — green icon
- **Published This Week** — purple icon

### Filter bar
- Account dropdown (All Accounts / @specific handles)
- Content type dropdown (All Types / Reel / Post / Story / Carousel)
- Date range (Last 30 days)
- Clear filters button (shown when filters active)
- Item count label (right-aligned)

### Card grid (1–4 cols responsive)

Each **ApprovalCard** shows:
- Thumbnail area (gradient + content type icon)
  - Content type badge (top-left): Reel / Post / Story / Carousel with icon
  - Account badge (top-right): @handle in account colour
  - Glassmorphism overlay on hover
- Card body:
  - Caption text (2-line clamp)
  - "By [VA name] · [Date submitted]"
  - Status badge (Pending / Approved / Needs Revision / Published)
  - Action buttons: **Approve** (pink) + **Refresh/Revision** (ghost)

Click any card → opens **Detail Modal**

---

## Detail Modal

Frosted glass backdrop with blur + noise overlay. Spring animation on open/close.

Modal content:
- Header: account icon, handle, status badge, content type + date
- Media preview (aspect-video placeholder)
- Caption (full text)
- Hashtags (pill tags)
- Revision comment textarea (shown when "Request Revision" clicked)
- Submitted by + date
- Action buttons:
  - **Approve & Publish** (gradient — primary action)
  - **Approve** (green — approve without publishing)
  - **Request Revision** (orange — expands textarea)
  - **Reject** (red)
- Success state: green confirmation banner after action, auto-closes after 1.2s

---

## Status flow

```
pending → approved → published
         ↓
      revision (sent back to VA)
         ↓
      pending (VA resubmits)
```

---

## Data needed (Convex)

```ts
// approvals table
{
  contentId?: string,          // linked content item
  modelId: string,
  accountHandle: string,
  contentType: "Reel" | "Post" | "Story" | "Carousel" | "Photo" | "Video",
  caption: string,
  hashtags: string[],
  mediaUrl?: string,           // preview URL
  thumbnailUrl?: string,
  submittedBy: string,         // team member name/id
  submittedAt: number,
  status: "pending" | "approved" | "revision" | "published",
  revisionNote?: string,       // feedback when requesting revision
  approvedBy?: string,
  approvedAt?: number,
  publishedAt?: number,
}

// Convex mutations:
// approvals.approve(id) → status = "approved"
// approvals.publish(id) → status = "published"
// approvals.requestRevision(id, note) → status = "revision"
// approvals.reject(id) → status = "revision" (or "rejected")

// Real-time query (Convex live):
// approvals.list(filters) → ApprovalItem[] (live updates as VAs submit)
```

---

## OFM adaptations

| Reference | ISSO |
|---|---|
| Content types: Reel, Post, Story, Carousel | Content types: Video, Photo, Bundle, PPV (OFM-specific) |
| "Submitted by VA Mikee / VA Yssa" | Same role structure — VA submits, admin approves |
| Caption + Hashtags | Caption + Tags (OFM uses different tagging) |
| "Approve & Publish" → publishes to IG | "Approve & Publish" → marks ready for OF scheduling |
| Account colours match IG handles | Account colours match OF model profiles |

---

## Key design details to preserve

- `AnimatePresence mode="popLayout"` on card grid — cards animate out when filtered
- Modal backdrop: `modal-orb-backdrop` CSS class (frosted glass orb effect)
- `modal-noise` CSS overlay on modal
- Status badge uses `motion.span` with `layout` prop — smoothly transitions colour on status change
- Tab active state uses `tab-glow-underline` CSS pseudo-element

---

## Open questions

- OPEN: Is "Approve & Publish" a direct API call to OnlyFans, or does it just mark the item as scheduled/ready?
- OPEN: Does the model (creator) have any visibility into this approval queue, or is it purely internal?
- OPEN: Should revision notes be sent to the VA as a notification (Telegram/email)?
- ASSUMED: Approval queue is internal — models don't see it.
