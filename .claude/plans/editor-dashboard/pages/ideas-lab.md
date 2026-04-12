---
page: Ideas Lab
route: /editor/ideas
dashboard: editor
features: E4, E5, E6, E7, E8, E9, E10, E11
status: planned
---

# Ideas Lab

**Title:** Ideas Lab

## Features
- E4-E11: AI-powered content idea generation

## Components

| Component | Notes |
|-----------|-------|
| `VideoUploader` | Drag-and-drop video input |
| `ModelNicheSelector` | Who + niche + theme toggles |
| `GeminiAnalysisPanel` | Frame-by-frame AI breakdown (reuse AiAnalysisPanel pattern) |
| `IdeaSuggestionCards` | 5-6 AI-generated ideas with hooks |
| `ThemePicker` | Western/Asian, Easter, Songkran, trending |
| `CapCutTipsPanel` | Contextual editing tips |
| `CapCutTemplateLibrary` | Templates by niche |
| `TrendFeed` | Real-time TikTok Creative Center trends |

## Data Sources
- Google Gemini API (video analysis)
- TikTok Creative Center (trend feed)
- Convex `toolAnalyses`

## Actions
- Upload video
- Run AI analysis
- Pick idea suggestions
- Save to R&D
