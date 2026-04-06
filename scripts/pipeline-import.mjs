/**
 * OFM Media Pipeline
 * ------------------
 * Pulls from Apify dataset OR reads local JSON
 * Downloads video + thumbnail → uploads to R2 → upserts Convex
 *
 * Usage:
 *   node scripts/pipeline-import.mjs --dataset HbVCWnZjUWZHa8XlD [--niche GFE]
 *   node scripts/pipeline-import.mjs --file scripts/data/export.json [--niche GFE]
 */

import { readFileSync, existsSync, writeFileSync, mkdirSync, unlinkSync } from 'fs';
import { createHmac, createHash } from 'crypto';
import { execSync } from 'child_process';
import { tmpdir } from 'os';
import { join } from 'path';

// ── Load .env.local ───────────────────────────────────────────────────────────
const envPath = new URL('../.env.local', import.meta.url).pathname;
const envLines = readFileSync(envPath, 'utf8').split('\n');
for (const line of envLines) {
  const m = line.match(/^([^#=\s]+)\s*=\s*(.*)$/);
  if (m) process.env[m[1]] = m[2].trim();
}

const {
  CLOUDFLARE_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET,
  R2_PUBLIC_URL,
  NEXT_PUBLIC_CONVEX_URL,
  APIFY_API_TOKEN,
} = process.env;

const CONVEX_URL = NEXT_PUBLIC_CONVEX_URL;
const S3_ENDPOINT = `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`;

// ── Args ──────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const datasetIdx = args.indexOf('--dataset');
const fileIdx    = args.indexOf('--file');
const nicheIdx   = args.indexOf('--niche');
const DATASET_ID    = datasetIdx !== -1  ? args[datasetIdx + 1]  : null;
const FILE_PATH     = fileIdx !== -1     ? args[fileIdx + 1]     : null;
const NICHE_OVERRIDE = nicheIdx !== -1   ? args[nicheIdx + 1]    : null;

if (!DATASET_ID && !FILE_PATH) {
  console.error('Usage: node pipeline-import.mjs --dataset <id> OR --file <path> [--niche GFE]');
  process.exit(1);
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function sha256hex(data) {
  return createHash('sha256').update(data).digest('hex');
}

async function r2Upload(key, buffer, contentType) {
  const region  = 'auto';
  const service = 's3';
  const now     = new Date();
  const date    = now.toISOString().replace(/[:-]|\.\d{3}/g, '').slice(0, 15) + 'Z';
  const dateStr = date.slice(0, 8);
  const host    = new URL(S3_ENDPOINT).hostname;
  const payHash = sha256hex(buffer);

  const headers = {
    'host':                 host,
    'x-amz-date':          date,
    'x-amz-content-sha256': payHash,
    'content-type':        contentType,
  };
  const signedHeaders    = Object.keys(headers).sort().join(';');
  const canonicalHeaders = Object.keys(headers).sort().map(k => `${k}:${headers[k]}\n`).join('');
  const canonicalRequest = ['PUT', `/${R2_BUCKET}/${key}`, '', canonicalHeaders, signedHeaders, payHash].join('\n');
  const credScope  = `${dateStr}/${region}/${service}/aws4_request`;
  const strToSign  = `AWS4-HMAC-SHA256\n${date}\n${credScope}\n${sha256hex(canonicalRequest)}`;

  const hmac = (key, data) => createHmac('sha256', key).update(data).digest();
  const signingKey = hmac(hmac(hmac(hmac(`AWS4${R2_SECRET_ACCESS_KEY}`, dateStr), region), service), 'aws4_request');
  const signature  = createHmac('sha256', signingKey).update(strToSign).digest('hex');

  const res = await fetch(`${S3_ENDPOINT}/${R2_BUCKET}/${key}`, {
    method: 'PUT',
    headers: {
      ...headers,
      'Authorization':  `AWS4-HMAC-SHA256 Credential=${R2_ACCESS_KEY_ID}/${credScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
      'Content-Length': String(buffer.byteLength),
    },
    body: buffer,
  });
  if (!res.ok) throw new Error(`R2 upload failed ${res.status}: ${await res.text()}`);
  return `${R2_PUBLIC_URL}/${key}`;
}

function download(url) {
  const tmp = join(tmpdir(), `ig_dl_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  try {
    execSync(
      `curl -sL --max-time 60 --retry 2 \
        -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0 Safari/537.36" \
        -H "Referer: https://www.instagram.com/" \
        -H "Accept: */*" \
        -o "${tmp}" \
        "${url}"`,
      { stdio: 'pipe' }
    );
    const buf = readFileSync(tmp);
    if (buf.length < 100) throw new Error(`Empty response (${buf.length} bytes)`);
    return buf;
  } finally {
    try { unlinkSync(tmp); } catch {}
  }
}

async function convexUpsert(post) {
  const res = await fetch(`${CONVEX_URL}/api/mutation`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ path: 'scraperImport:importFromScraper', args: { posts: [post], nicheOverride: NICHE_OVERRIDE || undefined } }),
  });
  const json = await res.json();
  if (json.status === 'error') throw new Error(json.errorMessage);
  return json.value;
}

function guessNiche(username = '', hashtags = []) {
  const h = (username + ' ' + hashtags.join(' ')).toLowerCase();
  if (/gfe|girlfriend|luxe|softgirl/.test(h)) return 'GFE';
  if (/fit|gym|workout|muscle/.test(h))        return 'Fitness';
  if (/egirl|alt|goth|kawaii/.test(h))         return 'E-Girl';
  return 'Lifestyle';
}

// ── Fetch from Apify dataset ──────────────────────────────────────────────────
async function fetchDataset(datasetId) {
  console.log(`📡 Fetching dataset ${datasetId} from Apify...`);
  const res = await fetch(
    `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_API_TOKEN}&format=json&limit=500`
  );
  if (!res.ok) throw new Error(`Apify fetch failed: ${res.status}`);
  const data = await res.json();
  console.log(`✅ Got ${data.length} items\n`);
  return data;
}

// ── Main ──────────────────────────────────────────────────────────────────────
const raw = DATASET_ID
  ? await fetchDataset(DATASET_ID)
  : JSON.parse(readFileSync(FILE_PATH, 'utf8'));

// Filter to valid video posts only
const posts = raw.filter(p =>
  p.ownerUsername &&
  p.shortCode &&
  p.type === 'Video' &&
  p.videoUrl
);

console.log(`📦 ${posts.length} valid video reels to process`);
if (NICHE_OVERRIDE) console.log(`🏷  Niche: ${NICHE_OVERRIDE}`);
console.log('');

let uploaded = 0, skipped = 0, failed = 0;

for (let i = 0; i < posts.length; i++) {
  const p  = posts[i];
  const sc = p.shortCode;

  process.stdout.write(`[${i + 1}/${posts.length}] @${p.ownerUsername} — ${sc} ... `);

  try {
    // ── Thumbnail → R2 ──────────────────────────────────────────────────────
    const thumbSrc = p.images?.[0] || p.displayUrl;
    let thumbnailUrl = thumbSrc || '';
    if (thumbSrc) {
      const buf = await download(thumbSrc);
      thumbnailUrl = await r2Upload(`thumbs/${sc}.jpg`, buf, 'image/jpeg');
    }

    // ── Video → R2 ──────────────────────────────────────────────────────────
    let videoUrl = '';
    if (p.videoUrl) {
      const buf = await download(p.videoUrl);
      videoUrl = await r2Upload(`videos/${sc}.mp4`, buf, 'video/mp4');
    }

    // ── Upsert to Convex ─────────────────────────────────────────────────────
    await convexUpsert({
      displayUrl:    thumbnailUrl,
      videoUrl:      videoUrl || undefined,
      caption:       p.caption || '',
      ownerFullName: p.ownerFullName || undefined,
      ownerUsername: p.ownerUsername,
      url:           p.url || `https://www.instagram.com/p/${sc}/`,
      commentsCount: p.commentsCount || 0,
      firstComment:  p.firstComment || undefined,
      likesCount:    p.likesCount || 0,
      timestamp:     p.timestamp || undefined,
      viewsCount:    p.videoPlayCount || p.viewsCount || 0,
      followerCount: p.followersCount || p.ownerFollowersCount || undefined,
    });

    uploaded++;
    const label = videoUrl ? '🎬 video+thumb' : '🖼  thumb only';
    console.log(`✓ ${label}`);
  } catch (err) {
    failed++;
    console.log(`✗ ${err.message.slice(0, 100)}`);
  }

  // Tiny delay — be polite to CDN
  await new Promise(r => setTimeout(r, 150));
}

console.log(`\n✅ Done — ${uploaded} uploaded, ${skipped} skipped, ${failed} failed`);
console.log(`💾 R2: ${R2_PUBLIC_URL}`);
console.log(`🗄  Convex: ${CONVEX_URL}\n`);
