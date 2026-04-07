import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import type { FunctionReference } from 'convex/server';
import { api } from '@/convex/_generated/api';

const OPENROUTER_API = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'google/gemini-3.1-flash-lite-preview';

// ── Convex fetch helper ────────────────────────────────────────────────────────

async function fetchFromConvex<T>(query: FunctionReference<"query">, args?: Record<string, unknown>): Promise<T> {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) throw new Error('NEXT_PUBLIC_CONVEX_URL not set');
  const client = new ConvexHttpClient(url);
  return args ? (client.query(query, args) as Promise<T>) : (client.query(query) as Promise<T>);
}

// ── Prompt builder ─────────────────────────────────────────────────────────────

function buildPrompt(logs: Array<{
  agentId: string; stage: string; status: string;
  model: string; provider: string; latencyMs: number;
  tokens?: { input: number; output: number; total: number }; timestamp: number;
}>) {
  const totalTokens = logs.reduce((s, l) => s + (l.tokens?.total ?? 0), 0);
  const totalLatency = logs.reduce((s, l) => s + l.latencyMs, 0);
  const errors = logs.filter(l => l.status === 'error');

  const byAgent = logs.reduce<Record<string, number>>((acc, l) => {
    acc[l.agentId] = (acc[l.agentId] ?? 0) + 1;
    return acc;
  }, Object.create(null));

  const agentList = Object.entries(byAgent)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => `  - ${name}: ${count} calls`)
    .join('\n');

  return `You are an AI operations analyst. Summarise this agent debug log data for the past 24 hours.

Data summary:
- Total calls: ${logs.length}
- Total tokens used: ${totalTokens.toLocaleString()}
- Average latency: ${logs.length > 0 ? Math.round(totalLatency / logs.length) : 0}ms
- Errors: ${errors.length}
- Calls by agent:
${agentList}

Respond ONLY with a valid JSON object (no markdown, no commentary) with this exact shape:
{
  "headline": "One-sentence summary of today's agent activity (max 15 words)",
  "totalCalls": number,
  "totalTokens": number,
  "successRate": "X% of calls succeeded",
  "avgLatencyMs": number,
  "topAgents": ["agentName1", "agentName2", "agentName3"],
  "highlights": ["First key observation", "Second key observation", "Third key observation"],
  "warnings": ["First warning or null", "Second warning or null"],
  "verdict": "ONE sentence — overall health assessment of the agent fleet today"
}`;
}

// ── Route ─────────────────────────────────────────────────────────────────────

export async function GET() {
  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({ error: 'OPENROUTER_API_KEY not set' }, { status: 500 });
  }

  try {
    // Fetch last 24h of debug logs (up to 500 entries)
    const logs = await fetchFromConvex<Array<{
      agentId: string; stage: string; status: string;
      model: string; provider: string; latencyMs: number;
      tokens?: { input: number; output: number; total: number }; timestamp: number;
    }>>(api.agentDebugLogs.list, { limit: 500 });

    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    const recent = logs.filter(l => l.timestamp >= cutoff);

    if (recent.length === 0) {
      return NextResponse.json({
        headline: 'No agent activity in the past 24 hours',
        totalCalls: 0, totalTokens: 0,
        successRate: '100% (no data)',
        avgLatencyMs: 0, topAgents: [], highlights: [], warnings: [],
        verdict: 'Fleet is quiet — no activity detected in the past 24 hours.',
      });
    }

    const prompt = buildPrompt(recent);

    const res = await fetch(OPENROUTER_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: [{ type: 'text', text: prompt }] }],
        max_tokens: 600,
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: res.status });
    }

    const data = await res.json();
    let raw: string = data.choices?.[0]?.message?.content ?? '';

    // Strip markdown fences if present
    const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) raw = fenceMatch[1].trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) raw = jsonMatch[0];

    let parsed: {
      headline: string; totalCalls: number; totalTokens: number;
      successRate: string; avgLatencyMs: number; topAgents: string[];
      highlights: string[]; warnings: (string | null)[]; verdict: string;
    };

    try { parsed = JSON.parse(raw); }
    catch {
      return NextResponse.json({ error: 'Non-JSON LLM response', raw }, { status: 502 });
    }

    // Filter nulls from warnings
    const warnings = (parsed.warnings ?? []).filter(Boolean) as string[];

    return NextResponse.json({ ...parsed, callCount: recent.length });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
