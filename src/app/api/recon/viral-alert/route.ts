import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL          = 'qwen/qwen3.6-plus:free';

export async function POST(req: NextRequest) {
  const { outliers, avgER } = await req.json();

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({ error: 'OPENROUTER_API_KEY not set' }, { status: 500 });
  }

  const outlierLines = (outliers as { handle: string; hook: string; outlierRatio: number; likes: number; views: number; niche: string }[])
    .map((o, i) => `${i + 1}. ${o.handle} (${o.niche}) - ${o.outlierRatio}x baseline | ${o.likes.toLocaleString()} likes, ${o.views.toLocaleString()} views | Hook: "${o.hook}"`)
    .join('\n');

  const prompt = `You are ORACLE, an OFM content intelligence analyst.
Analyse these viral posts from the last 7 days and write a sharp alert about what's spiking and why.

BASELINE ENGAGEMENT RATE: ${avgER}%

TOP OUTLIER POSTS (ranked by viral multiplier above baseline):
${outlierLines}

Write 3-4 punchy sentences: 1) Which account/post is the biggest spike and by how much, 2) What the hook pattern is across the top posts, 3) One actionable takeaway — what to replicate.
Be specific, use the real handles and numbers. No bullet points — flowing prose only.`;

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
      max_tokens:  300,
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
