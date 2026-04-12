# Deep Dive: OF-Scraper by datawhores

**Research Date:** 2026-04-12
**Project:** [github.com/datawhores/OF-Scraper](https://github.com/datawhores/OF-Scraper)
**Stars:** ~1,000 | **Forks:** 92 | **Releases:** 2,340 | **Commits:** 5,306
**Language:** Python 98.2% | **License:** MIT

---

## 1. Project Overview

OF-Scraper is a **completely redesigned fork, reimagined from scratch** based on the original `onlyfans-scraper` (DigitalCriminals' script). It is a command-line tool for downloading media from OnlyFans with bulk automation capabilities (liking/unliking posts, daemon mode for scheduled scraping).

It is not affiliated with OnlyFans. It **cannot bypass paywalls** and **requires an active subscription** to any model targeted.

---

## 2. Auth Method

OF-Scraper uses **session-cookie-based authentication** via a manually created `auth.json` file. No username/password login — instead it extracts browser session tokens.

### auth.json Structure

```json
{
  "auth": {
    "sess":     "<session cookie value>",
    "auth_id":  "<account ID>",
    "auth_uniq_": "<unique auth identifier (only if 2FA enabled)>",
    "user_agent": "<browser User-Agent string>",
    "x-bc":      "<custom bearer token header>"
  }
}
```

### Three Auth Approaches

| Method | Description |
|--------|-------------|
| **Cookie Helper (Recommended)** | Install [M-rcus Cookie Helper](https://github.com/M-rcus/Cookie-Helper) browser extension, extract cookies from OnlyFans, paste into `auth.json` |
| **Browser DevTools** | Open DevTools → Network tab → XHR → find "init" request → copy Cookie, User-Agent, x-bc headers manually |
| **Interactive Prompt** | Run `ofscraper` with no `auth.json` present; program generates the file and prompts for each value sequentially |

### Auth Notes
- `auth_uid_` only appears for accounts with **2FA enabled**
- Migration from DigitalCriminals' script is supported — auth info transfers directly
- The session cookie approach means **no OAuth or API key** is used; the tool simulates a browser session

---

## 3. Data Types Pulled

### Core Content Types

| Type | CLI Flag | Notes |
|------|----------|-------|
| **Posts** (timeline) | `--posts timeline` | Standard feed posts |
| **Pinned Posts** | `--posts pinned` | |
| **Archived Posts** | `--posts archived` | |
| **Stories** | `--posts stories` | Ephemeral content |
| **Highlights** | `--posts highlights` | Story highlights |
| **Messages / Chats** | `--posts messages` | Direct messages |
| **Labels** | `--posts labels` | Content organized by label/tag |
| **All** | `--posts all` | Everything above |
| **Paid Purchases** | `--scrape-paid` | Purchased content from deleted models |

### Media Types

| Type | Filter Flag |
|------|-------------|
| Images | `--mediatypes Images` |
| Videos | `--mediatypes Videos` |
| Audio | `--mediatypes Audios` |
| Text | `--mediatypes Text` |

### Bot Actions (Non-Download)

| Action | CLI Flag |
|--------|----------|
| Like posts | `--action like` |
| Unlike posts | `--action unlike` |
| Download | `--action download` |
| Combined | `--action like,download` |

Target areas can be narrowed: `--like-area pinned --download-area all`

---

## 4. JSON Schemas

OF-Scraper uses a **SQLite database** for metadata tracking (with `cache-mode: json` or `null` as alternatives). The schema is published as JSON Schema (Draft-07).

### Database Schema (10 Tables)

**Posts**
```json
{
  "id":        "integer (primary key)",
  "model_id":  "integer",
  "created_at": "string (date-time)",
  "opened":    "boolean",
  "stream":    "boolean",
  "pinned":    "boolean",
  "archived":  "boolean",
  "paid":      "integer (0/1)",
  "price":     "integer",
  "text":      "string",
  "post_id":   "integer"
}
```

**Medias**
```json
{
  "id":        "integer (primary key)",
  "model_id":  "integer",
  "hash":      "string",
  "unlocked":  "boolean",
  "duration":  "string",
  "posted_at": "string (date-time)",
  "created_at": "string (date-time)",
  "downloaded":"boolean",
  "linked":    "boolean",
  "preview":   "integer",
  "media_type":"string (image/video/audio)",
  "api_type":  "string",
  "size":      "integer (bytes)",
  "filename":  "string",
  "directory": "string",
  "link":      "string (URL)",
  "post_id":   "integer",
  "media_id":  "integer"
}
```

**Messages**
```json
{
  "id":        "integer (primary key)",
  "model_id":  "integer",
  "user_id":   "integer",
  "created_at": "string (date-time)",
  "archived":  "boolean",
  "paid":      "boolean",
  "price":     "integer",
  "text":      "string",
  "post_id":   "integer"
}
```

**Stories**
```json
{
  "id":        "integer (primary key)",
  "model_id":  "integer",
  "created_at": "string (date-time)",
  "archived":  "boolean",
  "paid":      "integer",
  "price":     "integer",
  "text":      "string",
  "post_id":   "integer"
}
```

**Labels**
```json
{
  "id":       "integer (primary key)",
  "label_id": "integer",
  "name":     "string",
  "type":     "string",
  "post_id":  "integer",
  "model_id": "integer"
}
```

**Models** / **Profiles** / **Products** / **Others** / **Schema_flags** — auxiliary tables for relationships and config flags.

### File Naming Placeholders

Dynamic filenames via `dir_format` and `file_format` in `config.json`:
- `{model_username}`, `{model_id}`, `{post_id}`, `{media_id}`
- `{mediatype}`, `{responsetype}`, `{date}`, `{text}`
- `{filename}`, `{ext}`, `{quality}`, `{value}`
- `{current_price}`, `{configPath}`, `{config}`, `{args}`

### Config Structure (config.json)

```json
{
  "config": {
    "main_profile":     "string",
    "metadata":         "string (path)",
    "discord":         "string (webhook)",
    "file_options": {
      "save_location": "string",
      "dir_format":    "string",
      "file_format":   "string",
      "date":          "string",
      "textlength":    "number",
      "truncation_default": "boolean"
    },
    "download_options": {
      "file_size_limit": "number",
      "file_size_min":   "number",
      "filter":          ["Images", "Audios", "Videos"],
      "auto_resume":     "boolean",
      "system_free_min":  "number"
    },
    "binary_options": {
      "mp4decrypt": "string",
      "ffmpeg":      "string"
    },
    "cdm_options": {
      "private-key":  "string",
      "client-id":    "string",
      "key-mode-default": "manual"
    },
    "performance_options": {
      "download-sems": "number",
      "threads":       "number"
    },
    "advanced_options": {
      "backend":     "aio | httpx",
      "downloadbars":"boolean",
      "cache-mode":  "sqlite | json | null",
      "ssl_verify":  "custom | default | false"
    }
  }
}
```

---

## 5. Comparison: OF-Scraper vs. UltimaScraper

| Dimension | OF-Scraper (datawhores) | UltimaScraper (UltimaSoftware) |
|-----------|------------------------|-------------------------------|
| **Stars** | ~1,000 | ~5,900+ |
| **Language** | Python 98% | Python / .NET (separate repos) |
| **Architecture** | Redesigned from scratch, modern Python async | Original lineage, broader platform support |
| **Auth** | Cookie-based (auth.json) | Similar cookie-based |
| **Data Coverage** | Posts, stories, messages, labels, highlights | Posts, messages, stories, payments, subscriptions |
| **Earnings Data** | No (no direct earnings API) | Yes (dedicated earnings/payments endpoints) |
| **JSON Export** | SQLite metadata DB + file metadata | Native JSON export per model |
| **Config** | JSON config file + CLI args | GUI + config files |
| **Maintenance** | Very active (2,340 releases, 5,306 commits) | Active |
| **Platforms** | OnlyFans only | OnlyFans + Fansly + Patreon + ManyVids + etc. |
| **Docker** | Yes (`ghcr.io/datawhores/of-scraper`) | Yes |
| **Scripting Hooks** | Yes (post_download_script, naming_script, etc.) | Limited |

### Key Takeaways
- **OF-Scraper** is the more **focused OnlyFans-only tool** with a modern Python rewrite and extensive scripting hooks
- **UltimaScraper** has broader multi-platform support and explicit earnings/payments scraping, but lower specificity to OnlyFans
- OF-Scraper's metadata DB approach enables **deduplication, incremental scraping, and content check modes**
- Both share the same fundamental auth pattern (browser cookie extraction)

---

## 6. Active Maintenance

OF-Scraper is **very actively maintained**:
- **2,340 releases** (latest: 3.14.x)
- **5,306 commits** across the repo
- **Stable + dev/pre-release branches** available
- Active Discord community for support
- GitHub Issues actively managed (41 open)
- Official documentation at `of-scraper.gitbook.io/of-scraper`
- Binary releases for Windows, Linux, macOS (no Python required)
- PyPI distribution via `uv tool install ofscraper`

---

## 7. Terms of Service Risks

### OnlyFans TOS Violations

The README explicitly states:
> "This tool is not affiliated, associated, or partnered with OnlyFans in any way."

Key risk factors:
1. **Account bans** — OnlyFans actively detects and bans accounts using automated scraping tools. Cookie-based auth means the account itself is flagged if the session is used for automated requests.
2. **IP rate limiting** — High-volume scraping triggers OnlyFans' anti-bot protections. OF-Scraper has `--skip-timed`, `--before`, `--after` filters and performance tuning (`download-sems`, `threads`) to manage this, but cannot eliminate risk.
3. **No paywall bypass** — OF-Scraper explicitly cannot bypass paid content. Subscriptions are always required.
4. **Legal gray area** — Scraping behind a paywall may violate the Computer Fraud and Abuse Act (US) and similar laws. Content creators' rights are also implicated.
5. **Data handling** — Downloaded content is subject to redistribution risks. Metadata and media stored locally increase exposure surface.

### Mitigation Patterns (from docs)
- Use **daemon mode with long intervals** (`--daemon 60+`) to reduce detection
- Set `download-sems: 1` to throttle requests
- Use **rotating proxies** (not natively supported; external wrapper needed)
- Never scrape anonymous/free accounts — all require auth

---

## 8. Patterns for Building OF Analytics

For a dashboard project targeting model/creator analytics, OF-Scraper provides these useful patterns:

### Data Pipeline Architecture
```
OF-Scraper (auth.json) → SQLite metadata DB
                         → local file storage (media)
                         → JSON/script hooks (external analytics)
```

### Analytics-Worthy Data Points

| Data Point | Source Table | Use Case |
|-----------|-------------|----------|
| Post frequency | `Posts.created_at` | Engagement cadence |
| Media type mix | `Medias.media_type` | Content strategy |
| Price sensitivity | `Posts.price`, `Posts.paid` | Pricing optimization |
| Label performance | `Labels.name` | Topic/category analysis |
| Content volume over time | `Posts` + date filtering | Trend tracking |
| Message volume | `Messages` | Audience interaction |
| Download completion | `Medias.downloaded` | Content availability |

### Recommended Architecture

1. **Ingest layer**: Run OF-Scraper on a schedule (daemon mode, `--daemon 360`) targeting owned model accounts
2. **Storage**: Use the SQLite DB output directly, or pipe via script hooks (`--post-script`) to a dedicated analytics DB
3. **Analytics DB**: Separate from the metadata DB — `post_download_script` can push to an external store (PostgreSQL, ClickHouse)
4. **Deduplication**: The `hash` field on `Medias` and `linked` flag enable tracking which content is new vs. re-posted
5. **Earnings gap**: Neither OF-Scraper nor UltimaScraper (despite earnings endpoints) provide clean earnings data via unofficial APIs — this requires the creator's own OnlyFans dashboard or a separate Payout scraper

### Script Hook Architecture (for custom analytics)

```bash
# Example: pipe post metadata to analytics endpoint
ofscraper --post-script /scripts/analytics_forward.py
```

The script receives a JSON payload via stdin (post metadata including `model_id`, `post_id`, `text`, `price`, `media` array) and can forward it to any endpoint.

### Gaps for Agency Dashboard
- **No earnings/revenue data** — requires creator's internal dashboard access or manual import
- **No subscriber/follower counts** — requires profile API access (separate auth)
- **No campaign/promo tracking** — outside scraper scope
- **Best for**: Content inventory, posting cadence, media type analysis, label/category performance

---

## 9. Quick Reference

```bash
# Install
uv tool install ofscraper --force

# Auth setup (manual)
vim ~/.config/ofscraper/auth.json

# Basic download (all posts, all media)
ofscraper --action download --posts all --username ALL

# Daemon mode (run every 60 minutes)
ofscraper --daemon 60 --posts all --action download

# Filter by date range
ofscraper --posts all --after 2026-01-01 --before 2026-03-31

# Download + like simultaneously
ofscraper --posts all --action like,download

# Metadata check (no download, just scan)
ofscraper metadata --username ALL
```

### Key Config Paths
- **Linux/Mac:** `~/.config/ofscraper/`
- **Windows:** `C:/Users/<user>/.config/ofscraper/`
- **Docker:** mount `~/.config/ofscraper/` and a data volume

---

## Sources
- [github.com/datawhores/OF-Scraper](https://github.com/datawhores/OF-Scraper)
- [of-scraper.gitbook.io/of-scraper](https://of-scraper.gitbook.io/of-scraper)
- [of-scraper.gitbook.io/of-scraper/llms-full.txt](https://of-scraper.gitbook.io/of-scraper/llms-full.txt)
- [of-scraper.gitbook.io/of-scraper/page/schema.md](https://of-scraper.gitbook.io/of-scraper/page/schema.md)
- [github.com/UltimaSoftware/UltimaScraperOrgs](https://github.com/UltimaSoftware/UltimaScraperOrgs)
