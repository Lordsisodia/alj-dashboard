# Detail — Candidate detail panel

Right-side drawer that opens when clicking a candidate card in the Kanban board. Shows outlier stats, AI verdict, bio, source, and Approve/Reject actions.

---

## DetailPanel

**Props:**
```ts
candidate: Candidate
onClose: () => void
onDecision: (id: number, status: CandidateStatus) => void
```

**Features:**
- ORACLE AI verdict (HIRE / WATCH / PASS) — fetched from `/api/recon/verdict` on open
- Outlier ratio hero block with colour coding
- Stats grid: Followers, Eng. Rate, Posts/Wk
- Bio text
- Source attribution (suggestedBy)
- Enrich button — pulls real Apify Instagram data, writes back to Convex
- Approve → calls `api.trackedAccounts.approveCandidate`
- Reject → calls `onDecision(id, 'rejected')`
- View on Instagram link (shown when already tracked)

**Portal:** rendered via `createPortal` to `document.body` to escape stacking contexts.

**Key path:** `../../creators/discovery/discoveryUtils` for `fmtViews`.
