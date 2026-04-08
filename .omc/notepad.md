# Notepad
<!-- Auto-managed by OMC. Manual edits preserved in MANUAL section. -->

## Priority Context
<!-- ALWAYS loaded. Keep under 500 chars. Critical discoveries only. -->

## Working Memory
<!-- Session notes. Auto-pruned after 7 days. -->
### 2026-04-07 23:45
Refactor recon/creators/ files to ≤120 lines each.
Plan:
1. CreatorRow.tsx (319) → extract AvatarCell, HealthCell, ActionCell functions
2. CreatorBriefSection.tsx (209) → extract BodyContent.tsx + ScoreBar helper stays
3. CreatorDetailView.tsx (210) → CreatorDetailHeader.tsx + CreatorFeedDrawer.tsx + helpers
4. CreatorCard.tsx (188) → extract StatPills.tsx + ExternalLinkOverlay.tsx
5. CreatorStatusGrid.tsx (186) → extract CreatorStatusRow.tsx
6. LogDashboard.tsx (173) → extract MetricCards.tsx + QuickActions.tsx
7. CandidatesFilterBar (260) → clean RangeFilter (already extracted) + add helper functions
8. CandidateRow (265) → extract FrontFace, BackFace, handleApprove/Reject helpers
9. ApprovedRow (224) → main component clean-up
Skip: WeeklyDigestCard(154), TableToolbar(154), CreatorSpotlightCard(153), ViralAlertCard(138), EngagementBenchmarkCard(141), CreatorDetailSections(141), tableUtils(179)


## MANUAL
<!-- User content. Never auto-pruned. -->

