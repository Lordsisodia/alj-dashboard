---
page: PTP Approval
route: /agency/ptp
dashboard: agency
features: A35, A36, A37, A38, A39, A40, A41, A42, A43, A44, A45
status: planned
---

# PTP Approval

**Title:** Post-to-Publish Approval

## Features
- A35-A45: Full post-to-publish approval workflow

## Components

| Component | Notes |
|-----------|-------|
| `ModelSelector` | Shared |
| `NicheFilter` | Shared — filter by niche |
| `ReelApprovalCard` | Thumbnail + metadata + approve/reject buttons |
| `VersionComparison` | V1/V2 side-by-side viewer |
| `BatchApprovalBar` | Floating bar for bulk approve/reject (reuse from content-gen QueueFeaturePage) |
| `ScheduleDatePopup` | Recommended date on approve |
| `FrameAnnotation` | Click-on-frame comment tool |
| `ApprovalSLAIndicator` | Time-in-queue display |
| `DelegationSettings` | Owner assigns approval rights to managers |

## Data Sources
- Convex `reels`, `approvals`

## Actions
- Approve / reject reels
- Annotate on frame
- Batch approve/reject
- Delegate approval rights
- Schedule on approve

## Role Visibility
- Owner: Approve/reject
- Manager: Approve (delegated)
- Worker: View only
