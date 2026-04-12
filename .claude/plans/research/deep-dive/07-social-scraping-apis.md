# Deep-Dive: Social Media Scraping APIs
**Date:** 2026-04-12 | **Source:** cporter202/social-media-scraping-apis (1.1k stars) + supplemental research
**Goal:** IG analytics + Twitter stats + TikTok data for agency dashboard

---

## 1. The Repo: cporter202/social-media-scraping-apis

- **Stars:** 1.1k | **Forks:** 282 | **Last Updated:** 2025-12-09
- **Content:** 3,268 curated social media scraping APIs and tools
- **Host:** Primarily Apify Actors (JavaScript/TypeScript-based)
- **Noted Use Cases:** Social analytics, influencer research, lead generation, content aggregation, engagement tracking, video/audio downloading

---

## 2. Platforms Covered

| Platform | Apify Actors Available | Unofficial / Open Source |
|---|---|---|
| **Instagram** | Yes (dozens) | instagram-private-api, mgp25/Instagram-API |
| **Twitter / X** | Yes | node-twitter-api-v2 (official API wrapper) |
| **TikTok** | Yes | tiktok-api-dl variants |
| **LinkedIn** | Yes | Limited open source |
| **YouTube** | Yes | yt-dlp (video/audio) |
| **Facebook** | Yes | Limited open source |
| **Pinterest** | Yes | Limited open source |
| **Reddit** | Yes | PRAW (Python), snoowrap (JS) |
| **Snapchat** | Yes | Very limited |
| **Telegram** | Yes | telegram-bot-sdk |
| **Spotify** | Yes | spotify-web-api-node |
| **SoundCloud** | Yes | soundcloud-api-wrapper |
| **Douyin** | Yes | — |

---

## 3. APIs / Tools by Platform

### 3a. Instagram

#### Apify Actors (primary source from the repo)
- **Instagram Followers Scraper** — free-ish, claims "no login needed," high speed
- **Instagram Scraper** — profiles, posts, comments, engagement metrics
- **Story Scraping** — available as advanced feature on paid actors
- **AI Influencer Analysis** — premium Apify add-on
- **Pricing:** $0.50 per 1,000 results (paid); some free actors with limits
- **Data Available:** followers, following, profile details, posts, comments, engagement metrics, location-tagged content, hashtag posts

#### Open Source / Unofficial
- **mgp25/Instagram-API** — PHP, deprecated due to Instagram ban waves (TOS risk: HIGH)
- **instagram-private-api (nicko170)** — Node.js, unofficial; active but HIGH ban risk
- **instagram-unfollowers** — Node.js tool for tracking unfollowers
- **Pricing:** Free (open source); risk is account bans, not money
- **Rate Limits:** Varies; unofficial APIs routinely hit 429/ban responses
- **TOS Risk:** VERY HIGH — Instagram actively sues and bans scrapers

### 3b. Twitter / X

#### Official API
- **node-twitter-api-v2** — Strongly typed Node.js client for Twitter API v1.1 and v2
  - Supports: user data, followers, timelines, tweet data, media upload, streaming API
  - Includes built-in rate limit handling and auto-paginator
  - Plugin: `@twitter-api-v2/plugin-rate-limit` for tracking limits
  - **Free Tier:** Twitter API Free (limited: 1,500 tweets/month read, 500 DM/month, 1 app/month write) — very restrictive for analytics
  - **Basic Paid:** $100/month — 10,000 tweets/month read, 50,000 DM/month, 3 apps/month write
  - **Pro/Enterprise:** Higher tiers available
  - **TOS Risk:** LOW (official API, but Musk-era instability is a concern)
  - **Repo:** PLhery/node-twitter-api-v2 (active maintenance)

#### Apify Actors (from the repo)
- Various Twitter scrapers on Apify covering: tweets, profiles, followers, trending
- Pricing: pay-per-result via Apify platform

### 3c. TikTok

