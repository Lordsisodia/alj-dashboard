import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import type { FunctionReference } from 'convex/server';
import { api } from '@/convex/_generated/api';

const OPENROUTER_API = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'google/gemini-3.1-flash-lite-preview';

async function fetchFromConvex<T>(query: FunctionReference<"query">, args?: Record<string, unknown>): Promise<T> {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) throw new Error('NEXT_PUBLIC_CONVEX_URL not set');
  const client = new ConvexHttpClient(url);
  return args ? (client.query(query, args) as Promise<T>) : (client.query(query) as Promise<T>);
}

interface AgentRun {
  _id: string;
  agentName: string;
  type: 'Scraper' | 'Scheduler' | 'Analyst';
  description: string;
  status: 'running' | 'completed' | 'failed';
  startedAt: number;
  duration: string;
  progress: number;
  outputPreview: string;
}

interface AnomalyAlert {
  agentName: string;
  type: 'high_failure_rate' | 'spike' | 'stalled' | 'budget_breach';
  severity: 'warning' | 'critical';
  message: string;
  detail: string;
}

// ── Statistical anomaly detection ─────────────────────────────────────────────

function detectAnomalies(runs: AgentRun[]): AnomalyAlert[] {
  const alerts: AnomalyAlert[] = [];

  if (runs.length === 0) return alerts;

  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  const threeHour = 3 * oneHour;

  // 1. High failure rate per agent
  const byAgent = runs.reduce<Record<string, { total: number; failed: number; running: number }>>((acc, r) => {
    if (!acc[r.agentName]) acc[r.agentName] = { total: 0, failed: 0, running: 0 };
    acc[r.agentName].total++;
    if (r.status === 'failed') acc[r.agentName].failed++;
    if (r.status === 'running') acc[r.agentName].running++;
    return acc;
  }, {});

  for (const [name, stats] of Object.entries(byAgent)) {
    const failRate = stats.total > 0 ? stats.failed / stats.total : 0;
    if (failRate >= 0.5 && stats.total >= 4) {
      alerts.push({
        agentName: name,
        type: 'high_failure_rate',
        severity: failRate >= 0.75 ? 'critical' : 'warning',
        message: `${name} has a ${Math.round(failRate * 100)}% failure rate`,
        detail: `${stats.failed} failures out of ${stats.total} total runs`,
      });
    }
  }

  // 2. Stalled runs (running > 3h with low progress)
  for (const run of runs) {
    if (run.status === 'running' && run.startedAt < now - threeHour && run.progress < 50) {
      alerts.push({
        agentName: run.agentName,
        type: 'stalled',
        severity: 'warning',
        message: `${run.agentName} stalled`,
        detail: `Running for ${run.duration} but only ${run.progress}% complete — may be stuck`,
      });
    }
  }

  // 3. Spike in failures (more than 3 failures in the last hour)
  const recentFailures = runs.filter(r =>
    r.status === 'failed' && r.startedAt >= now - oneHour
  );
  if (recentFailures.length >= 3) {
    const agents = [...new Set(recentFailures.map(r => r.agentName))];
    alerts.push({
      agentName: agents.join(', '),
      type: 'spike',
      severity: 'critical',
      message: `${recentFailures.length} failures in the last hour`,
      detail: `Agents affected: ${agents.join(', ')}`,
    });
  }

  return alerts;
}

// ── AI enrichment (optional) ───────────────────────────────────────────────────

async function enrichWithAI(runs: AgentRun[], statsAlerts: AnomalyAlert[]): Promise<AnomalyAlert[]> {
  if (statsAlerts.length === 0 || !process.env.OPENROUTER_API_KEY) return statsAlerts;

  const runsJson = JSON.stringify(runs.slice(0, 50));

  const prompt = `You are an AI operations analyst. The following are recent agent runs:

${runsJson}

The following statistical anomalies were detected:
${statsAlerts.map(a => `- ${a.agentName}: ${a.message} (${a.severity})`).join('\n')}

Respond ONLY with a valid JSON array of anomaly objects (no markdown, no commentary). Each object must have:
{
  "agentName": "string",
  "type": "high_failure_rate" | "spike" | "stalled" | "budget_breach",
  "severity": "warning" | "critical",
  "message": "string",
  "detail": "string"
}

If the statistical alerts are sufficient, return them unchanged. If you detect additional anomalies from the data, add them. Return an empty array if everything looks healthy.`;

  try {
    const res = await fetch(OPENROUTER_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: [{ type: 'text', text: prompt }] }],
        max_tokens: 800,
        temperature: 0.2,
      }),
    });

    if (!res.ok) return statsAlerts;

    const data = await res.json();
    let raw: string = data.choices?.[0]?.message?.content ?? '';

    const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) raw = fenceMatch[1].trim();
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (jsonMatch) raw = jsonMatch[0];

    const aiAlerts: AnomalyAlert[] = JSON.parse(raw);
    if (Array.isArray(aiAlerts) && aiAlerts.length > statsAlerts.length) {
      return aiAlerts;
    }
  } catch { /* fallback to stats only */ }

  return statsAlerts;
}

// ── Route ─────────────────────────────────────────────────────────────────────

export async function GET() {
  try {
    const runs = await fetchFromConvex<AgentRun[]>(api.agents.getAgentRuns);

    const statsAlerts = detectAnomalies(runs);
    const allAlerts = await enrichWithAI(runs, statsAlerts);

    return NextResponse.json({
      hasAnomalies: allAlerts.length > 0,
      alerts: allAlerts,
      summary: allAlerts.length === 0
        ? 'All agent runs within normal parameters'
        : `${allAlerts.length} anomaly${allAlerts.length > 1 ? 'ies' : 'y'} detected`,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
