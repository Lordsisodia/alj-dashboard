import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API  = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL           = 'google/gemini-2.0-flash-001';
const PROMPT_VERSION = 'v1';
const MAX_VIDEO_BYTES = 15 * 1024 * 1024;

function buildUserContent(post: {
  handle: string; niche: string; contentType: string;
  caption: string; likes: number; views: number; saves: number;
  engagementRate: number; hasVideo: boolean;
}): string {
  return `Analyse this ${post.contentType} by @${post.handle} (${post.niche} niche).
${post.hasVideo ? 'The video is attached - watch it fully before responding.' : 'No video available - analyse based on caption only.'}

Caption: "${post.caption}"
Stats: ${post.likes} likes · ${post.views} views · ${post.saves} saves · ${(post.engagementRate * 100).toFixed(2)}% ER

Return ONLY valid JSON matching the schema. Use EXACTLY the enum values listed — never invent values outside the closed lists. Default to "unknown" when uncertain.`;
}

const SYSTEM_PROMPT = `You are a structured video intelligence extractor for short-form social content (Instagram Reels, TikTok).
Your job: return a single JSON object with the exact fields below. Closed-vocabulary enums only — never use values outside the lists.

{
  "hookStructure": "question"|"shock_claim"|"negation"|"listicle"|"pov"|"before_after"|"visual_hook"|"transformation_tease"|"direct_command"|"storytime"|"other"|"unknown",
  "hookModality": "spoken"|"on_screen_text"|"visual_only"|"audio_cue"|"mixed"|"unknown",
  "firstFrameType": "face_closeup"|"face_medium"|"body_full"|"product"|"environment"|"text_card"|"action_in_progress"|"unknown",
  "spokenFirstWords": "<verbatim first 8-10 spoken words, or null>",
  "onScreenTextFirstFrame": "<verbatim text overlay visible in first 2 seconds, or null>",
  "curiosityGapPresent": true|false,
  "patternInterruptPresent": true|false,
  "directAddress": true|false,
  "hookDurationSec": <float — when setup ends and content begins, or null>,

  "formatPrimary": "talking_head"|"voiceover_b_roll"|"pov_action"|"transition_montage"|"lipsync"|"tutorial_demo"|"reaction"|"skit_scripted"|"text_on_screen_silent"|"product_showcase"|"thirst_trap_static"|"before_after_reveal"|"dance_performance"|"day_in_life_vlog"|"other"|"unknown",
  "setting": "home_bedroom"|"home_other"|"gym"|"outdoor_urban"|"outdoor_nature"|"studio"|"car"|"mirror"|"other"|"unknown",
  "creatorOnScreen": true|false,
  "faceVisibility": "full"|"partial"|"obscured"|"none"|"unknown",

  "energyLevel": <1-5 integer. 1=static/ASMR, 2=calm, 3=conversational, 4=punchy/high-energy, 5=chaotic/maximum-density>,
  "cutsPerSecondBucket": "low"|"med"|"high"|"extreme"|"unknown",
  "hasJumpCuts": true|false,
  "hasSpeedRamps": true|false,
  "hasZoomPunches": true|false,

  "hasSpokenWords": true|false,
  "hasVoiceover": true|false,
  "musicEnergy": "none"|"low"|"mid"|"high",
  "soundEffectsPresent": true|false,
  "speakingPace": "slow"|"normal"|"fast"|"rapid"|"unknown",

  "creatorExpressedEmotion": "neutral"|"confident"|"playful"|"seductive"|"intense"|"vulnerable"|"excited"|"deadpan"|"angry"|"joyful"|"unknown",
  "vibeKeyword": "aspirational"|"relatable"|"educational"|"provocative"|"cozy"|"hype"|"controversial"|"wholesome"|"premium"|"raw_authentic"|"humorous"|"motivational"|"sensual"|"unknown",

  "captionHasCTA": true|false,
  "captionAddsContext": true|false,
  "captionRepeatsVideo": true|false,
  "ctaType": "save"|"comment"|"share"|"follow"|"dm"|"link_bio"|"none"|"unknown",
  "captionLengthBucket": "short"|"medium"|"long",
  "hashtagCount": <integer or null>,

  "transcript": "<full verbatim spoken words, or null>",
  "onScreenTextFull": "<all on-screen text concatenated with newlines, or null>",

  "extractionConfidence": <1-5 integer — 5=very certain, 1=mostly guessing>,
  "extractionFlags": ["<comma-separated issues e.g. audio_unclear, video_unavailable, low_quality, non_english>"]
}`;

export async function POST(req: NextRequest) {
  const { post } = await req.json();

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({ error: 'OPENROUTER_API_KEY not set' }, { status: 500 });
  }

  const videoParts: object[] = [];

  if (post.videoUrl) {
    try {
      const videoRes = await fetch(post.videoUrl, {
        signal: AbortSignal.timeout(20_000),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Referer':    'https://www.instagram.com/',
          'Accept':     'video/mp4,video/*;q=0.9,*/*;q=0.8',
        },
      });
      if (videoRes.ok) {
        const buf = await videoRes.arrayBuffer();
        if (buf.byteLength <= MAX_VIDEO_BYTES) {
          const b64 = Buffer.from(buf).toString('base64');
          videoParts.push({ type: 'image_url', image_url: { url: `data:video/mp4;base64,${b64}` } });
        }
      }
    } catch {
      // Video unavailable — text-only analysis, flagged below
    }
  }

  const postMeta = {
    handle:         post.handle,
    niche:          post.niche,
    contentType:    post.contentType,
    caption:        post.caption ?? '',
    likes:          post.likes   ?? 0,
    views:          post.views   ?? 0,
    saves:          post.saves   ?? 0,
    engagementRate: post.engagementRate ?? 0,
    hasVideo:       videoParts.length > 0,
  };

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user',   content: [...videoParts, { type: 'text', text: buildUserContent(postMeta) }] },
  ];

  const orRes = await fetch(OPENROUTER_API, {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      model:           MODEL,
      messages,
      response_format: { type: 'json_object' },
      max_tokens:      2000,
      temperature:     0,
    }),
  });

  if (!orRes.ok) {
    const err = await orRes.text();
    return NextResponse.json({ error: err }, { status: orRes.status });
  }

  const data = await orRes.json();
  const raw  = data.choices?.[0]?.message?.content ?? '{}';

  try {
    const parsed = JSON.parse(raw);
    const flags: string[] = Array.isArray(parsed.extractionFlags) ? parsed.extractionFlags : [];
    if (videoParts.length === 0 && !flags.includes('video_unavailable')) flags.push('video_unavailable');

    return NextResponse.json({
      ...parsed,
      extractionFlags:  flags,
      extractionModel:  MODEL,
      promptVersion:    PROMPT_VERSION,
      rawResponse:      raw,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON from model', raw }, { status: 502 });
  }
}
