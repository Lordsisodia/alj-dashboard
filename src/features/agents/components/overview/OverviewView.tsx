'use client';

import { useQuery, useMutation } from 'convex/react';
import { useState } from 'react';
import { api } from '@/convex/_generated/api';
import { useEffect } from 'react';
import { Bot, CircleDot, DollarSign, ShieldCheck, TrendingUp, Zap, AlertTriangle, ChevronDown, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { containerVariants, fadeUp } from '../../constants';
import { ActivityLogList } from '../log/ActivityLogList';

const CARD = { backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' } as const;

function MetricTile({ icon: Icon, value, label, sub, color, accent }: {
  icon: React.ElementType; value: string | number; label: string; sub: string; color: string; accent: string;
}) {
  return (
    <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden relative"
      style={CARD}>
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: accent }} />
      <div className="px-5 py-4 pl-6">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${color}12` }}>
            <Icon size={15} style={{ color }} />
          </div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 text-right leading-tight mt-1">{label}</span>
        </div>
        <p className="text-3xl font-bold text-neutral-900 tabular-nums tracking-tight">{value}</p>
        <p className="text-[11px] text-neutral-400 mt-1">{sub}</p>
      </div>
    </motion.div>
  );
}

function RunBar({ runs }: { runs: { day: string; succeeded: number; failed: number }[] }) {
  const max = Math.max(...runs.map(r => r.succeeded + r.failed), 1);
  const labels = ['14d', '', '', '', '', '', '7d', '', '', '', '', '', '', 'today'];
  return (
    <div>
      <div className="flex items-end gap-[3px] h-16">
        {runs.map((r, i) => {
          const total = r.succeeded + r.failed;
          const h = (total / max) * 100;
          return (
            <div key={r.day} className="flex-1 flex flex-col justify-end h-full group cursor-default" title={`${r.day}: ${total} runs`}>
              {total > 0 ? (
                <div className="flex flex-col-reverse gap-px overflow-hidden rounded-sm transition-opacity group-hover:opacity-80"
                  style={{ height: `${h}%`, minHeight: 3 }}>
                  {r.succeeded > 0 && <div style={{ flex: r.succeeded, background: 'linear-gradient(180deg,#78c257,#4db847)' }} />}
                  {r.failed > 0 && <div style={{ flex: r.failed, background: 'linear-gradient(180deg,#ff0069,#cc0054)' }} />}
                </div>
              ) : <div className="rounded-sm" style={{ height: 3, backgroundColor: 'rgba(0,0,0,0.06)' }} />}
            </div>
          );
        })}
      </div>
      <div className="flex gap-[3px] mt-1.5">
        {labels.map((l, i) => (
          <div key={i} className="flex-1 text-center">
            {l && <span className="text-[9px] text-neutral-400">{l}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export function OverviewView() {
  const stats = useQuery(api.agents.getOverview);
  const log = useQuery(api.agents.getActivityLog);
  const agentRuns = useQuery(api.agents.getAgentRuns);
  const seedLog = useMutation(api.agents.seedActivityLog);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [summary, setSummary] = useState<{
    headline: string; totalCalls: number; totalTokens: number;
    successRate: string; avgLatencyMs: number; topAgents: string[];
    highlights: string[]; warnings: string[]; verdict: string;
  } | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [anomalies, setAnomalies] = useState<{
    hasAnomalies: boolean; alerts: Array<{
      agentName: string; type: string; severity: string;
      message: string; detail: string;
    }>; summary: string;
  } | null>(null);

  useEffect(() => {
    if (log !== undefined && log.length === 0) seedLog().catch(() => {});
  }, [log, seedLog]);

  // Load anomaly data
  useEffect(() => {
    fetch('/api/agents/anomaly')
      .then(r => r.json())
      .then(d => { if (!d.error) setAnomalies(d); })
      .catch(() => {});
  }, []);

  // Load daily summary on first expand
  const loadSummary = () => {
    if (summary !== null || summaryLoading) return;
    setSummaryOpen(true);
    setSummaryLoading(true);
    fetch('/api/agents/daily-summary')
      .then(r => r.json())
      .then(d => { if (!d.error) setSummary(d); })
      .catch(() => {})
      .finally(() => setSummaryLoading(false));
  };

  const runs14 = (() => {
    const days = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (13 - i));
      return d.toISOString().slice(0, 10);
    });
    const map = new Map(days.map(d => [d, { day: d, succeeded: 0, failed: 0 }]));
    for (const r of agentRuns ?? []) {
      const day = new Date(r.startedAt).toISOString().slice(0, 10);
      const entry = map.get(day);
      if (!entry) continue;
      if (r.status === 'completed') entry.succeeded++;
      else if (r.status === 'failed') entry.failed++;
    }
    return Array.from(map.values());
  })();

  const fmtCents = (c: number) => `$${(c / 100).toFixed(2)}`;
  const successRate = stats && stats.totalRuns > 0
    ? Math.round((stats.completedRuns / stats.totalRuns) * 100)
    : 0;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
      {/* Anomaly alert banner */}
      <AnimatePresence>
        {anomalies?.hasAnomalies && (
          <motion.div variants={fadeUp}
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="rounded-2xl px-5 py-3.5 flex items-start gap-3 cursor-default"
            style={{ background: 'linear-gradient(135deg, rgba(255,100,0,0.08), rgba(255,50,0,0.06))', border: '1px solid rgba(255,100,0,0.2)' }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,100,0,0.12)' }}>
              <AlertTriangle size={13} style={{ color: '#ff6400' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-orange-700">Agent Anomaly Detected</p>
              <p className="text-[11px] text-orange-600 mt-0.5">{anomalies.summary}</p>
              <div className="mt-2 space-y-1">
                {anomalies.alerts.slice(0, 3).map((a, i) => (
                  <p key={i} className="text-[10px] text-orange-500">
                    <span className="font-semibold">{a.agentName}:</span> {a.message}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Health banner */}
      <motion.div variants={fadeUp} className="rounded-2xl px-5 py-4 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, rgba(255,0,105,0.06) 0%, rgba(131,58,180,0.08) 50%, rgba(74,158,255,0.06) 100%)', border: '1px solid rgba(131,58,180,0.12)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#ff0069,#833ab4)' }}>
            <Zap size={14} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-900">System Operational</p>
            <p className="text-[11px] text-neutral-500">{successRate}% success rate across {stats?.totalRuns ?? 0} runs this session</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-semibold text-emerald-600">Live</span>
        </div>
      </motion.div>

      {/* Daily AI Summary card */}
      <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden" style={CARD}>
        <button
          onClick={() => { setSummaryOpen(v => !v); if (summary === null && !summaryLoading) loadSummary(); }}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-neutral-50/60 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#4a9eff22,#833ab422)', border: '1px solid rgba(74,158,255,0.2)' }}>
              <Brain size={14} style={{ color: '#4a9eff' }} />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-900">Daily Summary</p>
              <p className="text-[11px] text-neutral-400">AI-generated · past 24h</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {summary && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(74,158,255,0.1)', color: '#4a9eff' }}>
                {summary.totalCalls} calls
              </span>
            )}
            <ChevronDown size={14} className="text-neutral-400 transition-transform" style={{ transform: summaryOpen ? 'rotate(180deg)' : 'none' }} />
          </div>
        </button>

        <AnimatePresence>
          {summaryOpen && (
            <motion.div variants={fadeUp} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="px-5 pb-4 border-t border-neutral-100">
              {summaryLoading ? (
                <div className="py-4 flex items-center justify-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-neutral-200 border-t-neutral-600 animate-spin" />
                  <span className="text-xs text-neutral-400">Analysing agent logs…</span>
                </div>
              ) : summary ? (
                <div className="pt-4 space-y-3">
                  <p className="text-sm font-bold text-neutral-900">{summary.headline}</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Calls', value: String(summary.totalCalls) },
                      { label: 'Tokens', value: summary.totalTokens >= 1000 ? `${(summary.totalTokens / 1000).toFixed(0)}K` : String(summary.totalTokens) },
                      { label: 'Avg Latency', value: `${summary.avgLatencyMs}ms` },
                    ].map(({ label, value }) => (
                      <div key={label} className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.03)' }}>
                        <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">{label}</p>
                        <p className="text-base font-bold text-neutral-900 mt-0.5">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-1.5">Highlights</p>
                    {summary.highlights.map((h, i) => (
                      <p key={i} className="text-[11px] text-neutral-600">• {h}</p>
                    ))}
                  </div>
                  {summary.warnings.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-orange-500 mb-1.5">Warnings</p>
                      {summary.warnings.map((w, i) => (
                        <p key={i} className="text-[11px] text-orange-600">• {w}</p>
                      ))}
                    </div>
                  )}
                  <p className="text-[11px] italic text-neutral-400 border-t border-neutral-100 pt-2">{summary.verdict}</p>
                </div>
              ) : (
                <p className="py-4 text-xs text-neutral-400 text-center">No data available.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Metric grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricTile icon={Bot} value={stats?.activeAgents ?? 0} label="Active Agents" sub={`${stats?.totalRuns ?? 0} total runs`} color="#4a9eff" accent="linear-gradient(180deg,#4a9eff,#1d6eb5)" />
        <MetricTile icon={CircleDot} value={stats?.tasksInProgress ?? 0} label="In Progress" sub="feature requests" color="#833ab4" accent="linear-gradient(180deg,#833ab4,#5a1f8a)" />
        <MetricTile icon={DollarSign} value={fmtCents(stats?.monthSpend ?? 0)} label="Month Spend" sub="across all providers" color="#ff0069" accent="linear-gradient(180deg,#ff0069,#cc0054)" />
        <MetricTile icon={ShieldCheck} value={stats?.pendingApprovals ?? 0} label="Approvals" sub="awaiting review" color="#78c257" accent="linear-gradient(180deg,#78c257,#4a8a2d)" />
      </div>

      {/* Charts + activity */}
      <div className="grid grid-cols-5 gap-3">
        <motion.div variants={fadeUp} className="col-span-3 rounded-2xl p-5 space-y-4" style={CARD}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-neutral-800">Run Activity</p>
              <p className="text-[11px] text-neutral-400">Last 14 days</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[10px] text-neutral-500">
                <span className="w-2 h-2 rounded-sm inline-block" style={{ background: 'linear-gradient(180deg,#78c257,#4db847)' }} /> Completed
              </span>
              <span className="flex items-center gap-1 text-[10px] text-neutral-500">
                <span className="w-2 h-2 rounded-sm inline-block" style={{ background: 'linear-gradient(180deg,#ff0069,#cc0054)' }} /> Failed
              </span>
            </div>
          </div>
          <RunBar runs={runs14} />
          <div className="flex items-center gap-4 pt-1 border-t border-neutral-100">
            <div className="flex items-center gap-1.5">
              <TrendingUp size={11} style={{ color: '#78c257' }} />
              <span className="text-[11px] font-semibold" style={{ color: '#78c257' }}>{stats?.completedRuns ?? 0} completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-neutral-400">{stats?.failedRuns ?? 0} failed</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="col-span-2 rounded-2xl p-5 space-y-3" style={CARD}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-neutral-800">Recent Activity</p>
            <span className="text-[10px] text-neutral-400">{(log ?? []).length} events</span>
          </div>
          <ActivityLogList events={(log ?? []).slice(0, 6).map(e => ({ ...e, id: e._id }))} compact />
        </motion.div>
      </div>
    </motion.div>
  );
}
