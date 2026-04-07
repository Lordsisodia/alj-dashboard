import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const OPENROUTER_API = 'https://openrouter.ai/api/v1/chat/completions';

// Try free models in order — gemini-flash-lite is ~$0.0001/M tokens
const FREE_MODELS = [
  'google/gemini-3.1-flash-lite-preview',
  'google/gemini-2.0-flash-lite-001',
  'google/gemini-flash-1.5-8b',
  'meta-llama/llama-3.1-8b-instruct:free',
  'qwen/qwen3.6-plus:free',
];

export async function POST(req: NextRequest) {
  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({ error: 'OPENROUTER_API_KEY not set' }, { status: 500 });
  }

  const {
    handle,
    displayName,
    niche,
    followerCount,
    engagementRate,
    postsThisWeek,
    postsCount,
    followsCount,
    verified,
    bio,
    source,
  } = await req.json();

  const prompt = `You are ORACLE, an OnlyFans Management scout AI. Analyse this Instagram creator and produce a structured creator brief.

CREATOR DATA:
- Handle: ${handle}
- Display Name: ${displayName}
- Niche: ${niche}
- Followers: ${followerCount?.toLocaleString() ?? 'unknown'}
- Following: ${followsCount?.toLocaleString() ?? 'unknown'}
- Posts on profile: ${postsCount ?? 'unknown'}
- Avg engagement rate: ${engagementRate ?? 'unknown'}
- Posts this week: ${postsThisWeek ?? 0}
- Verified: ${verified ? 'Yes' : 'No'}
- Bio: ${bio || 'not available'}
- Source: ${source || 'unknown'}

TASK:
Score each dimension 1-10 and write a 1-2 sentence recommendation. Also identify 2-3 top hooks this creator uses (exact phrases from bio or typical for their niche) and 2-3 content patterns they follow.

Return ONLY valid JSON, no markdown, no explanation:
{
  "contentScore": <1-10>,
  "consistencyScore": <1-10>,
  "monetizationRating": <1-10>,
  "overallVerdict": "<HIRE|WATCH|PASS>",
  "recommendation": "<1-2 sentence verdict>",
  "topHooks": ["<hook 1>", "<hook 2>", "<hook 3>"],
  "contentPatterns": ["<pattern 1>", "<pattern 2>", "<pattern 3>"]
}`;

  let lastError = '';

  for (const model of FREE_MODELS) {
    try {
      const orRes = await fetch(OPENROUTER_API, {
        method:  'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type':  'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          max_tokens: 280,
          temperature: 0.5,
        }),
      });

      if (orRes.status === 429 || orRes.status === 503) {
        lastError = `${model} rate-limited`;
        continue;
      }
      if (!orRes.ok) {
        lastError = `${model}: ${orRes.status}`;
        continue;
      }

      const data = await orRes.json();
      const raw = data.choices?.[0]?.message?.content ?? '{}';

      try {
        const parsed = JSON.parse(raw);

        // Save to Convex
        if (process.env.NEXT_PUBLIC_CONVEX_URL) {
          const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
          const savedId = await convex.mutation(api.creatorBriefs.save, {
            handle,
            displayName,
            niche,
            contentScore:       parsed.contentScore       ?? 5,
            consistencyScore:   parsed.consistencyScore   ?? 5,
            monetizationRating: parsed.monetizationRating ?? 5,
            topHooks:           Array.isArray(parsed.topHooks) ? parsed.topHooks.slice(0, 3) : [],
            contentPatterns:    Array.isArray(parsed.contentPatterns) ? parsed.contentPatterns.slice(0, 3) : [],
            overallVerdict:     parsed.overallVerdict    ?? 'WATCH',
            recommendation:     parsed.recommendation     ?? '',
            followerCount:      followerCount ?? 0,
            engagementRate:     engagementRate ?? 0,
            postsThisWeek:      postsThisWeek ?? 0,
            source:             source ?? 'unknown',
            generatedAt:        Date.now(),
          });
          return NextResponse.json({ ...parsed, _id: savedId });
        }

        return NextResponse.json(parsed);
      } catch {
        lastError = `${model}: bad JSON`;
        continue;
      }
    } catch (e) {
      lastError = String(e);
      continue;
    }
  }

  return NextResponse.json({ error: `All models failed. Last: ${lastError}` }, { status: 502 });
}