#### Open Source / Unofficial
- **tiktok-api-dl (socbet)** — Node.js/TypeScript SDK for TikTok data
- **Various Apify Actors** — video downloads, user data, comments, hashtag scraping
- **Pricing:** Free (unofficial); pay-per-result on Apify
- **Data Available:** video metadata, user profiles, comments, hashtags, engagement counts
- **Rate Limits:** Unspecified for unofficial; Apify actors have platform-level limits
- **TOS Risk:** HIGH — TikTok actively blocks scraping; ByteDance legal action risk

#### Official
- TikTok for Developers — very limited API; data API requires partnership
- **No viable free official tier for analytics use cases**

---

## 4. Free vs Paid Breakdown

| Tool / Platform | Free Tier | Paid From | Notes |
|---|---|---|---|
| **Twitter API Free** | 1,500 tweets/mo | $100/mo (Basic) | Extremely limited for analytics |
| **node-twitter-api-v2** | Free (wraps official API) | N/A | Uses Twitter's own paid tiers |
| **Instagram Apify Actors** | Some free actors | ~$0.50/1K results | Most useful data is paid |
| **Instagram unofficial APIs** | Free (open source) | N/A | Ban risk = hidden cost |
| **TikTok Apify Actors** | Some free | ~$0.50–$2/1K | No official free analytics API |
| **TikTok unofficial SDKs** | Free | N/A | Ban risk is significant |
| **Reddit PRAW** | Free (official SDK, Python) | N/A | Good for Reddit analytics |
| **yt-dlp** | Completely free, open source | N/A | YouTube/Spotify audio/video |
| **LinkedIn Apify Actors** | Limited | ~$1/1K profiles | Heavy paywall |

### Best Free Options
1. **Twitter** → node-twitter-api-v2 + Twitter API Free tier (best official support)
2. **Reddit** → PRAW or snoowrap (completely free, good data)
3. **YouTube** → yt-dlp + unofficial APIs (fully free)
4. **TikTok** → Apify free actors (limited); no good free unofficial option
5. **Instagram** → No reliable free option; Apify free actors are fragile

---

## 5. Node.js / TypeScript SDKs

| Platform | SDK | Language | Stars | Status |
|---|---|---|---|---|
| Twitter/X | node-twitter-api-v2 | TypeScript/Node.js | High | Active |
| Instagram | instagram-private-api | Node.js | High | Moderate (ban risk) |
| TikTok | tiktok-api-dl | Node.js/TypeScript | Low-Moderate | Sporadic |
| Reddit | snoowrap | JavaScript | High | Active |
| Reddit | PRAW | Python | High | Active |
| Spotify | spotify-web-api-node | Node.js | High | Active |
| YouTube | googleapis (official) | Node.js | High | Active |
| Telegram | telegram-bot-sdk | PHP | High | Active |
| SoundCloud | soundcloud-api-wrapper | Node.js | Low | Sporadic |

**All tools in cporter202 repo are Apify Actors** (JavaScript/TypeScript runtime under the hood).

---

## 6. Rate Limits

| Platform | Limit | Notes |
|---|---|---|
| **Twitter API Free** | 1,500 tweets/month read | Near useless for analytics |
| **Twitter Basic ($100/mo)** | 10,000 tweets/month | Better but still limited |
| **Instagram unofficial** | Varies, typically <100 requests/hour | Frequent 429s and bans |
| **Instagram Apify actors** | Platform-level; compute unit based | Scales with $ spent |
| **TikTok unofficial** | Unstable; block-prone | No reliable rate |
| **TikTok Apify actors** | Compute unit based | Scales with $ spent |
| **Reddit PRAW** | 60 requests/minute (OAuth) | Reasonable for dashboards |
| **YouTube Data API** | 10,000 units/day (free) | Quota-based, scales |

---

## 7. Best Toolchain for Agency Dashboard (IG Analytics + Twitter Stats + TikTok)

### Recommended Stack

