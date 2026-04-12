# Wireframe: Billings (`/agency/billings`)

**Features:** A68
**Accent:** `linear-gradient(135deg, #ff0069, #833ab4)`

---

## ASCII Wireframe (Desktop, 1440px)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ OUTER CANVAS                                                                    │
│  ┌──────────┐  ┌──────────────────────────────────────────────────────────────┐ │
│  │ SIDEBAR  │  │ CONTENT CARD                                                  │ │
│  │          │  │ ┌──────────────────────────────────────────────────────────┐ │ │
│  │          │  │ │ HEADER: [🏢] Billings  [Synced 2 min ago ●]  [Search]   │ │ │
│  │          │  │ │                         [📅 Apr 2026 ▾]  [Sync Sheets]   │ │ │
│  │          │  │ └──────────────────────────────────────────────────────────┘ │ │
│  │          │  │ ┌──────────────────────────────────────────────────────────┐ │ │
│  │          │  │ │ TABS: [● Summary] [Invoices] [Model Cuts] [Expenses]     │ │ │
│  │          │  │ │                                           [Add Filter ▾] │ │ │
│  │          │  │ └──────────────────────────────────────────────────────────┘ │ │
│  │          │  │ ┌──────────────────────────────────────────────────────────┐ │ │
│  │          │  │ │ STATUS STRIP                                              │ │ │
│  │          │  │ │ ● Google Sheets synced │ 14 invoices │ £24,800 total     │ │ │
│  │          │  │ └──────────────────────────────────────────────────────────┘ │ │
│  │          │  │                                                               │ │
│  │          │  │ ┌──────────────────────────────────────────────────────────┐ │ │
│  │          │  │ │ TAB: Summary                                              │ │ │
│  │          │  │ │                                                            │ │ │
│  │          │  │ │ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ │ │ │
│  │          │  │ │ │ Total In  │ │ Total Out │ │  Net      │ │ Pending   │ │ │ │
│  │          │  │ │ │ £24,800   │ │ £11,200   │ │ £13,600   │ │ £2,100    │ │ │ │
│  │          │  │ │ │ this month│ │ this month│ │ profit    │ │ 3 invoices│ │ │ │
│  │          │  │ │ └───────────┘ └───────────┘ └───────────┘ └───────────┘ │ │ │
│  │          │  │ │                                                            │ │ │
│  │          │  │ │ ── BILLING TABLE ──────────────────────────────────────── │ │ │
│  │          │  │ │ Date       Description           Amount   Status  Action  │ │ │
│  │          │  │ │ ────────── ──────────────────── ──────── ─────── ──────  │ │ │
│  │          │  │ │ Apr 13     Model payouts - April  £8,400  PAID    [View]  │ │ │
│  │          │  │ │ Apr 10     Platform subscriptions  £840  PAID    [View]  │ │ │
│  │          │  │ │ Apr 7      Staff salaries          £9,200 PAID    [View]  │ │ │
│  │          │  │ │ Apr 5      Ayrshare API             £120  PAID    [View]  │ │ │
│  │          │  │ │ Apr 2      Client invoice #041     £2,100 PENDING [Chase] │ │ │
│  │          │  │ │                                                            │ │ │
│  │          │  │ │ ── SHEETS EMBED (optional) ──────────────────────────────  │ │ │
│  │          │  │ │ ┌──────────────────────────────────────────────────────┐  │ │ │
│  │          │  │ │ │ [Embedded Google Sheets iframe / read-only view]      │  │ │ │
│  │          │  │ │ │   OR: "View in Google Sheets →" link if embed blocked │  │ │ │
│  │          │  │ │ └──────────────────────────────────────────────────────┘  │ │ │
│  │          │  │ └──────────────────────────────────────────────────────────┘ │ │
│  └──────────┘  └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Tree

