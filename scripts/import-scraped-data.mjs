/**
 * Import real scraped Instagram data into Convex.
 * Run: node scripts/import-scraped-data.mjs
 */

import { ConvexHttpClient } from "convex/browser";
import { readFileSync } from "fs";
import { api } from "../convex/_generated/api.js";

const CONVEX_URL = "https://quiet-oriole-943.convex.cloud";
const client = new ConvexHttpClient(CONVEX_URL);

// ── Creator metadata ─────────────────────────────────────────────────────────

const CREATOR_META = {
  minaxash:             { niche: "GFE",       followerCount: 597697, avatarColor: "#ff0069", displayName: "Mina Ash" },
  tinaxkitsune:         { niche: "GFE",       followerCount: 50000,  avatarColor: "#ec4899", displayName: "Tina Kitsune" },
  a55tr1d:              { niche: "Lifestyle", followerCount: 80000,  avatarColor: "#4a9eff", displayName: "Astrid" },
  amammyw:              { niche: "Lifestyle", followerCount: 200000, avatarColor: "#f97316", displayName: "Sasithon Miyawong" },
  nerd_nattiyaseehanamm:{ niche: "Lifestyle", followerCount: 100000, avatarColor: "#833ab4", displayName: "Ñërd ◡̈" },
  tongohmm:             { niche: "Lifestyle", followerCount: 120000, avatarColor: "#fcaf45", displayName: "Tongohmm Klaatawan" },
};

// ── Extract shortcode from Instagram URL ─────────────────────────────────────

function extractShortcode(url) {
  const m = url?.match(/instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
  return m ? m[1] : null;
}

// ── Normalise hashtags from caption ─────────────────────────────────────────

function extractHashtags(caption) {
  if (!caption) return [];
  return (caption.match(/#\w+/g) ?? []).slice(0, 10);
}

// ── Load all scraper files ────────────────────────────────────────────────────

const FILES = [
  { path: "/Users/shaansisodia/Downloads/dataset_instagram-reel-scraper_2026-03-28_07-52-33-577.json", contentType: "reel" },
  { path: "/Users/shaansisodia/Downloads/dataset_instagram-reel-scraper_2026-03-28_07-58-47-148.json", contentType: "reel" },
  { path: "/Users/shaansisodia/Downloads/dataset_instagram-post-scraper_2026-03-24_19-05-59-062.json", contentType: "post" },
];

let all = [];
for (const f of FILES) {
  const raw = JSON.parse(readFileSync(f.path, "utf8"));
  for (const r of raw) {
    if (!r.ownerUsername) continue; // skip sentinel/input rows
    all.push({ ...r, _fileContentType: f.contentType });
  }
}

// Deduplicate by URL
const seen = new Set();
all = all.filter(r => {
  if (!r.url || seen.has(r.url)) return false;
  seen.add(r.url);
  return true;
});

console.log(`Total unique records to import: ${all.length}`);

// ── Import ────────────────────────────────────────────────────────────────────

let inserted = 0, skipped = 0, failed = 0;

for (let i = 0; i < all.length; i++) {
  const r = all[i];
  const shortcode = extractShortcode(r.url);
  if (!shortcode) { skipped++; continue; }

  const username  = r.ownerUsername.toLowerCase().replace(/^@/, "");
  const meta      = CREATOR_META[username] ?? { niche: "Lifestyle", followerCount: 50000, avatarColor: "#9ca3af", displayName: r.ownerFullName ?? username };

  const likes    = r.likesCount    ?? 0;
  const comments = r.commentsCount ?? 0;
  const saves    = 0; // not in Apify reel scraper
  const views    = r.videoPlayCount ?? r.videoViewCount ?? 0;
  const reach    = meta.followerCount;
  const er       = reach > 0 ? parseFloat(((likes + comments + saves) / reach).toFixed(6)) : 0;
  const outlier  = (views > 0 && reach > 0) ? parseFloat((views / reach).toFixed(4)) : undefined;

  const postedAt = r.timestamp ? new Date(r.timestamp).getTime() : Date.now();

  try {
    const result = await client.mutation(api.intelligence.importScrapedPost, {
      externalId:    shortcode,
      handle:        username,
      displayName:   r.ownerFullName ?? meta.displayName,
      platform:      "instagram",
      contentType:   r._fileContentType,
      niche:         meta.niche,
      thumbnailUrl:  r.displayUrl ?? "",
      caption:       r.caption ?? "",
      hashtags:      extractHashtags(r.caption),
      likes,
      comments,
      saves,
      views,
      reach,
      engagementRate: er,
      postedAt,
      scrapedAt:     Date.now(),
      firstComment:  r.firstComment || undefined,
      outlierRatio:  outlier,
      followerCount: meta.followerCount,
      avatarColor:   meta.avatarColor,
    });

    if (result.inserted) inserted++; else skipped++;
  } catch (e) {
    failed++;
    console.error(`Failed [${shortcode}]:`, e.message);
  }

  if ((i + 1) % 50 === 0) {
    console.log(`  ${i + 1}/${all.length} — inserted: ${inserted}, skipped: ${skipped}, failed: ${failed}`);
  }
}

console.log(`\nDone. inserted=${inserted} skipped=${skipped} failed=${failed}`);
