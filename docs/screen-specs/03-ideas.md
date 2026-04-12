# Screen 03 — Idea Generation

**Route:** `/ideas`  
**File:** `src/app/ideas/page.tsx` (718 lines)

---

## What it does

AI-powered content brief generator. The agency inputs parameters (model, niche, style, campaign) and the AI generates 3 detailed filming briefs. Each brief is a complete shoot instruction card. Briefs can be sent directly to a model's dashboard.

This is the **top of the content funnel** — ideas flow from here → Models screen → Content screen.

---

## 3-panel layout

### Left panel (w-80) — Generator + Brief List

**Generate form:**
- Text input: Campaign name (e.g. "April 2026")
- Toggle buttons: Model (Tyler / Ren / Ella / Amam)
- Toggle buttons: Niche (GFE / Fitness / Meme / Thirst Trap / Lifestyle)
- Toggle buttons: Style:
  - Unbothered / Deadpan
  - Flirty / Confident
  - Gym Thirst Trap
  - POV Story
  - Couple Collab
  - Transition
- "Generate Ideas" button → calls Gemini API → 2.2s loading state with pulsing dots

**Brief list (scrollable):**
- Each brief shown as a compact card: hook preview, model·niche, status badge (Draft / Generating / Ready / Sent), hashtag pills
- Click to select and view in centre panel
- Count header: "3 Briefs · 2 ready"

### Centre panel — Brief Detail

When a brief is selected, shows full details:
- Metadata pills: model, niche, style, campaign
- **Hook** — the opening line/POV (large, bold)
- **Filming Steps** — numbered step-by-step shoot instructions (5–6 steps)
- **Camera** — angle, distance, setup notes
- **On-Screen Text** — text overlay suggestion
- **End Shot** — how to close the video
- **Caption Suggestion** — italic quote with hashtags below
- **"Send to [Model]'s Dashboard"** button → marks as sent, pushes to Models screen

Loading state: Gemini animation (pulsing icon + "Gemini is thinking...")
Empty state: "Select a brief or generate new ideas"

### Right panel (w-56) — Pipeline Stats

- Total Briefs count
- Ready to Send count
- Sent to Model count
- Model Breakdown: per-model dot indicators (green=sent, pink=ready)
- "Ideas generated!" success toast

---

## Data needed (Convex)

```ts
// ideas table
{
  modelId: string,
  niche: string,
  style: string,
  campaign: string,
  hook: string,
  steps: string[],
  camera: string,
  onScreenText: string,
  endShot: string,
  captionSuggestion: string,
  hashtags: string[],
  status: "draft" | "generating" | "ready" | "sent",
  createdAt: number,
}

// Convex action needed:
// ideas.generate(modelId, niche, style, campaign) → GeneratedBrief[]
// ideas.send(ideaId) → updates status to "sent", creates notification for model
```

---

## AI integration

Currently uses a mock function (`generateMockBriefs`) with a 2.2s delay. The Convex action would call **Gemini API** (or Claude API) with a structured prompt:

```
Generate 3 OFM content briefs for a {niche} creator named {model}.
Style: {style}. Campaign: {campaign}.
Each brief needs: hook, 5 filming steps, camera setup, on-screen text, end shot, caption, hashtags.
```

---

## OFM adaptations

| Reference | ISSO |
|---|---|
| Styles: POV Story, Gym Thirst Trap etc | Same styles apply to OFM content — these are already OFM-specific |
| Niches: GFE, Fitness, Meme etc | Same — already OFM niches |
| "Send to [Model]'s Dashboard" | Same — model sees brief in their section |
| Gemini branding in UI | Can keep Gemini or rebrand as "ISSO AI" |

This screen needs the **least adaptation** — the reference was already built for OFM content creation.

---

## Open questions

- OPEN: Do models have their own login to see briefs, or does the agency VA relay the brief manually (e.g. WhatsApp)?
- OPEN: Should "Send to Dashboard" trigger a Telegram/WhatsApp notification to the model?
- ASSUMED: Claude API is preferred over Gemini for generation, but either works via Convex action.
