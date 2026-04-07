import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL          = 'qwen/qwen3.6-plus:free';

export async function POST(req: NextRequest) {
  const { stats } = await req.json();

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({ error: 'OPENROUTER_API_KEY not set' }, { status: 500 });
  }

  const prompt = `You are ORACLE, an OFM content intelligence analyst.
Write a sharp creator spotlight based on this week's top performer from scraped data.

CREATOR DATA:
- Handle: ${stats.handle}
- Niche: ${stats.niche}
- Posts in top 15 this week: ${stats.postCount}
- Avg engagement rate: ${stats.avgER}%
- Top hook: "${stats.topHook}"
- Top post: ${stats.topLikes.toLocaleString()} likes, ${stats.topViews.toLocaleString()} views

Write 3-4 sentences: 1) Why this creator is this week's standout, 2) What their hook/content pattern is, 3) The specific thing other creators should steal from them.
Be direct and specific. Use the real handle. No bullet points — flowing prose only.`;

  const orRes = await fetch(OPENROUTER_API, {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      model:       MODEL,
      stream:      true,
      messages:    [{ role: 'user', content: prompt }],
      max_tokens:  280,
      temperature: 0.7,
    }),
  });

  if (!orRes.ok) {
    const err = await orRes.text();
    return NextResponse.json({ error: err }, { status: orRes.status });
  }

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      const reader  = orRes.body!.getReader();
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
