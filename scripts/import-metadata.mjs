/**
 * Quick metadata import — no downloads, no R2
 * Pulls from Apify dataset, saves directly to Convex.
 * Thumbnails + videoUrl stored as raw CDN URLs (work for ~weeks).
 * Run R2 upload pipeline separately once schema is pushed.
 *
 * Usage: node scripts/import-metadata.mjs --dataset HbVCWnZjUWZHa8XlD [--niche GFE]
 */

import { readFileSync } from 'fs';

// ── Load .env.local ───────────────────────────────────────────────────────────
const envLines = readFileSync(new URL('../.env.local', import.meta.url).pathname, 'utf8').split('\n');
for (const line of envLines) {
  const m = line.match(/^([^#=\s]+)\s*=\s*(.*)$/);
  if (m) process.env[m[1]] = m[2].trim();
}

const CONVEX_URL     = process.env.NEXT_PUBLIC_CONVEX_URL;
const APIFY_TOKEN    = process.env.APIFY_API_TOKEN;

// ── Args ──────────────────────────────────────────────────────────────────────
const args       = process.argv.slice(2);
const datasetIdx = args.indexOf('--dataset');
const nicheIdx   = args.indexOf('--niche');
const DATASET_ID     = datasetIdx !== -1 ? args[datasetIdx + 1] : null;
const NICHE_OVERRIDE = nicheIdx   !== -1 ? args[nicheIdx + 1]   : null;

if (!DATASET_ID) {
  console.error('Usage: node scripts/import-metadata.mjs --dataset <id> [--niche GFE]');
  process.exit(1);
}

// ── Fetch dataset from Apify ──────────────────────────────────────────────────
console.log(`\n📡 Fetching dataset ${DATASET_ID}...`);
const res  = await fetch(`https://api.apify.com/v2/datasets/${DATASET_ID}/items?token=${APIFY_TOKEN}&format=json&limit=500`);
const raw  = await res.json();
const posts = raw.filter(p => p.ownerUsername && p.shortCode && p.type === 'Video');
console.log(`✅ ${posts.length} video reels\n`);

// ── Batch import to Convex ────────────────────────────────────────────────────
const BATCH = 20;
let imported = 0, skipped = 0, failed = 0;

for (let i = 0; i < posts.length; i += BATCH) {
  const batch = posts.slice(i, i + BATCH);

  // Map new Apify format → importFromScraper args
  const mapped = batch.map(p => ({
    displayUrl:    p.images?.[0] ?? '',               // thumbnail CDN URL
    caption:       p.caption ?? '',
    ownerFullName: p.ownerFullName ?? undefined,
    ownerUsername: p.ownerUsername,
    url:           p.url ?? `https://www.instagram.com/p/${p.shortCode}/`,
    commentsCount: p.commentsCount ?? 0,
    firstComment:  p.firstComment  ?? undefined,
    likesCount:    p.likesCount    ?? 0,
    timestamp:     p.timestamp     ?? undefined,
    viewsCount:    p.videoViewCount ?? p.videoPlayCount ?? 0,
    followerCount: p.ownerFollowersCount ?? p.followersCount ?? undefined,
  }));

  process.stdout.write(`[${i + 1}–${Math.min(i + BATCH, posts.length)}/${posts.length}] importing... `);

  try {
    const mutRes = await fetch(`${CONVEX_URL}/api/mutation`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        path: 'scraperImport:importFromScraper',
        args: { posts: mapped, nicheOverride: NICHE_OVERRIDE ?? undefined },
      }),
    });
    const json = await mutRes.json();
    if (json.status === 'error') throw new Error(json.errorMessage);

    const r = json.value;
    imported += r.posts  ?? 0;
    skipped  += r.skipped ?? 0;
    console.log(`✓  +${r.posts} posts, ${r.skipped} skipped`);
  } catch (err) {
    failed += batch.length;
    console.log(`✗  ${err.message?.slice(0, 100)}`);
  }
}

console.log(`\n✅ Done — ${imported} imported, ${skipped} skipped, ${failed} failed`);
console.log(`🗄  Convex: ${CONVEX_URL}\n`);
console.log('Next: run `npx convex dev --once` then `node scripts/pipeline-import.mjs` to upload to R2\n');
