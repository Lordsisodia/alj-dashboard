/**
 * Batch analysis script — runs v1 + v2 analysis on all queued posts with R2 video URLs
 * Usage: node scripts/batch-analyze.mjs
 */

import { execSync } from 'child_process';

const API = 'http://localhost:3001';
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
const DELAY_MS = 1200; // gap between posts to avoid rate limits

if (!CONVEX_URL) {
  const env = execSync('grep NEXT_PUBLIC_CONVEX_URL /Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard/.env.local').toString().trim();
  process.env.NEXT_PUBLIC_CONVEX_URL = env.split('=')[1];
}

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || execSync(
  "grep NEXT_PUBLIC_CONVEX_URL /Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard/.env.local"
).toString().trim().split('=')[1];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function convexQuery(fn, args = {}) {
  const res = await fetch(`${convexUrl}/api/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: fn, args, format: 'json' }),
  });
  const data = await res.json();
  return data.value;
}

async function convexMutation(fn, args) {
  const res = await fetch(`${convexUrl}/api/mutation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: fn, args, format: 'json' }),
  });
  return res.json();
}

async function analyzePost(post) {
  // v1 analysis
  const v1Res = await fetch(`${API}/api/intelligence/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ post }),
  });
  if (v1Res.ok) {
    const v1 = await v1Res.json();
    await convexMutation('intelligence:patchAnalysis', {
      postId:      post._id,
      transcript:  v1.transcript ?? undefined,
      hookScore:   v1.hookScore  ?? 5,
      hookLine:    v1.hookLine   ?? '',
      emotions:    v1.emotions   ?? [],
      breakdown:   v1.breakdown  ?? '',
      suggestions: v1.suggestions ?? [],
    });
    process.stdout.write(` v1✓(${(v1.hookScore ?? 0).toFixed(1)})`);
  } else {
    process.stdout.write(` v1✗`);
  }

  // v2 feature vector
  const v2Res = await fetch(`${API}/api/intelligence/analyze-v2`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ post }),
  });
  if (v2Res.ok) {
    const v2 = await v2Res.json();
    await convexMutation('intelligence:insertAnalysisV2', {
      postId:                  post._id,
      handle:                  post.handle,
      niche:                   post.niche,
      outlierRatio:            post.outlierRatio,
      engagementRate:          post.engagementRate,
      views:                   post.views  ?? 0,
      saves:                   post.saves  ?? 0,
      likes:                   post.likes  ?? 0,
      hookStructure:           v2.hookStructure,
      hookModality:            v2.hookModality,
      firstFrameType:          v2.firstFrameType,
      spokenFirstWords:        v2.spokenFirstWords ?? undefined,
      onScreenTextFirstFrame:  v2.onScreenTextFirstFrame ?? undefined,
      curiosityGapPresent:     v2.curiosityGapPresent,
      patternInterruptPresent: v2.patternInterruptPresent,
      directAddress:           v2.directAddress,
      hookDurationSec:         v2.hookDurationSec ?? undefined,
      formatPrimary:           v2.formatPrimary,
      setting:                 v2.setting,
      creatorOnScreen:         v2.creatorOnScreen,
      faceVisibility:          v2.faceVisibility,
      energyLevel:             v2.energyLevel,
      cutsPerSecondBucket:     v2.cutsPerSecondBucket,
      hasJumpCuts:             v2.hasJumpCuts,
      hasSpeedRamps:           v2.hasSpeedRamps,
      hasZoomPunches:          v2.hasZoomPunches,
      hasSpokenWords:          v2.hasSpokenWords,
      hasVoiceover:            v2.hasVoiceover,
      musicEnergy:             v2.musicEnergy,
      soundEffectsPresent:     v2.soundEffectsPresent,
      speakingPace:            v2.speakingPace,
      creatorExpressedEmotion: v2.creatorExpressedEmotion,
      vibeKeyword:             v2.vibeKeyword,
      captionHasCTA:           v2.captionHasCTA,
      captionAddsContext:      v2.captionAddsContext,
      captionRepeatsVideo:     v2.captionRepeatsVideo,
      ctaType:                 v2.ctaType,
      captionLengthBucket:     v2.captionLengthBucket,
      hashtagCount:            typeof v2.hashtagCount === 'number' ? v2.hashtagCount : undefined,
      transcript:              v2.transcript ?? undefined,
      onScreenTextFull:        v2.onScreenTextFull ?? undefined,
      extractionConfidence:    v2.extractionConfidence,
      extractionFlags:         v2.extractionFlags ?? [],
      extractionModel:         v2.extractionModel,
      promptVersion:           v2.promptVersion,
      rawResponse:             v2.rawResponse ?? undefined,
    });
    process.stdout.write(` v2✓(conf:${v2.extractionConfidence})\n`);
  } else {
    process.stdout.write(` v2✗\n`);
  }
}

async function main() {
  console.log('Fetching analysis queue...');
  const posts = await convexQuery('intelligence:getAnalysisQueue', { days: 365, limit: 100 });

  const r2Posts = posts.filter(p => p.videoUrl?.startsWith('https://pub-'));
  console.log(`Found ${r2Posts.length} posts with R2 video URLs\n`);

  let done = 0;
  for (const post of r2Posts) {
    process.stdout.write(`[${++done}/${r2Posts.length}] ${post.handle} (${post.niche}, ${post.outlierRatio?.toFixed(1)}×)`);
    try {
      await analyzePost(post);
    } catch (err) {
      process.stdout.write(` ERROR: ${err.message}\n`);
    }
    if (done < r2Posts.length) await sleep(DELAY_MS);
  }

  console.log(`\nDone. ${done} posts analysed.`);
}

main().catch(console.error);
