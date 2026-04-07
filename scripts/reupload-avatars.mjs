/**
 * Re-uploads existing Instagram CDN avatar URLs to R2 for permanent storage.
 * Run: node scripts/reupload-avatars.mjs
 */
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const envPath = resolve(new URL('.', import.meta.url).pathname, '../.env.local');
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8').split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => { const i = l.indexOf('='); return [l.slice(0,i).trim(), l.slice(i+1).trim()]; })
);

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

async function convexQuery(name, args = {}) {
  const res = await fetch(`${CONVEX_URL}/api/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: name, args, format: 'json' }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json.value;
}

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
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  const buffer      = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get('content-type') ?? 'image/jpeg';
  const ext         = contentType.includes('png') ? 'png' : 'jpg';
  const key         = `avatars/ig/${username}.${ext}`;
  await r2.send(new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: buffer, ContentType: contentType }));
  return `${R2_PUBLIC_BASE}/${key}`;
}

async function main() {
  console.log('Fetching approved candidates...');
  const candidates = await convexQuery('candidates:list', { status: 'approved' });

  const needsUpload = candidates.filter(c =>
    c.avatarUrl && !c.avatarUrl.includes('r2.dev')
  );

  console.log(`Found ${needsUpload.length} profiles with non-R2 avatars\n`);

  let ok = 0, fail = 0;
  for (const c of needsUpload) {
    const username = c.handle.replace('@', '');
    process.stdout.write(`  ${c.handle} ... `);
    try {
      const r2Url = await uploadToR2(username, c.avatarUrl);
      await convexMutation('candidates:upsert', {
        handle:      c.handle,
        displayName: c.displayName,
        status:      c.status,
        source:      c.source,
        avatarUrl:   r2Url,
        enrichStatus: 'done',
      });
      console.log(`✓  ${r2Url}`);
      ok++;
    } catch (e) {
      console.log(`✗  ${e.message}`);
      fail++;
    }
  }

  console.log(`\nDone: ${ok} uploaded, ${fail} failed`);
}

main().catch(e => { console.error(e); process.exit(1); });
