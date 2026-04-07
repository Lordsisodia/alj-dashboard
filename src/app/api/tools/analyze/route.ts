import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { DEFAULT_ANALYSIS_PROMPT } from '../../../../features/tools/constants';

const OPENROUTER_API  = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL           = 'google/gemini-3.1-flash-lite-preview';
const MAX_VIDEO_BYTES = 15 * 1024 * 1024;

// ── Debug log helper ──────────────────────────────────────────────────────────

async function saveDebugLog(args: {
  agentId:   string;
  stage:     string;
  input:     string;
  output:    string;
  latencyMs: number;
  status:    'ok' | 'error';
  error?:    string;
  tokens?:   { input: number; output: number; total: number };
}) {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) return;
  try {
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
    await convex.mutation(api.agentDebugLogs.save, {
      ...args,
      model:    MODEL,
      provider: 'openrouter',
    });
  } catch { /* never fail the main request over a debug log */ }
}

// ── Initial analysis ──────────────────────────────────────────────────────────

async function runInitialAnalysis(
  videoUrl: string,
  systemPrompt: string,
  label: string | undefined,
): Promise<NextResponse> {
  const contentParts: object[] = [];

  try {
    const videoRes = await fetch(videoUrl, { signal: AbortSignal.timeout(30_000) });
    if (videoRes.ok) {
      const buf = await videoRes.arrayBuffer();
      if (buf.byteLength <= MAX_VIDEO_BYTES) {
        const b64 = Buffer.from(buf).toString('base64');
        contentParts.push({ type: 'image_url', image_url: { url: `data:video/mp4;base64,${b64}` } });
      }
    }
  } catch { /* continue text-only */ }

  contentParts.push({ type: 'text', text: systemPrompt });

  const payload = JSON.stringify({ model: MODEL, messages: [{ role: 'user', content: contentParts }] });
  const t0 = Date.now();

  const orRes = await fetch(OPENROUTER_API, {
    method:  'POST',
    headers: { 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' },
    body:    payload,
  });
  const latencyMs = Date.now() - t0;

  if (!orRes.ok) {
    const errText = await orRes.text();
    void saveDebugLog({ agentId: 'analyser', stage: 'api_call', input: systemPrompt, output: errText, latencyMs, status: 'error', error: errText });
    return NextResponse.json({ error: errText }, { status: orRes.status });
  }

  const data = await orRes.json();
  let raw: string = data.choices?.[0]?.message?.content ?? '';

  const usage = data.usage as { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number } | undefined;
  const tokens = usage ? {
    input:  usage.prompt_tokens     ?? 0,
    output: usage.completion_tokens ?? 0,
    total:  usage.total_tokens      ?? 0,
  } : undefined;

  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) raw = fenceMatch[1].trim();
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (jsonMatch) raw = jsonMatch[0];

  let parsed: {
    transcript?: string | null;
    hookScore: number;
    hookLine: string;
    emotions: string[];
    breakdown: string;
    suggestions: string[];
  };

  try { parsed = JSON.parse(raw); }
  catch {
    void saveDebugLog({ agentId: 'analyser', stage: 'parse', input: systemPrompt, output: raw, latencyMs, status: 'error', error: 'Non-JSON response', tokens });
    return NextResponse.json({ error: 'Model returned non-JSON', raw }, { status: 502 });
  }

  const safe = {
    ...parsed,
    emotions:    Array.isArray(parsed.emotions)    ? parsed.emotions    : [],
    suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
    hookScore:   parsed.hookScore  ?? 0,
    hookLine:    parsed.hookLine   ?? '',
    breakdown:   parsed.breakdown  ?? '',
  };

  // Persist analysis + debug log to Convex in parallel
  let analysisId: string | undefined;
  if (process.env.NEXT_PUBLIC_CONVEX_URL) {
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
    const [saveResult] = await Promise.allSettled([
      convex.mutation(api.toolAnalyses.save, {
        label, videoUrl, systemPrompt, model: MODEL,
        transcript:  safe.transcript ?? undefined,
        hookScore:   safe.hookScore,
        hookLine:    safe.hookLine,
        emotions:    safe.emotions,
        breakdown:   safe.breakdown,
        suggestions: safe.suggestions,
      }),
      convex.mutation(api.agentDebugLogs.save, {
        agentId:   'analyser',
        stage:     'api_call',
        input:     systemPrompt,
        output:    raw,
        model:     MODEL,
        provider:  'openrouter',
        latencyMs,
        status:    'ok',
        tokens,
      }),
    ]);
    if (saveResult.status === 'fulfilled') {
      analysisId = saveResult.value as string;
    }
  }

  return NextResponse.json({ type: 'analysis', analysisId, ...safe });
}

// ── Follow-up chat ────────────────────────────────────────────────────────────

async function runChat(
  messages: { role: string; content: string }[],
): Promise<NextResponse> {
  const t0 = Date.now();
  const orRes = await fetch(OPENROUTER_API, {
    method:  'POST',
    headers: { 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, messages }),
  });
  const latencyMs = Date.now() - t0;

  if (!orRes.ok) {
    const errText = await orRes.text();
    void saveDebugLog({ agentId: 'analyser', stage: 'chat', input: messages.at(-1)?.content ?? '', output: errText, latencyMs, status: 'error', error: errText });
    return NextResponse.json({ error: errText }, { status: orRes.status });
  }

  const data  = await orRes.json();
  const text  = data.choices?.[0]?.message?.content ?? '';
  const usage = data.usage as { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number } | undefined;
  const tokens = usage ? { input: usage.prompt_tokens ?? 0, output: usage.completion_tokens ?? 0, total: usage.total_tokens ?? 0 } : undefined;

  void saveDebugLog({ agentId: 'analyser', stage: 'chat', input: messages.at(-1)?.content ?? '', output: text, latencyMs, status: 'ok', tokens });

  return NextResponse.json({ type: 'chat', text });
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({ error: 'OPENROUTER_API_KEY not set' }, { status: 500 });
  }

  const body = await req.json();

  if (body.messages) return runChat(body.messages);

  const { videoUrl, systemPrompt, label } = body as {
    videoUrl: string; systemPrompt?: string; label?: string;
  };
  if (!videoUrl) return NextResponse.json({ error: 'videoUrl required' }, { status: 400 });

  return runInitialAnalysis(videoUrl, systemPrompt?.trim() || DEFAULT_ANALYSIS_PROMPT, label);
}