#### For Twitter Stats (Recommended)
- **Tool:** node-twitter-api-v2 (Node.js/TypeScript)
- **API:** Twitter API v2 (official)
- **Tier:** Start with Free tier; upgrade to Basic ($100/mo) if analytics needs grow
- **Rationale:** Official, stable, good TypeScript support, rate limit plugin available
- **TOS Risk:** LOW

#### For Instagram Analytics (Recommended)
- **Tool:** Apify Instagram Scraper actor (or similar from repo)
- **Approach:** Pay-per-result on Apify platform (~cents per scrape)
- **Data:** Followers, engagement, post performance, follower growth
- **Rationale:** Most reliable for IG data without risking account bans
- **TOS Risk:** MEDIUM (Apify absorbs some risk on your behalf)
- **Alternative (risky):** instagram-private-api Node.js package — HIGH ban risk

#### For TikTok Data (Recommended)
- **Tool:** Apify TikTok Scraper actor
- **Data:** Video views, engagement, trending content, hashtag analytics
- **Rationale:** No viable free or unofficial option; Apify is the practical middle ground
- **TOS Risk:** MEDIUM (through Apify proxy)
- **Note:** ByteDance aggressively blocks scraping; expect occasional failures

#### Supplemental: Free Add-ons
- **yt-dlp** — Free YouTube video/audio + metadata (for content benchmarking)
- **PRAW (Python) or snoowrap (JS)** — Free Reddit analytics (useful for competitor research)
- **Instagram Basic Display API** — Official, limited but free (requires Meta app approval)

---

## 8. TOS Risk Assessment

### HIGH RISK (avoid for production unless using official APIs)
- Instagram unofficial scraping (instagram-private-api, mgp25)
  - Instagram actively pursues legal action against scrapers
  - Account bans are common; business account bans are especially damaging
- TikTok unofficial scraping
  - ByteDance blocks aggressively; legal risk
  - IP-based bans

### MEDIUM RISK (acceptable with proxy/proxy service)
- Instagram via Apify (Apify absorbs some risk)
- TikTok via Apify
- Twitter via unofficial methods (not applicable since node-twitter-api-v2 uses official API)

### LOW RISK (safe for production)
- Twitter API v2 (official)
- YouTube Data API (official)
- Reddit via PRAW/snoowrap (uses official API)
- Spotify Web API (official)
- Meta Instagram Basic Display API (official, limited)

### Key Takeaway
> For an agency dashboard with IG analytics + Twitter stats + TikTok data, the safest and most maintainable stack is:
> - **Twitter:** Official API + node-twitter-api-v2
> - **Instagram:** Apify actor (paid) OR Meta Instagram Graph API (official, limited) + Apify for advanced needs
> - **TikTok:** Apify actor (paid) — no good official or free alternative
> Budget estimate: ~$20–$50/month for Apify compute units + $0–$100/month for Twitter API

---

## 9. Key Findings from cporter202 Repo Specifically

1. **Apify is the dominant platform** in this collection — essentially every tool in the 3,268-item list runs on Apify Actors (JS/TS)
2. **No single "best" tool** — selection is highly platform-specific and changes frequently as platforms update their defenses
3. **Pricing is fragmented** — most useful data is pay-per-result, not subscription. Expect $0.50–$2.00 per 1,000 items
4. **Free tier reality check** — free Instagram scraping without login is largely unreliable; free TikTok scraping barely exists
5. **Active community** — repo updated 2025-12-09, indicating ongoing curation
6. **Promotional skew** — repo includes "Vibe Coding with Chris" Skool community promotions; curate critically

---

## Sources

- [cporter202/social-media-scraping-apis](https://github.com/cporter202/social-media-scraping-apis) (1.1k stars)
- [PLhery/node-twitter-api-v2](https://github.com/PLhery/node-twitter-api-v2)
- [Apify Instagram Scraper](https://apify.com/apify/instagram-scraper)
- [mgp25/Instagram-API](https://github.com/mgp25/Instagram-API)
- [socbet/tiktok-api-dl](https://github.com/socbet/tiktok-api-dl)
- [RapidAPI Social Media APIs Collection](https://rapidapi.com/collection/social-media-apis)
