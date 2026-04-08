# Feed — Recon activity feed tab

The Feed tab. Owns the chronological activity stream surfaced inside the recon feature: new scrapes, enrichments, status changes, and viral alerts. It does NOT own the intelligence post feed (that lives in the `intelligence` feature).

---

## Component map

| File | Purpose |
|------|---------|
| `ReconFeedTab.tsx` | Top-level tab component. Composes the feed list, header, and any filters. |

---

## Data flow

`ReconFeedTab` reads recon activity events from Convex via the parent recon feature page (props in). No mutations are issued from this folder.

---

## Subfolder guide

| Folder | Contents |
|--------|---------|
| _none_ | Single-file folder; expand into subfolders if/when richer feed primitives land. |
