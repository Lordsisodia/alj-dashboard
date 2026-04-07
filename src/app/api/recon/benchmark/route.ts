import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL          = 'qwen/qwen3.6-plus:free';

export async function POST(req: NextRequest) {
  const { stats } = await req.json();

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({ error: 'OPENROUTER_API_KEY not set' }, { status: 500 });
  }

  const prompt = `You are ORACLE, an OFM content intelligence analyst.
Write a sharp engagement benchmark report based on this week's scraped data.

BENCHMARK DATA:
- Posts analysed: ${stats.totalPosts}
- Average ER across all posts: ${stats.avgER}%
- Top niche: ${stats.topNiche} (${stats.topNicheER}% avg ER)
- Weakest niche: ${stats.bottomNiche} (${stats.bottomNicheER}% avg ER)
- Best performing format: ${stats.topFormat} (${stats.topFormatER}% avg ER)
- "Exceptional" threshold (2× baseline): ${stats.excellentThreshold}%

Write 3-4 sentences: 1) What the baseline looks like this week and whether it's healthy, 2) What niche/format is pulling the average up, 3) What number a creator needs to hit to be considered exceptional this week.
Be specific and use real numbers. No bullet points — flowing prose only.`;

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
