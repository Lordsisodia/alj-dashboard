# Portfolio Case Study Spec (Elementary example)

> Source of truth for all portfolio detail pages. Reuse brand tokens (`color-system.md`), type geometry (`typography-and-spacing.md`), and callout shells (`component-presets.md`). Mobile-first; desktop uses 12-col grid.

## Required content fields
- Hero: title, one-liner, industry tag, services provided, primary CTA URL, secondary CTA text/url.
- Stats (4–6): price band, delivery speed, team size, scope/model, tech stack, engagement model.
- Problem: 2–3 bullets (business/user pain + constraints).
- Solution: 3–5 bullets (features/architecture/process).
- Results: 2–4 KPIs with numbers + deltas.
- Timeline: phases with duration/dates (e.g., Discover, Design, Build, Launch).
- Team & roles: PM, Design, FE, BE, QA (names optional), engagement hours.
- Tech stack: tag list.
- Challenges & mitigations: paired bullets.
- Testimonial: quote, name/title, company logo.
- Gallery: 6–8 images/video with captions; before/after tags when relevant.
- FAQ: 4 common objections.
- Related projects: 3 cards (title, industry, CTA link).

## Layout and component mapping
- Container: max-w-6xl desktop, `px-4` mobile / `px-8` desktop.
- Surfaces: outer cards `bg-siso-bg-secondary border-white/10 shadow-[0_18px_35px_rgba(0,0,0,0.45)]`; inner cards use `.siso-inner-card`; emphasis rows may use `.siso-inner-card-strong`.
- Hero (desktop 7/5 split):
  - Left: cover image/video (edge-to-edge).
  - Right: eyebrow (industry), title (hero-caps), one-liner, stat chips (3), primary CTA, secondary link.
  - Sticky mini-bar after scroll: mini title + primary CTA.
- Stat bar: horizontal chip list; on mobile use horizontal scroll.
- Double callouts: use `SettingsGroupCallout` outer shell, inside `grid md:grid-cols-2 gap-3`; mobile stacks.
- Results: 3 KPI cards on `bg-siso-bg-tertiary`, delta in pill.
- Gallery: 2-up grid desktop, single column mobile; lightbox; captions required.
- Timeline: horizontal stepper desktop; vertical list mobile; use micro-labels for durations.
- Team & stack: 6/6 split desktop; stacked mobile.
- Challenges/Mitigations: double callout pattern.
- Testimonial: quote block on `bg-siso-bg-tertiary` with avatar/logo.
- FAQ: accordion using ghost cards (`border-white/10 bg-white/[0.03]`).
- Related: 3 cards; reuse Community/Earnings card geometry; end with CTA “Build something similar”.

## Token references
- Colors: `--siso-bg-secondary`, `--siso-bg-tertiary`, `--siso-bg-hover`, `--siso-text-primary/secondary/muted`, `--siso-border-primary`.
- Radius: `rounded-[26px]` outer, `rounded-2xl` inner.
- Type: `section-label` (text-[11px] uppercase tracking-[0.3em]), `hero-caps` for main title, `micro-label` for stats.
- Pills: neutral pill `border-white/10 text-siso-text-muted`; accent pill adds `text-siso-orange` and optional `bg-white/10`.
- CTA: primary `Button variant=default` (orange gradient), secondary ghost.

## Content template (Elementary Restaurant)
- Hero
  - Eyebrow: “Restaurant • B2C”
  - Title: “Elementary”
  - One-liner: “Restaurant website and reservation system”
  - Services: UX, FE build, booking integration, payments
  - Primary CTA: “Build something similar” → /contact?case=elementary
  - Secondary: “View all work” → /portfolio
  - Stats: Price $6,000 (fixed band), Delivery 11 days, Team 3, Stack Next.js/Node/Postgres, Model Fixed-bid.
- Problem (bullets)
  1) Mobile visitors could not book tables; form failures on iOS.  
  2) No live availability; staff overloaded by phone reservations.  
  3) Menu changes weren’t reflected quickly; SEO slipping for local searches.
- Solution (bullets)
  1) Redesigned booking flow with time-slot chips + party-size guardrails.  
  2) Added real-time availability service + confirmation SMS/email.  
  3) Headless menu CMS with schedule-based publishing; structured data for SEO.  
  4) Performance budget: LCP <2.5s on mid-tier mobile via image CDNs + SSR.
- Results (KPIs – replace with actuals)
  - +31% online reservations in first 30 days.  
  - Mobile LCP improved by 0.7s (p75).  
  - No-show rate down 19% after reminder flows.  
  - 4.8★ average post-booking feedback.
- Timeline
  - Discover: 2 days — audit, goals, data capture.  
  - Design: 3 days — mobile-first flow, component library.  
  - Build: 5 days — booking service, CMS integration, analytics.  
  - Launch: 1 day — QA, perf tuning, staff handoff.
- Team & roles
  - PM (8h), UX (12h), FE (32h), BE (20h), QA (8h).
- Tech stack
  - Next.js, Node/Express booking API, Postgres, Twilio SMS, Tailwind, Vercel.
- Challenges & mitigations (double callout)
  - PCI concerns → kept payments on Stripe Checkout, no card data stored.  
  - Peak traffic risk → cached menu CDN + ISR on booking shells.
- Testimonial (placeholder)
  - “We went from frantic phone calls to smooth online bookings in days. The new flow paid for itself in the first month.” — Priya Desai, Owner, Elementary Restaurant.
- Gallery (captions)
  - Booking flow (mobile), Availability picker, Menu CMS, Confirmation SMS, Admin dashboard, Before/After homepage.
- FAQ
  - How do you price? (Fixed band with scope).  
  - Can you integrate with our POS? (Yes: Toast/Square hooks).  
  - How fast can you launch? (11–14 days typical).  
  - Do you support multi-location? (Yes; per-location inventory flags).
- Related projects
  - “Luna Bistro” (restaurant), “Alto Coffee” (cafe), “Harbor Bar” (bar) → all with “Build similar” CTAs.

## Wireframe outline (text)
- Desktop: hero 7/5, stat bar (full), problem/solution double callout, KPI row (3), gallery 2-up, timeline horizontal, team+stack 6/6, challenges double callout, testimonial full, FAQ 2-col accordion, related 3-up, final CTA bar.
- Mobile: hero full, sticky CTA, stat chips horizontal scroll, problem → solution → KPIs stacked, gallery single, timeline vertical, team/stack stacked, challenges stacked, testimonial full, FAQ accordion, related horizontal scroll.

## Definition of done (per page)
- All required fields populated; no placeholder “—” values.
- CTA visible above the fold (desktop) and sticky on mobile.
- KPIs and testimonial present above the midpoint of the page.
- Uses only approved tokens and geometry; no ad-hoc colors/radii.
- Lightbox works for gallery; images have captions.
- Accessibility: color contrast AA on dark; buttons min 44px height; focus styles retained.
