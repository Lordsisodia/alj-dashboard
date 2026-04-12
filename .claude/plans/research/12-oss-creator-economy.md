# Research: OSS & Existing Tools — Creator Economy / OFM Space

**Date:** 2026-04-12
**Agent:** agency.agency-dash
**Purpose:** Landscape audit of open-source and commercial tooling in the OFM/creator economy space. Informs feature gap analysis and build-vs-buy decisions for the isso-dashboard agency view.

---

## 1. OnlyFans API Wrappers

OnlyFans does not offer a public official API. All third-party tools rely on reverse-engineered private endpoints, session cookies, and auth tokens. This creates permanent TOS risk and fragility as endpoints change.

### OF-Scraper
- **Repo:** [datawhores/OF-Scraper](https://github.com/datawhores/OF-Scraper)
- **Stars:** ~1,000 | **License:** MIT | **Language:** Python
- **What it does:** CLI tool to download media from OnlyFans accounts (posts, messages, stories). Supports bulk like/unlike actions. Requires active subscription to the creator — cannot bypass paywalls.
- **TOS status:** Explicitly unauthorized. Fenix International (OF) does not endorse it. Account bans are a real risk.
- **Usability:** Active community on Discord; actively maintained through 2025 (v3.14.x). Primarily for personal archiving, not agency ops.
- **Feature overlap:** Zero overlap with agency dashboard — this is a consumer/downloader tool, not an agency management tool.

### UltimaScraper
- **Repo:** [UltimaHoarder/UltimaScraper](https://github.com/UltimaHoarder/UltimaScraper)
- **Stars:** ~4,200 | **License:** GPL-3.0 | **Language:** Python
- **What it does:** Multi-platform scraper covering OnlyFans, Fansly, LoyalFans. Downloads media, messages, stories. Has a modular API package (`ultima-scraper-api`, AGPL-3.0) for programmatic use.
- **TOS status:** Same as OF-Scraper — fully unauthorized. GPL-3.0 means any derivative must also be GPL.
- **Usability:** Most-starred OF scraper on GitHub. Active forks. The `ultima-scraper-api` PyPI package provides a Python SDK layer over the reverse-engineered endpoints.
- **Feature overlap:** Low. Useful only if building a content vault ingestion pipeline; not suitable for agency management UI.

### OnlySnarf
- **Repo:** [skeetzo/onlysnarf](https://github.com/skeetzo/onlysnarf)
- **Stars:** ~200 | **License:** MIT | **Language:** Python
- **What it does:** Automation tool for *uploading* content to OnlyFans via Selenium/browser automation (not API). Supports scheduling posts, setting prices, sending mass messages.
- **TOS status:** Unauthorized automation. Browser fingerprinting detection by OF is a known risk.
- **Usability:** Less actively maintained. Fragile due to UI scraping approach — breaks when OF changes their frontend.
- **Feature overlap:** Medium. Covers scheduling and mass messaging — both features we would build natively with proper UX.

### onlyfClient
- **Repo:** [Barklim/onlyfClient](https://github.com/Barklim/onlyfClient)
- **Stars:** Low (single digits observed) | **License:** Not clearly documented
- **What it does:** OnlyFans autochat and activity tracker aimed at models and web agencies. Closest open-source match to an "agency dashboard" concept on GitHub.
- **TOS status:** Unauthorized. Uses OF's private endpoints.
- **Usability:** Very low community traction. Not production-ready.
- **Feature overlap:** High conceptual overlap (agency tracker, chatter management), but not usable as a dependency.

### NotOnlyFans (Self-Hosted Platform Clone)
- **Repo:** [easychen/not-only-fans](https://github.com/easychen/not-only-fans)
- **Stars:** ~800 | **License:** MIT | **Language:** PHP/Node
- **What it does:** Self-hosted subscription content platform using ETH cryptocurrency for payments. Essentially an OF clone you run yourself.
- **TOS status:** N/A — independent platform, not a scraper.
- **Usability:** Interesting for building an owned platform. Not relevant to managing OF accounts.
- **Feature overlap:** None for agency management of existing OF accounts.

---

## 2. OFM Agency Management SaaS (Commercial)

All major OFM agency management tools are closed-source SaaS. No meaningful open-source competitor exists in this tier.

### Infloww
- **URL:** infloww.com
- **Pricing:** From ~$40/month (scales with earnings)
- **What it does:** Fan CRM with Smart Lists (auto-segmented fan lists by spend/engagement), Messages Pro (chat system claimed 40% faster than rivals), Vault Pro (media management with bulk upload and performance tracking), team management, chatter analytics.
- **Legality:** Uses OF's private API via authorized browser extension model. Operates in a grey zone — OF has not officially banned these tools but does not endorse them either.
- **Usability:** Most popular mid-market option. Good UX, solid chatter workflow. Weak on analytics/reporting.
- **Feature overlap with isso-dashboard:** Direct overlap on chatter management, fan CRM, vault management, shift tracking.

### Supercreator
- **URL:** supercreator.app
- **Pricing:** Free up to 10 accounts; $68/month flat for agencies
- **What it does:** AI-first platform. Fans Copilot CRM with AI-generated chat scripts and fan profiling. Auto captions, post scheduling, fan behavior-based upsell recommendations, conversation AI. Best-in-class AI chatter automation.
- **Legality:** Same grey zone as Infloww.
- **Usability:** Best free tier in the market. AI chat quality is the strongest differentiator. Occasional reports of AI sounding mechanical on long threads.
- **Feature overlap:** AI chatter, fan segmentation, scheduling, multi-account management.

### CreatorHero
- **URL:** creatorhero.com
- **Pricing:** From ~$95/month
- **What it does:** Enterprise-grade agency tooling. Shift Management (assign chatters to shifts, track performance per shift), Chatter Tracking (revenue attribution per chatter), hierarchical creator management, multi-account dashboards, team onboarding workflows. Best team management layer in the market.
- **Legality:** Same grey zone.
- **Usability:** Steeper learning curve. Built for agencies operating at scale (10+ creators). Overkill for small operations.
- **Feature overlap:** Direct overlap on shift management, chatter tracking, P&L-per-creator, team access controls.

### OFManager
- **URL:** ofmanager.com
- **Pricing:** Not publicly listed
- **What it does:** Multi-account dashboard, mass messaging, fan CRM, chatter analytics, tracking links. Desktop app (Mac and Windows). Agency-focused.
- **Legality:** Same grey zone.
- **Usability:** Downloadable desktop app — unusual in this space. Lower web presence than competitors in 2025/2026 searches, suggesting declining market share.
- **Feature overlap:** Mass messaging, fan CRM, multi-account management.

### OnlyMonster
- **URL:** onlymonster.ai
- **Pricing:** Not publicly listed
- **What it does:** AI-led automation, bulk content uploads, centralized dashboards for multiple creators, advanced analytics, content scheduling, multi-user permission system.
- **Legality:** Same grey zone.
- **Usability:** Positioned as AI-first similar to Supercreator. Less community data available.
- **Feature overlap:** Content scheduling, analytics, permissions.

### FansMetric
- **URL:** fansmetric.com
- **Pricing:** Positioned as ~80% cheaper than Infloww/CreatorHero/Supercreator
- **What it does:** Analytics dashboard, chatting software, marketing tools, automation. Auto-generates fan lists segmented by total spend. Enterprise-grade encryption, role-based permissions, no password storage (uses token-based access).
- **Legality:** Same grey zone.
- **Usability:** Strong value proposition on price. Newer entrant with growing traction.
- **Feature overlap:** Revenue tracking per chatter, fan segmentation, team access.

### Fans-CRM
- **URL:** fans-crm.com
- **Pricing:** Free (premium features at no cost)
- **What it does:** Fan profiling, automated messaging (welcome sequences, re-engagement campaigns), multi-account management, team collaboration, affiliate tracking.
- **Legality:** Same grey zone.
- **Usability:** Only fully free option in this space. Community-focused. Good for smaller agencies or individual creators.
- **Feature overlap:** Fan CRM, automated messaging, multi-account.

---

## 3. Creator Economy Dashboards & Multi-Platform Aggregators

No significant open-source multi-platform creator earnings aggregator exists. The market is fully owned by paid SaaS.

### Commercial options (non-OFM specific)
- **Sprout Social** — Multi-platform analytics. $249–$739/month. Enterprise focus.
- **Metricool** — Best for Instagram/TikTok. $25–$79/month. No adult platform integrations.
- **GRIN** — Influencer/creator management with custom report builder. Enterprise pricing.
- **Buffer / Later / Hootsuite** — Publishing-focused with analytics. No adult platform support.

**Key gap:** None of these touch OnlyFans, Fansly, or similar platforms. The creator economy SaaS stack treats adult platforms as out-of-scope. This is a genuine moat for purpose-built OFM tooling.

---

## 4. Fan CRM Tools

All dedicated fan CRM tools are closed-source SaaS (covered above in section 2). Key patterns observed:

| Feature | Standard in market? |
|---|---|
| Fan spend segmentation (Whales, Mid, Low) | Yes — all major tools |
| Automated welcome/re-engagement messages | Yes — all major tools |
| Chatter revenue attribution | Yes — CreatorHero, FansMetric, Infloww |
| AI-generated chat scripts | Supercreator (best), OnlyMonster |
| Multi-account without sharing passwords | Yes — token-based, standard practice |
| Shift-based chatter scheduling | CreatorHero (best-in-class) |
| Expired subscriber re-engagement | Yes — most tools |

**Open source:** None. This is a clear market gap if an open-source option were built.

---

## 5. Content Vault / Digital Asset Management

### Immich
- **Repo:** [immich-app/immich](https://github.com/immich-app/immich)
- **Stars:** ~98,000 | **License:** AGPL-3.0 | **Language:** TypeScript (NestJS + SvelteKit) + Flutter
- **What it does:** Self-hosted Google Photos alternative. Mobile-first backup with AI search (CLIP embeddings for freeform semantic search), face recognition, non-destructive editing, albums, sharing. REST API available.
- **NSFW handling:** Community has requested automatic NSFW detection and hidden vault feature; ML-based detection implemented but auto-hide is not default. No pin-locked private vault yet (discussed but scoped out by maintainers).
- **Usability:** Fastest-growing self-hosted project on GitHub. Actively maintained, frequent releases. Best mobile experience in self-hosted DAM space.
- **Relevance for OFM:** Could serve as a self-hosted content vault backend for agencies wanting to own their media storage. AGPL-3.0 means any SaaS deployment must open-source modifications.
- **Feature overlap:** Content organization, search, backup — but not OFM-specific (no pricing metadata, no platform publishing, no performance tracking).

### PhotoPrism
- **Repo:** [photoprism/photoprism](https://github.com/photoprism/photoprism)
- **Stars:** ~39,200 | **License:** AGPL-3.0 | **Language:** Go + TypeScript
- **What it does:** AI-powered photo management with RAW support, geo-tagging, face recognition, automatic NSFW detection (`PHOTOPRISM_DETECT_NSFW=true` Docker env var), content tagging, Places 3D Earth view. Ollama/OpenAI integration for caption generation (added Nov 2025).
- **NSFW handling:** More mature than Immich. NSFW detection is a first-class feature — can block or auto-hide flagged uploads. Configurable per deployment.
- **Usability:** More stable than Immich for single-user/photographer use cases. Better RAW support. Steeper setup. Less active mobile app story.
- **Relevance for OFM:** Better NSFW-awareness makes it more suitable as a content vault for adult content agencies. Self-funded and independent — no VC pressure to change direction.
- **Feature overlap:** Same as Immich — DAM only, no OFM-specific metadata or platform integration.

**Build vs. adopt verdict:** Neither Immich nor PhotoPrism maps to OFM content vault needs out-of-the-box. A custom vault (content library + pricing + platform tagging) is the right call, possibly with Immich as a backend for raw storage if self-hosting is desired.

---

## 6. NSFW Content Moderation Libraries

### NudeNet
- **Repo:** [notAI-tech/NudeNet](https://github.com/notAI-tech/NudeNet)
- **Stars:** ~2,300 | **License:** GPL-3.0 (repo) / MIT (PyPI package) — check carefully per use case
- **What it does:** ONNX-based nudity detection and censoring. Two modes: `classify` (NSFW/SFW binary) and `detect` (bounding boxes with 18+ labels: `FEMALE_BREAST_EXPOSED`, `BUTTOCKS_EXPOSED`, `MALE_GENITALIA_EXPOSED`, etc.). Runs on CPU via ONNX runtime. Models: `320n` (fast, included) and `640m` (higher accuracy, downloadable).
- **Usability:** Current best OSS option for nudity detection. Actively used in PhotoPrism and other self-hosted projects. Latest model release: v2.0.9 (2021) — model is stable/mature, not stale.
- **Relevance:** Direct use case for content moderation before publishing, auto-tagging content in vault, or compliance screening.

### SafeVision
- **Repo:** [im-syn/SafeVision](https://github.com/im-syn/SafeVision)
- **Stars:** Low | **License:** Not confirmed | **Language:** Python
- **What it does:** Full moderation suite — images, videos, live streams, camera feeds. CLI + GUI + REST API. Real-time processing, 18+ detection categories, batch processing, alert system. Built on ONNX deep learning models.
- **Usability:** More recent (2025), more complete than NudeNet for video/live use cases. Less community validation.
- **Relevance:** If video content moderation is needed (live stream capture, video vault screening).

### nsfw-detector (PyPI)
- **Package:** [nsfw-detector](https://pypi.org/project/nsfw-detector/)
- **Stars:** N/A (PyPI only) | **License:** Not confirmed | **Language:** Python
- **Last release:** December 2021 — effectively unmaintained.
- **Relevance:** Low — prefer NudeNet.

### nude.py
- **Repo:** [hhatto/nude.py](https://github.com/hhatto/nude.py)
- **Stars:** ~900 | **License:** MIT | **Language:** Python
- **What it does:** Lightweight heuristic nudity detection (skin tone analysis, not deep learning). Legacy approach — lower accuracy than ML-based tools.
- **Relevance:** Low — superseded by NudeNet for accuracy.

---

## 7. Curated Resource Lists

### awesome-ofm-tools
- **Repo:** [ofmtools/awesome-ofm-tools](https://github.com/ofmtools/awesome-ofm-tools)
- **Stars:** Low | **License:** Educational purposes only disclaimer
- **What it does:** Curated list of OFM agency tools — anti-detect browsers (Dolphin{anty}, AdsPower, GoLogin), residential proxies (Soax), banking solutions, contracts. Companion to ofm-tools.com.
- **Relevance:** Good reference for the operational stack an OFM agency runs (multi-account browser isolation, proxy infrastructure). Not directly buildable software.

---

## 8. Feature Gap Summary (vs. isso-dashboard Agency View)

| Capability | OSS option? | Best commercial? | Build in isso? |
|---|---|---|---|
| Fan CRM / segmentation | None | CreatorHero, Infloww | Yes — core feature |
| Chatter shift management | None | CreatorHero | Yes — core feature |
| Revenue per chatter tracking | None | FansMetric, CreatorHero | Yes — core feature |
| Multi-creator P&L dashboard | None | All major SaaS | Yes — core feature |
| Content vault / media library | Immich, PhotoPrism | Infloww Vault Pro | Yes — custom, simpler |
| NSFW content screening | NudeNet (OSS) | Commercial APIs | Adopt NudeNet |
| Mass messaging / automation | OnlySnarf (fragile) | Infloww, Supercreator | Scope separately |
| AI chat scripts | None OSS | Supercreator | Future phase |
| Multi-platform earnings aggregation | None | None (gap in market) | Future phase |
| Content scheduling | OnlySnarf (fragile) | Supercreator, OFManager | Yes — basic version |

---

## 9. Key Takeaways

1. **No viable OSS competitor to commercial OFM SaaS exists.** onlyfClient is the closest but has near-zero traction and is not production-ready. The space is fully owned by proprietary tools.

2. **All tools operate in an OF TOS grey zone.** No tool has official OF API access. Risk level: OF could break integrations at any time. Our dashboard should architect around this by treating OF data as pull-based with graceful degradation rather than tight coupling.

3. **Commercial SaaS feature set is well-defined.** CreatorHero + FansMetric together cover the full feature surface. Our dashboard should match this baseline: shift management, chatter tracking, fan segmentation, multi-creator P&L, role-based access.

4. **NudeNet is the right OSS pick for content moderation.** Mature, ONNX-based, 18-label detection. Use for vault auto-tagging and pre-publish screening. Note GPL-3.0 license on repo (MIT on PyPI) — verify licensing before embedding.

5. **Immich/PhotoPrism are too general for OFM content vault.** Best used as raw storage backends if self-hosting is desired. Our content vault needs OFM-specific metadata (price points, platform tags, revenue performance per piece).

6. **Multi-platform earnings aggregation is an open market gap.** No OSS or SaaS tool aggregates OF + Fansly + LoyalFans + other platforms into a single P&L view. This is a genuine differentiation opportunity.

---

## Sources

- [github.com/datawhores/OF-Scraper](https://github.com/datawhores/OF-Scraper)
- [github.com/UltimaHoarder/UltimaScraper](https://github.com/UltimaHoarder/UltimaScraper)
- [github.com/skeetzo/onlysnarf](https://github.com/skeetzo/onlysnarf)
- [github.com/Barklim/onlyfClient](https://github.com/Barklim/onlyfClient)
- [github.com/easychen/not-only-fans](https://github.com/easychen/not-only-fans)
- [github.com/notAI-tech/NudeNet](https://github.com/notAI-tech/NudeNet)
- [github.com/im-syn/SafeVision](https://github.com/im-syn/SafeVision)
- [github.com/hhatto/nude.py](https://github.com/hhatto/nude.py)
- [github.com/immich-app/immich](https://github.com/immich-app/immich)
- [github.com/photoprism/photoprism](https://github.com/photoprism/photoprism)
- [github.com/ofmtools/awesome-ofm-tools](https://github.com/ofmtools/awesome-ofm-tools)
- [infloww.com](https://infloww.com)
- [supercreator.app](https://www.supercreator.app)
- [creatorhero.com](https://www.creatorhero.com)
- [ofmanager.com](https://www.ofmanager.com)
- [fansmetric.com](https://fansmetric.com)
- [fans-crm.com](https://fans-crm.com)
- [onlymonster.ai](https://onlymonster.ai)
- [blog.nimbusreach.io — OFM CRM comparison](https://blog.nimbusreach.io/onlyfans-crm-tool-comparison-infloww-vs-creator-hero-vs-supercreator/)
- [ofm-tools.com](https://ofm-tools.com)
