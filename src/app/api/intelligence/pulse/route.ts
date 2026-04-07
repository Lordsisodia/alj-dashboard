import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { TrendsData } from '@/features/intelligence/trendsTypes';
import type { InsightsData } from '@/features/intelligence/insightsTypes';

const client = new Anthropic({
  apiKey:  process.env.MINIMAX_API_KEY!,
  baseURL: process.env.MINIMAX_BASE_URL ?? 'https://api.minimax.io/anthropic',
});

const MODEL = process.env.MINIMAX_MODEL ?? 'MiniMax-M2.7-highspeed';

interface PulseRequest {
  stats: {
    postsThisWeek: number;
    postsLastWeek: number;
    unanalysedCount: number;
    totalIndexed: number;
    latestScrapeAt: number;
  } | null;
  trends: TrendsData | null;
  hookStats: {
    scoreDistribution: { label: string; count: number }[];
    emotionFrequency: { emotion: string; count: number; avgER: number }[];
    hookLines: { hookLine: string; hookScore: number; handle: string; niche: string; engagementRate: number }[];
  } | null;
  insights: InsightsData | null;
}

function buildPulsePrompt(req: PulseRequest): string {
  const s = req.stats;
  const t = req.trends;
  const h = req.hookStats;
  const i = req.insights;

  const weekDelta = s ? s.postsThisWeek - s.postsLastWeek : 0;
  const topFormat = t?.formatStats[0];
  const topNiche = t?.nicheStats[0];
  const topHook = t?.topHooks[0];
  const topOutlier = t?.outlierPosts[0];
  const topEmotions = h?.emotionFrequency.slice(0, 5) ?? [];
  const saveRate = i
    ? Math.round((i.summary.saveCount / Math.max(i.summary.totalRatings, 1)) * 100)
    : null;

  return `You are ISSO Intelligence - an AI strategist for an OnlyFans Management agency. Generate a structured weekly pulse report. Be direct and tactical.

Return ONLY valid JSON (no markdown, no commentary) with this exact shape:
{
  "topTrends": ["<trend 1>", "<trend 2>", "<trend 3>"],
  "hookPatterns": ["<pattern 1>", "<pattern 2>", "<pattern 3>"],
  "outliers": ["<outlier observation 1>", "<outlier observation 2>"],
  "recommendations": ["<recommendation 1>", "<recommendation 2>", "<recommendation 3>"]
}

## This Week's Data
- Posts scraped: ${s?.postsThisWeek ?? 0} (${weekDelta >= 0 ? '+' : ''}${weekDelta} vs last week)
- Total indexed: ${s?.totalIndexed ?? 0}
- Needs analysis: ${s?.unanalysedCount ?? 0}
- Avg engagement rate: ${t ? (t.avgER * 100).toFixed(2) : 'N/A'}%
- Top format: ${topFormat?.format ?? 'N/A'} at ${topFormat ? (topFormat.avgER * 100).toFixed(1) : 'N/A'}% ER
- Top niche: ${topNiche?.niche ?? 'N/A'} at ${topNiche ? (topNiche.avgER * 100).toFixed(1) : 'N/A'}% ER
- #1 outlier: @${topOutlier?.handle ?? 'N/A'} (${topOutlier?.outlierRatio?.toFixed(1) ?? 'N/A'}× baseline)
${topHook ? `- Best hook: "${topHook.hook?.slice(0, 80) ?? 'N/A'}"` : ''}
${topEmotions.length ? `- Top emotions: ${topEmotions.map(e => e.emotion).join(', ')}` : ''}
${saveRate !== null ? `- Team save rate: ${saveRate}%` : ''}

## Top Hook Lines (by ER)
${h?.hookLines.slice(0, 5).map((l, i) => `${i + 1}. "${l.hookLine?.slice(0, 80) ?? ''}" — ${l.handle} (${(l.engagementRate * 100).toFixed(1)}% ER)`).join('\n') ?? 'N/A'}

## Format Breakdown
${t?.formatStats.map(f => `- ${f.format}: ${(f.avgER * 100).toFixed(1)}% ER (${f.count} posts)`).join('\n') ?? 'N/A'}

## Niche Breakdown
${t?.nicheStats.slice(0, 6).map(n => `- ${n.niche}: ${(n.avgER * 100).toFixed(1)}% ER (${n.count} posts)`).join('\n') ?? 'N/A'}`;
}

export async function POST(req: NextRequest) {
  const body: PulseRequest = await req.json();

  if (!process.env.MINIMAX_API_KEY) {
    return NextResponse.json({ error: 'MINIMAX_API_KEY not set' }, { status: 500 });
  }

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: 'You are ISSO Intelligence. Return ONLY valid JSON matching the requested schema. No markdown, no explanation, just the JSON object.',
    messages: [{ role: 'user', content: buildPulsePrompt(body) }],
  });

  const raw = message.content[0].type === 'text' ? message.content[0].text : '{}';

  try {
    const parsed = JSON.parse(raw);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON from model', raw }, { status: 502 });
  }
}
