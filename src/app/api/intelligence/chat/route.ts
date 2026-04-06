import Anthropic from '@anthropic-ai/sdk';
import type { TrendsData }   from '@/features/intelligence/types';
import type { InsightsData } from '@/features/intelligence/types';

const client = new Anthropic({
  apiKey:  process.env.MINIMAX_API_KEY!,
  baseURL: process.env.MINIMAX_BASE_URL ?? 'https://api.minimax.io/anthropic',
});

const MODEL = process.env.MINIMAX_MODEL ?? 'MiniMax-M2.7-highspeed';

function buildSystemPrompt(data: TrendsData | null, insights: InsightsData | null): string {
  const base = `You are ISSO Intelligence - an AI analyst for an OnlyFans Management agency.
You have access to real scraped post data AND team curation ratings. Be concise and direct. Answer like a sharp strategist, not a chatbot. Keep answers under 3 sentences unless asked for detail.`;

  if (!data) return base;

  const topFormat  = data.formatStats[0];
  const topNiche   = data.nicheStats[0];
  const topHook    = data.topHooks[0];
  const topOutlier = data.outlierPosts[0];

  const trendsSection = `
## Scraped Post Analytics (${data.totalPosts} posts)
- Avg engagement rate: ${(data.avgER * 100).toFixed(2)}%
- Outliers (outperforming baseline): ${data.outlierPosts.length} posts
- Top format: ${topFormat?.format ?? 'N/A'} - ${((topFormat?.avgER ?? 0) * 100).toFixed(1)}% ER (${topFormat?.count ?? 0} posts)
- Top niche: ${topNiche?.niche ?? 'N/A'} - ${((topNiche?.avgER ?? 0) * 100).toFixed(1)}% ER
- Top hook: "${topHook?.hook ?? 'N/A'}" - ${((topHook?.engagementRate ?? 0) * 100).toFixed(1)}% ER
- #1 outlier: @${topOutlier?.handle ?? 'N/A'} - ${topOutlier?.outlierRatio.toFixed(1) ?? 'N/A'}× baseline

## Format Breakdown
${data.formatStats.map(f => `- ${f.format}: ${(f.avgER * 100).toFixed(1)}% ER (${f.count} posts)`).join('\n')}

## Niche Leaderboard
${data.nicheStats.slice(0, 6).map(n => `- ${n.niche}: ${(n.avgER * 100).toFixed(1)}% ER (${n.count} posts)`).join('\n')}`;

  const insightsSection = insights ? `
## Team Curation Signal (${insights.summary.totalRatings} ratings)
- Save rate: ${Math.round((insights.summary.saveCount / Math.max(insights.summary.totalRatings, 1)) * 100)}%
- Skip rate: ${Math.round((insights.summary.downCount / Math.max(insights.summary.totalRatings, 1)) * 100)}%
- Top saved niche: ${insights.nichePreferences[0]?.niche ?? 'N/A'}
- Top saved format: ${insights.formatPreferences[0]?.format ?? 'N/A'}
- Most saved hook: "${insights.topRatedPosts[0]?.caption?.slice(0, 80) ?? 'N/A'}"` : '';

  return `${base}\n${trendsSection}${insightsSection}`;
}

export async function POST(req: Request) {
  const { messages, data, insightsData }: {
    messages:     { role: 'user' | 'assistant'; content: string }[];
    data:         TrendsData   | null;
    insightsData: InsightsData | null;
  } = await req.json();

  const stream = await client.messages.create({
    model:      MODEL,
    max_tokens: 512,
    system:     buildSystemPrompt(data, insightsData),
    messages:   messages.map(m => ({ role: m.role, content: m.content })),
    stream:     true,
  });

  const encoder  = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          controller.enqueue(encoder.encode(event.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
