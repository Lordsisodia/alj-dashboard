---
page: Finished Reels
route: /editor/finished
dashboard: editor
features: E17, E18, E19, E20, E21, E22, E23, E24, E25, E26
status: planned
---

# Finished Reels

**Title:** Finished Reels

## Features
- E17-E26: Upload, categorize, and submit completed edits

## Components

| Component | Notes |
|-----------|-------|
| `ReelUploader` | Upload + categorize (model, niche, category) |
| `AIReviewPanel` | Auto-generated caption, on-screen text extraction, title + description |
| `EditedReelCard` | Thumbnail + metadata + approval status badge |
| `EditTimeTracker` | Timer per edit |
| `ViralityScoreBadge` | AI-driven 0-99 score |
| `HookVariantCards` | 3 hook variants with hashtags |
| `VersionLabel` | V1/V2/V3 indicator |

## Data Sources
- Convex `reels`
- Google Gemini (AI review)
- Google Drive (media storage)

## Actions
- Upload and categorize reel
- Review AI-generated metadata
- Submit to PTP queue
