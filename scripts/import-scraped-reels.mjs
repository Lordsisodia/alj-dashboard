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
    path: "/Users/shaansisodia/Downloads/dataset_instagram-reel-scraper_2026-03-28_07-52-33-577 (2).json",
    niche: "GFE",  // minaxash — lifestyle/GFE
  },
  {
    path: "/Users/shaansisodia/Downloads/dataset_instagram-reel-scraper_2026-03-28_08-08-07-406 (2).json",
    niche: "E-Girl",  // cuddlesweetbuns / egirlasianemily
  },
  {
    path: "/Users/shaansisodia/Downloads/dataset_instagram-reel-scraper_2026-03-28_07-58-47-148 (1).json",
    niche: "Thirst Trap",  // a55tr1d / kittygoofygirl / tootinytrina
  },
];

async function main() {
  const client = new ConvexHttpClient(CONVEX_URL);

  let totalPosts = 0;
  let totalAccounts = 0;
  let totalSkipped = 0;

  const BATCH_SIZE = 50;

  for (const file of FILES) {
    console.log(`\n📂 Importing: ${file.path}`);
    const raw = JSON.parse(readFileSync(file.path, "utf-8"));
    console.log(`  ${raw.length} rows total`);

    for (let i = 0; i < raw.length; i += BATCH_SIZE) {
      const batch = raw.slice(i, i + BATCH_SIZE);
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
        // Log offending rows
        batch.forEach((row, j) => {
          if (!row.ownerUsername || !row.displayUrl) {
            console.log(`    Row ${i + j} missing fields:`, JSON.stringify(row).slice(0, 120));
          }
        });
      }
    }
  }

  console.log(`\n🎉 Done — ${totalPosts} posts, ${totalAccounts} new accounts, ${totalSkipped} skipped`);
}

main().catch(console.error);
