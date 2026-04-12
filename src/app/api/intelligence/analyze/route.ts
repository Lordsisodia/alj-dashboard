import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API  = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL           = 'google/gemini-2.0-flash-lite-001';
const MAX_VIDEO_BYTES = 15 * 1024 * 1024;

// Post-context injected after the system prompt
function buildPostContext(post: {
  handle: string; niche: string; contentType: string;
  caption: string; likes: number; views: number; saves: number;
  engagementRate: number; hasVideo: boolean;
}): string {
  return `Now analyse this ${post.contentType} by @${post.handle} (${post.niche} niche).
${post.hasVideo ? 'The video is attached  -  watch it fully and extract the spoken transcript.' : 'No video available  -  analyse based on caption only.'}

Caption: "${post.caption}"
Stats: ${post.likes} likes · ${post.views} views · ${post.saves} saves · ${(post.engagementRate * 100).toFixed(2)}% ER

Return ONLY valid JSON (no markdown) with this exact shape:
{
  "transcript": "<verbatim spoken words from the video, or null if no video/speech>",
  "hookScore": <1-10 float>,
  "hookLine": "<the single most powerful line from the caption or video>",
  "emotions": ["<emotion1>", "<emotion2>"],
  "breakdown": "<2-3 sentence analysis>",
  "suggestions": ["<actionable tip 1>", "<actionable tip 2>"]
}`;
}

// Fallback when no custom system prompt is provided
function buildLegacyPrompt(post: Parameters<typeof buildPostContext>[0]): string {
  return `You are an OFM content intelligence analyst. ${buildPostContext(post)}`;
}

export async function POST(req: NextRequest) {
  const { post, systemPrompt } = await req.json();

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({ error: 'OPENROUTER_API_KEY not set' }, { status: 500 });
  }

  const videoParts: object[] = [];

  if (post.videoUrl) {
    try {
      const videoRes = await fetch(post.videoUrl, { signal: AbortSignal.timeout(20_000) });
      if (videoRes.ok) {
        const buf = await videoRes.arrayBuffer();
        if (buf.byteLength <= MAX_VIDEO_BYTES) {
          const b64 = Buffer.from(buf).toString('base64');
          videoParts.push({ type: 'image_url', image_url: { url: `data:video/mp4;base64,${b64}` } });
        }
      }
    } catch {
      // Video fetch failed  -  continue text-only
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

  let messages: object[];

  if (systemPrompt) {
    // Custom prompt: system message + user message with video + post context
    const userContent: object[] = [
      ...videoParts,
      { type: 'text', text: buildPostContext(postMeta) },
    ];
    messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userContent },
    ];
  } else {
    // Legacy: single user message with everything inline
    const content: object[] = [
      ...videoParts,
      { type: 'text', text: buildLegacyPrompt(postMeta) },
    ];
    messages = [{ role: 'user', content }];
  }

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
      max_tokens:      800,
    }),
  });

  if (!orRes.ok) {
    const err = await orRes.text();
    return NextResponse.json({ error: err }, { status: orRes.status });
  }

  const data = await orRes.json();
  const raw  = data.choices?.[0]?.message?.content ?? '{}';

  try {
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: 'Invalid JSON from model', raw }, { status: 502 });
  }
}
