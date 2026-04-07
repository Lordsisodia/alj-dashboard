/**
 * import-scraped-reels.mjs
 *
 * Reads Apify Instagram Reel Scraper JSON exports and imports them
 * into Convex via the importFromScraper mutation.
 *
 * Usage:
 *   node scripts/import-scraped-reels.mjs
 *
 * Requires:
 *   CONVEX_URL env var (or set it below)
 *
 * Install convex client if needed:
 *   pnpm add -D convex
 */

import { ConvexHttpClient } from "convex/browser";
import { readFileSync } from "fs";
import { api } from "../convex/_generated/api.js";

const CONVEX_URL = process.env.CONVEX_URL ?? "https://quiet-oriole-943.convex.cloud";

// ── Files to import ───────────────────────────────────────────────────────────
const FILES = [
  {
    path: "/Users/shaansisodia/Downloads/dataset_instagram-reel-scraper_2026-04-05_23-54-03-354.json",
    niche: "E-Girl",  // cuddlesweetbuns / egirlasianemily / minaxash / tinaxkitsune
  },
];

// Fields Convex accepts
// NOTE: 'id' is deliberately excluded — 19-digit Instagram IDs exceed JavaScript's
// Number precision and get mangled in transit. The mutation uses shortCode as the
// externalId anyway, so 'id' is not needed.
const ALLOWED_FIELDS = new Set([
  'shortCode', 'caption', 'hashtags', 'url',
  'commentsCount', 'displayUrl', 'likesCount', 'timestamp',
  'firstComment', 'ownerFullName', 'ownerUsername',
  'videoUrl', 'videoViewCount', 'videoPlayCount',
]);

async function main() {
  const client = new ConvexHttpClient(CONVEX_URL);

  let totalPosts = 0;
  let totalAccounts = 0;
  let totalSkipped = 0;

  const BATCH_SIZE = 10;

  for (const file of FILES) {
    console.log(`\n📂 Importing: ${file.path}`);
    const raw = JSON.parse(readFileSync(file.path, "utf-8"));
    console.log(`  ${raw.length} rows total`);

    for (let i = 0; i < raw.length; i += BATCH_SIZE) {
      const batch = raw.slice(i, i + BATCH_SIZE).map(row => {
        const cleaned = {};
        for (const key of ALLOWED_FIELDS) {
          if (key in row) cleaned[key] = row[key];
        }
        return cleaned;
      });
      try {
        const result = await client.mutation(api.scraperImport.importFromScraper, {
          posts: batch,
          nicheOverride: file.niche,
        });
        console.log(`  Batch ${i}–${i + batch.length}: ✅ Posts: ${result.posts}  Accounts: ${result.accounts}  Skipped: ${result.skipped}`);
        totalPosts += result.posts;
        totalAccounts += result.accounts;
        totalSkipped += result.skipped;
      } catch (err) {
        console.error(`  Batch ${i}–${i + batch.length}: ❌ ${err.message}`);
      }
    }
  }

  console.log(`\n🎉 Done — ${totalPosts} posts, ${totalAccounts} new accounts, ${totalSkipped} skipped`);
}

main().catch(console.error);