```
BillingsFeaturePage
├── ContentPageShell
│   ├── header
│   │   ├── ProductIcon "agency"
│   │   ├── "Billings"
│   │   ├── SheetsSyncPill (● Synced 2 min ago)
│   │   ├── MonthPicker (Apr 2026 ▾)
│   │   └── ActionButton "Sync Sheets" (accentGradient pink)
│   ├── tabBar
│   │   ├── Tab "Summary" (active)
│   │   ├── Tab "Invoices"
│   │   ├── Tab "Model Cuts"
│   │   └── Tab "Expenses"
│   │   └── AddFilterPill (right)
│   └── content
│       ├── StatusStrip (sync status + summary stats)
│       └── AnimatePresence
│           ├── SummaryTab
│           │   ├── BillingSummaryRow (grid-cols-4)
│           │   │   ├── KPIDeltaTile "Total In"
│           │   │   ├── KPIDeltaTile "Total Out"
│           │   │   ├── KPIDeltaTile "Net"
│           │   │   └── KPIDeltaTile "Pending"
│           │   ├── BillingTable
│           │   │   └── BillingRow × N
│           │   └── SheetsEmbed (optional iframe or link)
│           ├── InvoicesTab
│           │   └── InvoiceTable (full invoice list)
│           ├── ModelCutsTab
│           │   └── ModelCutsTable (per-model earnings split)
│           └── ExpensesTab
│               └── ExpensesTable (outgoings breakdown)
```

---

## Key Components

### SheetsSyncPill
```tsx
<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium text-neutral-500"
     style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
  Synced {timeAgo(lastSync)}
</div>
```
Amber dot + "Syncing…" when fetch in flight. Red dot + "Sync failed" on error.

### StatusStrip
```tsx
<StatusStrip
  status={{ label: 'Google Sheets synced', active: true }}
  stats={[
    { icon: <FileText size={10} />, value: invoiceCount, label: 'invoices' },
    { icon: <TrendingUp size={10} />, value: '£24,800', label: 'total in' },
    { icon: <Clock size={10} />, value: pendingCount, label: 'pending' },
  ]}
/>
```

### BillingTable
```tsx
<table className="w-full">
  <thead>
    <tr className="text-[11px] font-medium text-neutral-500 border-b border-neutral-100">
      <th className="py-2 text-left">Date</th>
      <th className="text-left">Description</th>
      <th className="text-right">Amount</th>
      <th className="text-center">Status</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {records.map(r => <BillingRow key={r.id} record={r} />)}
  </tbody>
</table>
```

### BillingRow
```tsx
<tr className="border-b border-neutral-50 hover:bg-black/[0.02] transition-colors">
  <td className="py-3 text-xs text-neutral-400">{formatDate(r.date)}</td>
  <td className="text-sm text-neutral-700">{r.description}</td>
  <td className="text-sm font-semibold text-neutral-900 text-right">{r.amount}</td>
  <td className="text-center">
    <StatusBadge status={r.status} />   {/* PAID=green, PENDING=amber, OVERDUE=red */}
  </td>
  <td className="text-right">
    <button className="text-xs text-[#ff0069] hover:underline">{r.status === 'PENDING' ? 'Chase' : 'View'}</button>
  </td>
</tr>
```

### StatusBadge
```tsx
const config = {
  PAID: { bg: '#f0fdf4', text: '#16a34a', label: 'Paid' },
  PENDING: { bg: '#fffbeb', text: '#d97706', label: 'Pending' },
  OVERDUE: { bg: '#fef2f2', text: '#dc2626', label: 'Overdue' },
}
<span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ backgroundColor: config[status].bg, color: config[status].text }}>
  {config[status].label}
</span>
```

### SheetsEmbed
```tsx
// Attempt iframe embed; graceful fallback if blocked
<div className="rounded-xl overflow-hidden border border-neutral-100 mt-6">
  <iframe
    src={sheetsEmbedUrl}
    className="w-full h-64"
    onError={() => setEmbedFailed(true)}
  />
</div>
// Fallback:
<a href={sheetsUrl} target="_blank" className="text-sm text-[#ff0069] hover:underline flex items-center gap-1">
  <ExternalLink size={12} /> View in Google Sheets
</a>
```

---

## Interaction Spec

| Interaction | Behaviour |
|-------------|-----------|
| "Sync Sheets" | Triggers Sheets API fetch, shows loading spinner on SheetsSyncPill |
| Month picker | Changes date filter for all tabs |
| Tab switch | AnimatePresence slide transition |
| "Chase" button | Opens pre-filled email modal (TO: client, RE: invoice #) |
| "View" button | Opens BillingDetailDrawer (right slide-in panel) |
| Add Filter | Filter by: type (in/out), status, amount range |
| Row hover | `hover:bg-black/[0.02]` highlight |

---

## Reuse Instructions

- `KPIDeltaTile` — intelligence, drop in
- `StatusStrip` — design system §9, configure with billing stats
- `AddFilterPill` — design system §7a, drop in

**Data source:** Google Sheets API (A68). All amounts are pulled from Sheets, not Convex — Convex stores only sync metadata.

**Role guard:** Owner-only. 404 for all other roles.
