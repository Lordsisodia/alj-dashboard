'use client';

import { useCallback } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import type { AgentTask, AgentType, Report, ReportCategory } from '../types';

function formatStartedAt(ts: number): string {
  const now = Date.now();
  const diff = now - ts;
  const date = new Date(ts);
  const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  if (diff < 86_400_000) return `Today, ${timeStr}`;
  if (diff < 172_800_000) return `Yesterday, ${timeStr}`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ` at ${timeStr}`;
}

export function useAgentTasks() {
  const rawRuns = useQuery(api.agents.getAgentRuns);
  const retryRunMutation = useMutation(api.agents.retryRun);
  const addRunMutation = useMutation(api.agents.addRun);
  const seedMutation = useMutation(api.agents.seedAgents);

  // Auto-seed on first load when table is empty
  if (rawRuns !== undefined && rawRuns.length === 0) {
    seedMutation().catch(() => {});
  }

  const tasks: AgentTask[] = (rawRuns ?? []).map(r => ({
    id: r._id as string,
    agentName: r.agentName,
    type: r.type as AgentType,
    description: r.description,
    status: r.status,
    startedAt: formatStartedAt(r.startedAt),
    duration: r.duration,
    progress: r.progress,
    outputPreview: r.outputPreview,
  }));

  const retryTask = useCallback(async (id: string) => {
    await retryRunMutation({ id: id as Id<'agentRuns'> });
  }, [retryRunMutation]);

  const addAgent = useCallback(async (agentId: string) => {
    const defaults: Record<string, { type: AgentType; agentName: string; description: string }> = {
      scraper: {
        type: 'Scraper',
        agentName: 'Recon Scraper',
        description: 'Scraping competitor accounts  -  collecting new posts',
      },
      scheduler: {
        type: 'Scheduler',
        agentName: 'Post Scheduler Bot',
        description: 'Scheduling upcoming posts across model accounts',
      },
      reporter: {
        type: 'Analyst',
        agentName: 'Intelligence Indexer',
        description: 'Generating intelligence report from latest scrape data',
      },
    };
    const d = defaults[agentId];
    if (!d) return;
    await addRunMutation({ agentName: d.agentName, type: d.type, description: d.description });
  }, [addRunMutation]);

  return { tasks, retryTask, addAgent };
}

// ── Reports (Convex-backed via agents.getAgentReports) ────────────

export function useReports(): Report[] | undefined {
  const raw = useQuery(api.agents.getAgentReports);

  if (raw === undefined) return undefined;

  return raw
    .slice()
    .sort((a, b) => b.generatedAt - a.generatedAt)
    .map(r => ({
      id: r._id as string,
      title: r.title,
      insights: r.insights,
      generatedBy: r.generatedBy,
      generatedAt: r.generatedAt,
      category: r.category as ReportCategory,
    }));
}
