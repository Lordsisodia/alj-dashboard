import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API = 'https://openrouter.ai/api/v1/chat/completions';

// Models tried in order - gemini-flash-lite is ~$0.0001/call and reliable
const FREE_MODELS = [
  'google/gemini-2.0-flash-lite-001',
  'google/gemini-flash-1.5-8b',
  'meta-llama/llama-3.1-8b-instruct:free',
  'qwen/qwen3.6-plus:free',
];

export async function POST(req: NextRequest) {
  const { candidate } = await req.json();

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({ error: 'OPENROUTER_API_KEY not set' }, { status: 500 });
  }

  const prompt = `You are ORACLE, an OFM (OnlyFans Management) talent scout AI.
Evaluate this Instagram creator candidate for potential partnership/tracking.

CANDIDATE DATA:
- Handle: ${candidate.handle}
- Niche: ${candidate.niche}
- Followers: ${candidate.followers}
- Avg Views: ${candidate.avgViews?.toLocaleString() ?? 'unknown'}
- Outlier Ratio: ${candidate.outlierRatio}x (views/followers - higher = algorithm pushing them)
- Engagement Rate: ${candidate.engagementRate}
- Posts/Week: ${candidate.postsPerWeek}

SCORING CRITERIA:
- Outlier ratio ≥2.0 = algorithm is actively pushing them (very good)
- Outlier ratio 1.0-1.9 = solid but not breakout
- Consistent post cadence (≥3/week) = reliable
- High ER in OFM niches (GFE, Lifestyle, Fitness) = monetisable audience

Return ONLY valid JSON, no markdown:
{"verdict":"HIRE"|"WATCH"|"PASS","score":<1-10>,"reason":"<one punchy sentence>"}`;

  let lastError = '';

  for (const model of FREE_MODELS) {
    try {
      const orRes = await fetch(OPENROUTER_API, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type':  'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          max_tokens: 120,
          temperature: 0.3,
        }),
      });

      if (orRes.status === 429 || orRes.status === 503) {
        lastError = `${model} rate-limited`;
        continue; // try next model
      }

      if (!orRes.ok) {
        lastError = `${model}: ${orRes.status}`;
        continue;
      }

      const data = await orRes.json();
      const raw  = data.choices?.[0]?.message?.content ?? '{}';

      try {
        return NextResponse.json(JSON.parse(raw));
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
