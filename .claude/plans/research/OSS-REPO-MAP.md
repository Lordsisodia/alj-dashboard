# Open Source Repo Map — Mapped to Feature List

*Source: Shaan's GitHub stars + research agents — 2026-04-13*

---

## HIGH-VALUE REFERENCE PROJECTS (steal patterns from these)

| Repo | Stars | Maps to Features | Use For |
|------|-------|-----------------|---------|
| **nocodb/nocodb** | 50k+ | E1-E5 (R&D Table), A15-A18 | Airtable replacement — table/kanban/gallery/form views. CORE reference for our R&D table + graph view |
| **teableio/teable** | ~10k | E1-E5 (R&D Table) | Another Airtable alt — Postgres-based, faster. Compare with NocoDB |
| **sanidhyy/duolingo-clone** | ~1k | M40-M50 (Gamification) | Streak UI, XP system, leaderboard, celebrations. Direct reference for model gamification |
| **adityaphasu/notion-clone** | ~2k | E1-E5 (R&D Table) | Notion-style blocks + database views. Reference for the graph view toggle |
| **SimCoderYoutube/InstagramClone** | ~1k | A10-A14 (Social Analytics), M20-M23 (Model Social) | IG feed/stories/reels UI patterns |

## VIDEO GENERATION / AI CONTENT

| Repo | Stars | Maps to Features | Use For |
|------|-------|-----------------|---------|
| **SamurAIGPT/AI-Youtube-Shorts-Generator** | 3,199 | E6-E10 (Ideas Lab), P1-P3 (Pipeline) | Video analysis with GPT-4 + FFmpeg + OpenCV — extract interesting sections, auto-crop. Reference for Gemini video analysis |
| **google-gemini/genai-processors** | 2,105 | E6-E10 (Ideas Lab), E16 (AI caption) | Parallel content processing with Gemini — directly relevant for batch AI analysis |
| **microsoft/content-generation-solution-accelerator** | 216 | P1-P16 (Content Pipeline) | Multi-agent content creation system — reference architecture |
| **SamurAIGPT/AI-Faceless-Video-Generator** | 409 | E6-E10 (Ideas Lab) | Script + voice + face generation — reference for AI content suggestions |
| **leamsigc/ShortsGenerator** | 301 | E6-E10 (Ideas Lab) | Vue-based local shorts creation — reference for editor workflow |
| **Dark2C/Viral-Faceless-Shorts-Generator** | 52 | E6-E10 (Ideas Lab) | Trending topics + AI scripts + TTS + FFmpeg — reference for trend-based content |
| **RianNegreiros/AiShortsVideosGenerator** | 51 | E6-E10 (Ideas Lab) | TypeScript + Next.js — closest to our stack |
| **SocAIty/face2face** | 140 | Future (face swap for content) | Face swap API — potential future feature |
| **Gourieff/ComfyUI-ReActor** | ~5k | Future (face swap) | ComfyUI face swap node |

## SOCIAL MEDIA SCRAPING / ANALYTICS

| Repo | Stars | Maps to Features | Use For |
|------|-------|-----------------|---------|
| **cporter202/social-media-scraping-apis** | 1,067 | A10-A14 (Social Analytics), I1-I3 (Integrations) | Curated API collection for IG, TikTok, YouTube, Twitter — reference for which APIs to use |
| **spacesdrive/twiligent** | 53 | A10-A14 (Social Analytics) | Local YouTube + IG analytics dashboard — reference for analytics UI |

## SOCIAL MEDIA AUTOMATION / BOTS

| Repo | Stars | Maps to Features | Use For |
|------|-------|-----------------|---------|
| **Agentfy-io/Agentfy** | 391 | A19-A24 (Content Scheduler), I1-I3 | Multi-platform workflow execution — reference for cross-platform posting |
| **cporter202/automate-for-growth** | 632 | A19-A24 (Scheduler), P1-P16 (Pipeline) | Multi-platform bulk posting + API integration guide |
| **somiibo/instagram-bot** | 139 | A10-A14 (Analytics scraping) | IG automation patterns — likes, follows, comments |
| **somiibo/tiktok-bot** | 274 | Future (TikTok analytics) | TikTok automation patterns |
| **somiibo/twitter-bot** | 77 | A10-A14 (Twitter analytics) | Twitter/X automation |
| **InstaPy/InstaPy** | ~16k | A10-A14 (IG automation) | Mature IG automation library — patterns for engagement |
| **shad712/Social-Media-Mass-Automation-Suite** | 36 | Reference only | Stealth automation patterns — study, don't deploy |
| **darkzOGx/youtube-automation-agent** | 132 | Future (YouTube) | Gemini-powered YouTube automation |
| **thearnavrustagi/marketmenow** | 97 | Future (outreach) | Outbound marketing automation |
| **Haileamlak/conca** | 10 | P1-P16 (Pipeline) | TypeScript autonomous content engine — small but relevant stack |

