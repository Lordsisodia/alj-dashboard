import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL          = 'google/gemini-2.0-flash-lite-001';
const MAX_VIDEO_BYTES = 15 * 1024 * 1024; // 15 MB - stay under OpenRouter inline limit

function buildPrompt(post: {
  handle: string; niche: string; contentType: string;
  caption: string; likes: number; views: number; saves: number; engagementRate: number;
  hasVideo: boolean;
}): string {
  return `You are an OFM content intelligence analyst. Analyze this ${post.contentType} by @${post.handle} (${post.niche} niche).
${post.hasVideo ? 'The video is attached. Watch it fully and extract the spoken transcript.' : 'No video available - analyze based on caption only.'}

Caption: "${post.caption}"
Stats: ${post.likes} likes · ${post.views} views · ${post.saves} saves · ${(post.engagementRate * 100).toFixed(2)}% ER

Return ONLY valid JSON (no markdown) with this exact shape:
{
  "transcript": "<verbatim spoken words from the video, or null if no video/speech>",
  "hookScore": <1-10 float, how strong the opening hook is>,
  "hookLine": "<the single most powerful line from the caption or video>",
  "emotions": ["<emotion1>", "<emotion2>"],
  "breakdown": "<2-3 sentence analysis of why this content works or doesn't>",
  "suggestions": ["<actionable tip 1>", "<actionable tip 2>"]
}`;
}

export async function POST(req: NextRequest) {
  const { post } = await req.json();

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({ error: 'OPENROUTER_API_KEY not set' }, { status: 500 });
  }

  const contentParts: object[] = [];

  // Attempt to attach video inline if R2 URL exists and is small enough
  if (post.videoUrl) {
    try {
      const videoRes = await fetch(post.videoUrl, { signal: AbortSignal.timeout(20_000) });
      if (videoRes.ok) {
        const buf = await videoRes.arrayBuffer();
        if (buf.byteLength <= MAX_VIDEO_BYTES) {
          const b64 = Buffer.from(buf).toString('base64');
          contentParts.push({
            type: 'image_url',
            image_url: { url: `data:video/mp4;base64,${b64}` },
          });
        }
      }
    } catch {
      // Video fetch failed - continue with text-only analysis
    }
  }

  contentParts.push({
    type: 'text',
    text: buildPrompt({
      handle:         post.handle,
      niche:          post.niche,
      contentType:    post.contentType,
      caption:        post.caption ?? '',
      likes:          post.likes   ?? 0,
      views:          post.views   ?? 0,
      saves:          post.saves   ?? 0,
      engagementRate: post.engagementRate ?? 0,
      hasVideo:       contentParts.length > 0,
    }),
  });

  const orRes = await fetch(OPENROUTER_API, {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      model:    MODEL,
      messages: [{ role: 'user', content: contentParts }],
      response_format: { type: 'json_object' },
      max_tokens: 800,
    }),
  });

  if (!orRes.ok) {
    const err = await orRes.text();
    return NextResponse.json({ error: err }, { status: orRes.status });
  }

  const data  = await orRes.json();
  const raw   = data.choices?.[0]?.message?.content ?? '{}';

  try {
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: 'Invalid JSON from model', raw }, { status: 502 });
  }
}
