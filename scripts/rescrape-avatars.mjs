/**
 * Re-scrapes specific profiles via Apify to get fresh avatar URLs, uploads to R2.
 * Run: node scripts/rescrape-avatars.mjs
 */
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env.local
const envPath = resolve(new URL('.', import.meta.url).pathname, '../.env.local');
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8').split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => { const i = l.indexOf('='); return [l.slice(0,i).trim(), l.slice(i+1).trim()]; })
);

const HANDLES = ['minaxash', 'tinaxkitsune', 'a55tr1d', 'amammyw', 'nerd_nattiyaseehanamm', 'kittygoofygirl'];

const APIFY_TOKEN    = env.APIFY_API_TOKEN;
const PROFILE_ACTOR  = 'apify~instagram-profile-scraper';
const CONVEX_URL     = env.NEXT_PUBLIC_CONVEX_URL;
const ACCOUNT_ID     = env.CLOUDFLARE_ACCOUNT_ID;
const R2_KEY         = env.R2_ACCESS_KEY_ID;
const R2_SECRET      = env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET      = env.R2_BUCKET ?? 'ofm-saas-media';
const R2_PUBLIC_BASE = env.R2_PUBLIC_URL ?? 'https://pub-6c398617211c499ea00c44c3d18564bc.r2.dev';

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_KEY, secretAccessKey: R2_SECRET },
});

async function convexMutation(name, args = {}) {
  const res = await fetch(`${CONVEX_URL}/api/mutation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: name, args, format: 'json' }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json.value;
}

async function uploadToR2(username, picUrl) {
  const res = await fetch(picUrl, {
    headers: { 'Referer': 'https://www.instagram.com/', 'User-Agent': 'Mozilla/5.0' },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`Avatar fetch failed: ${res.status}`);
  const buffer      = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get('content-type') ?? 'image/jpeg';
  const ext         = contentType.includes('png') ? 'png' : 'jpg';
  const key         = `avatars/ig/${username}.${ext}`;
  await r2.send(new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: buffer, ContentType: contentType }));
  return `${R2_PUBLIC_BASE}/${key}`;
}

async function scrapeAndUpdate(username) {
  process.stdout.write(`  @${username} scraping... `);

  const res = await fetch(
    `https://api.apify.com/v2/acts/${PROFILE_ACTOR}/run-sync-get-dataset-items?token=${APIFY_TOKEN}&memory=256`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernames: [username] }),
      signal: AbortSignal.timeout(60_000),
    }
  );
  if (!res.ok) throw new Error(`Apify ${res.status}`);
  const items = await res.json();
  const p = items[0];
  if (!p) throw new Error('Profile not found');

  const rawAvatarUrl = p.profilePicUrlHD ?? p.profilePicUrl ?? null;
  if (!rawAvatarUrl) throw new Error('No avatar URL from Apify');

  // Try R2 upload; fall back to raw Apify URL if CDN blocks the fetch
  let finalAvatarUrl = rawAvatarUrl;
  process.stdout.write(`uploading... `);
  try {
    finalAvatarUrl = await uploadToR2(username, rawAvatarUrl);
    process.stdout.write(`[R2] `);
  } catch (e) {
    process.stdout.write(`[CDN blocked, storing raw URL] `);
  }

  await convexMutation('candidates:upsert', {
    handle:      `@${p.username ?? username}`,
    displayName: p.fullName || username,
    followerCount:      p.followersCount   ?? undefined,
    followsCount:       p.followsCount     ?? undefined,
    postsCount:         p.postsCount       ?? undefined,
    bio:                p.biography        ?? undefined,
    avatarUrl:          finalAvatarUrl,
    verified:           p.verified         ?? false,
    isPrivate:          p.private          ?? false,
    isBusinessAccount:  p.isBusinessAccount ?? false,
    instagramId:        p.id ? String(p.id) : undefined,
    externalUrl:        p.externalUrl ?? p.externalUrls?.[0]?.url ?? undefined,
    status:      'approved',
    source:      'scraper',
    enrichStatus: 'done',
  });
  await convexMutation('candidates:markEnriched', { handle: `@${p.username ?? username}` });

  console.log(`✓  ${finalAvatarUrl}`);
}

async function main() {
  console.log(`Re-scraping ${HANDLES.length} profiles with expired avatar URLs...\n`);
  let ok = 0, fail = 0;
  for (const h of HANDLES) {
    try {
      await scrapeAndUpdate(h);
      ok++;
    } catch (e) {
      console.log(`✗  ${e.message}`);
      fail++;
    }
  }
  console.log(`\nDone: ${ok} updated, ${fail} failed`);
}

main().catch(e => { console.error(e); process.exit(1); });
