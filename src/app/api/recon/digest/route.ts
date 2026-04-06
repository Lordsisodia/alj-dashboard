import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL          = 'qwen/qwen3.6-plus:free';

export async function POST(req: NextRequest) {
  const { stats } = await req.json();

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({ error: 'OPENROUTER_API_KEY not set' }, { status: 500 });
  }

  const prompt = `You are ORACLE, an OFM (OnlyFans Management) content intelligence analyst.
Generate a sharp weekly digest based on this real scraped data from the last 7 days.

DATA:
- Total posts scraped: ${stats.totalPosts}
- Accounts tracked: ${stats.accountCount}
- Top niche by engagement: ${stats.topNiche} (${stats.topNicheER}% avg ER)
- Top format: ${stats.topFormat} (${stats.topFormatER}% avg ER)
- Top hook: "${stats.topHook}" by ${stats.topHookHandle}
- Avg engagement rate across all posts: ${stats.avgER}%
- Outlier posts (viral): ${stats.outlierCount}
- Most active account: ${stats.mostActiveHandle} (${stats.mostActivePosts} posts this week)
- Top performing post: "${stats.topPostHook}" - ${stats.topPostLikes} likes, ${stats.topPostViews} views

Write a 4-6 sentence weekly intelligence digest in the voice of a sharp OFM strategist.
Structure it as: 1) What's trending this week, 2) Top performer callout, 3) The hook/format that's winning, 4) One actionable recommendation.
Be specific, use the real numbers, keep it punchy. No bullet points - flowing prose only.`;

  const orRes = await fetch(OPENROUTER_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      model:  MODEL,
      stream: true,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 400,
      temperature: 0.7,
    }),
  });

  if (!orRes.ok) {
    const err = await orRes.text();
    return NextResponse.json({ error: err }, { status: orRes.status });
  }

  // Stream SSE from OpenRouter → client
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      const reader = orRes.body!.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') { controller.close(); return; }
          try {
            const json  = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) controller.enqueue(encoder.encode(delta));
          } catch { /* skip malformed chunks */ }
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
