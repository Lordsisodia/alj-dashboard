# Screen 02 — Content Pipeline

**Route:** `/content`  
**File:** `src/app/content/page.tsx` (451 lines)

---

## What it does

The raw clip intake and AI enhancement pipeline. This is where the workflow starts after a model films content. Agency staff upload the raw clips, AI enhances them, then they're sent to the editing pipeline.

**3-step flow shown at top:**
1. Brief It — describe the content idea
2. Upload Clips — drag & drop raw video files
3. Enhance & Send — AI processes clips, push to editing pipeline

---

## Left panel — Brief It (col-span-3)

**Content brief form:**
- Textarea: "Describe the content idea..." (freeform brief)
- Dropdown: Model selector (Tyler, Ella, Ren, Amam)
- Dropdown: Niche selector (GFE, Fitness, Meme, Thirst Trap, Lifestyle)
- Tag input: Props (e.g. "red trucker hat", "white vest") — add/remove pill tags
- Tag input: Outfits (e.g. "gym fit", "white crop top") — add/remove pill tags

**Upload zone:**
- Drag-and-drop area with dashed border
- Accepts: MP4, MOV, WEBM up to 4K
- File input (hidden, triggered by click)
- Clip list: each clip shows filename, size, status badge (Uploading / Enhancing / Enhanced) + remove button

---

## Right panel — Enhancement + Pipeline (col-span-2)

**AI Enhancement card:**
- Progress bar (0–100%)
- Before/After preview panels
- Enhancement checklist:
  - Upscale to 4K ✓
  - Sharpen & Denoise ✓
  - Colour Correction ✓
  - Stabilise Footage ✓
  - Enhance Details ✓

**Google Drive card:**
- Connected status indicator (green dot)
- Shows destination path: `IGINFULL Content / {model} / Week {N}`
- Auto-saved confirmation when enhanced

**Send to Pipeline card:**
- Summary: Model, Niche, Clip count
- "Send to Editing Pipeline" button (disabled until all clips enhanced)
- Success state: "Sent to pipeline! X clips ready for editing."

---

## Data needed (Convex)

```ts
// content table
{
  modelId: string,
  brief: string,
  niche: string,
  props: string[],
  outfits: string[],
  clips: {
    id: string,
    filename: string,
    size: number,
    status: "uploading" | "enhancing" | "enhanced",
    driveUrl?: string,
    enhancement?: {
      upscaled: boolean,
      denoised: boolean,
      colorCorrected: boolean,
      stabilized: boolean,
      detailEnhanced: boolean,
    }
  }[],
  status: "draft" | "enhancing" | "ready" | "sent_to_pipeline",
  createdAt: number,
}

// Convex mutations needed:
// content.enhance(clipId, videoBase64, mimeType) → enhancement result
// pipeline.sendToPipeline(contentId) → marks as sent
```

---

## OFM adaptations

| Reference | ISSO |
|---|---|
| "IGINFULL Content / {model} / Week {N}" folder path | ISSO-specific Drive structure |
| IG-focused enhancement | Same enhancement applies to OFM content |
| "Editing Pipeline" label | Keep — editors receive the content here |
| Gemini API for enhancement | Keep Gemini or swap for custom enhancement service |

---

## Key integration: Google Drive
This screen assumes Drive is connected (shown as "Connected" in the card). The auto-sync to Drive is a core feature — clips go to a structured folder per model per week.

---

## Open questions

- OPEN: Is the AI enhancement (upscale/denoise/etc) actually implemented via Gemini, or is it a mock? The code shows it calls `api.content.enhance` via Convex — needs real implementation.
- OPEN: What's the editing pipeline? Is it Airtable, a custom queue, or just a Convex table that editors see?
- OPEN: Should uploading happen directly to Drive (bypassing local server), or buffer through Convex?