## ONLYFANS / ADULT PLATFORM TOOLS

| Repo | Stars | Maps to Features | TOS Risk | Use For |
|------|-------|-----------------|----------|---------|
| **UltimaHoarder/UltimaScraper** | 4,230 | M30-M33 (Earnings), I7-I8 | HIGH | OF/Fansly scraper — study data model, don't deploy |
| **datawhores/OF-Scraper** | 1,021 | M30-M33 (Earnings), I7-I8 | HIGH | Actively maintained OF scraper — study API patterns |
| **AAndyProgram/SCrawler** | 2,006 | M30-M33, A10-A14 | MEDIUM | Multi-platform media downloader (OF, IG, TikTok, etc.) |
| **UltimaHoarder/UltimaScraperAPI** | 68 | I7-I8 (OF/Fansly integration) | HIGH | OF/Fansly/LoyalFans API wrapper — study endpoints |
| **easychen/not-only-fans** | 403 | Reference only | LOW | Self-hosted OF clone — study data model and subscription logic |
| **skeetzo/onlysnarf** | 175 | I7-I8 | HIGH | OF automation (posting, scheduling) — study workflow |
| **zaradarz/OnlyFans-Notification-Robot** | 109 | N1-N6 (Notifications) | MEDIUM | OF notification patterns |
| **DATAHOARDERS/dynamic-rules** | 64 | I7-I8 | MEDIUM | OF dynamic rules — study for API understanding |
| **jfrazier-eth/of** | 29 | Reference only | HIGH | OF AI browser extension — study UX patterns |

## UI / CLONE REFERENCES

| Repo | Stars | Maps to Features | Use For |
|------|-------|-----------------|---------|
| **Davronov-Alimardon/canva-clone** | ~500 | Future (content editor) | Canvas-based editor patterns |
| **mckaywrigley/clarity-ai** | ~2k | E6-E10 (Ideas Lab) | AI chat interface — reference for AI suggestion UI |
| **adrianhajdin/figma_clone** | ~3k | Reference only | Collaborative design patterns |

---

## TOP PRIORITY REPOS TO DEEP-DIVE (ordered by impact — revised 2026-04-13)

1. **nocodb/nocodb** (61.9k stars) — R&D Table, Raw Content Queue, PTP table, permissions. Grid/kanban/gallery/form views directly copy-worthy.
2. **subzeroid/instagrapi** (5.9k stars) — CRITICAL. Only active library for IG private API (posting + analytics + scheduling). REST companion for Next.js integration. Backbone of content pipeline.
3. **teableio/teable** (21k stars) — TypeScript + Postgres Airtable alt. Closest to our stack. Updated Apr 2026. Linked-record patterns for R&D table.
4. **sanidhyy/duolingo-clone** (~1k stars) — Exact stack match (Next.js + shadcn + Tailwind + Drizzle + Zustand). Copy-paste for gamification: XP, streaks, leaderboard, celebrations.
5. **SamurAIGPT/AI-Youtube-Shorts-Generator** (3.2k stars) — Video analysis + auto-clip with GPT-4 + FFmpeg + OpenCV. Extract patterns for Gemini Ideas Lab (Python — patterns only).
6. **google-gemini/genai-processors** (2.1k stars) — Parallel content processing with Gemini. Directly relevant for batch AI analysis in Ideas Lab.
7. **cporter202/social-media-scraping-apis** (1k stars) — Curated API reference for IG, TikTok, YouTube, Twitter, FB scraping.
8. **UltimaHoarder/UltimaScraper** (4.2k stars) — OF data model study. TOS risk — study endpoints and data schema only.
9. **Agentfy-io/Agentfy** (391 stars) — Multi-platform workflow execution reference for cross-platform posting.
10. **datawhores/OF-Scraper** (1k stars) — OF API patterns, actively maintained into 2026.

### REMOVED FROM PREVIOUS LIST
- ~~InstaPy/InstaPy~~ — dead project, creator banned by Meta, no active maintenance
- ~~cporter202/automate-for-growth~~ — tutorial document, not a code library
- ~~spacesdrive/twiligent~~ — replaced by higher-impact entries
