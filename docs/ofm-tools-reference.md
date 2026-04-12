---
name: OFM Agency Tools — Competitive Reference
description: Full breakdown of OFM management tools, features, and URLs. Chatting tools documented for future reference only — not current scope.
type: reference
---

## Scope Note
ISSO does not deal in chatting/DM management right now. Tools heavy on chatter features (Supercreator, Infloww, CreatorHero) are documented here for future reference only. Current focus: content pipeline, scheduling, scraping, analytics.

**Priority tools to study:** Xcelerator, Virlo.ai, Fanfix  
**Fanfix deep dive complete:** 2026-04-06 — see `.omc/scientist/reports/2026-04-06_fanfix-competitive-analysis.md`

---

## Priority Tools (deep dive status)

### Xcelerator — xcelerator.agency
Pipeline-structured OFM CRM. Interesting for Hub approval workflow.
- Plan → Approve → Edit → QA → Distribute content workflow
- Full funnel analytics: social post → subscription conversion
- KPIs tied directly to tasks
- Custom mobile app for client content requests
**Status:** Not yet deep-dived.

### Virlo.ai — virlo.ai
Best-in-class competitor scraping. Interesting for Recon + Intelligence.
- Monitors TikTok, IG Reels, YouTube Shorts 24/7
- Flags outlier videos massively outperforming their baseline
- "Orbit Search" keyword intelligence
- Slack/Discord webhook exports
- "Content Studio" converts scraped data into copywriting prompts (closes research → production loop)
**Status:** Not yet deep-dived.

### Fanfix — fanfix.io
Creator monetization + scheduling. Deep-dived 2026-04-06.

**CONFIRMED FEATURES:**
- Scheduler List View — chronological list of all scheduled posts (added 9.30.2025)
- Full-Page Create Flow — full-screen post creation, replaced modal (added 1.7.2026)
- Message Blast Scheduler — compose → audience → schedule → review screen
- Review Screen before send: shows content, estimated reach, unlock price, scheduled time, target audience
- "Skip Recent Chats" toggle — avoid blasting recently messaged fans (30min / 1hr / 3hr / custom)
- Create from Vault — select multiple assets, batch-create posts or blasts (added 3.16.2026)
- Vault asset analytics — sort by Total Paid, Purchase Count
- Analytics: left-nav tab, 3 sections: Posts / Message Blasts / Livestreams
- Posts analytics: likes, comments, revenue, unlock count, timestamp, status
- Blast analytics: reach, unlock price, total earnings, unlock count, engagement rate %, delivery status, send time
- Livestream analytics: title + times, tips, total revenue, transactions, messages, participants
- Real-time earnings refresh (added 12.11.2025, was previously 18hr lag)
- Churn risk shown in real time on creator dashboard
- Fan Insights Panel (right panel in messaging): membership tier, lifetime revenue, join date, private notes
- Post Collections — group content by category (workouts, food, travel etc), fans can filter by collection
- Filter inbox by fan lists (added 3.16.2026)
- Multiple automated welcome messages, per-tier customization (added 1.7.2026)
- Vault analytics filters: sort by Total Paid, Purchase Count (added 1.7.2026)
- AI Content Moderation — auto-flags content (added 12.8.2025)
- Moderated Content Review Request — appeal mechanism via Vault three-dot menu (added 3.16.2026)
- Clipping Network (Superclip) — 25K–5M follower accounts amplify creator content (added 1.7.2026)

**CONFIRMED GAPS:**
- No native agency/manager accounts — third-party FlowFix fills this
- No content approval/review workflow for agencies
- No calendar grid view — list only, no drag-and-drop
- No bulk scheduling wizard (multi-post date assignment)
- No cross-creator portfolio analytics
- No subscription tiers (all fans see same content)
- No mobile app (web-only)
- No data ownership (platform owns subscriber list)
- No AI scheduling time suggestions
- No content pipeline stages (Plan → Approve → Edit → QA → Distribute)

**PRICING:**
- Creator commission: 20% (creator keeps 80%) — flat, no volume discount
- Fan subscription: $5–$50/month creator-set
- Pay-per-message: $5/$10/$15/$20
- Tips: $3–$500 (60% of creator income from DMs)
- No tiered subscriptions for fans

**FlowFix (flowfixapp.com) — Third-party agency layer on Fanfix:**
- Cross-creator dashboard: total revenue, active creators, messages sent, conversion rate
- Per-creator earnings, PPV tracking
- Chatter assignment, per-chatter dashboards (sales, unlock ratio, activity)
- Script templates + script approval system (admin approves before chatter sends)
- Employee group management, payout tracking
- Invite-only, no public pricing

---

## Future Reference (chatting-heavy — not current scope)

### Supercreator — supercreator.app
Dominant OFM tool (25,000+ users). Chatter team management focus.
- Chatter activity logs + revenue per chatter
- PPV sales by content type
- AI chatbot "Izzy" (500M real chats training data)
- Dynamic PPV pricing ("PriceGuard")
- Optimal mass-message timing
- Fan re-engagement queues
- Passwordless multi-login for chatter security

### Infloww — infloww.com
Inbox speed + content vault focus.
- 40% faster messaging (Messages Pro)
- "Smart Lists" — 9 inbox subscriber segments
- Vault Pro — bulk media upload/edit
- Unique IP per creator

### CreatorHero — creatorhero.com
Chatter accountability + authentic automation.
- Keystroke tracking + timezone-aware online status
- "Typo simulation" for authentic replies
- Cross-platform traffic attribution (TikTok post → subscription)
- Fan spend visible in chat window
- AI tone-matching chat

### FansMetric / OnlyMonster
Fan scoring + content attribution.
- Fan score (spend + engagement + churn risk)
- Content-to-PPV purchase correlation
- Mobile KPI control panel
