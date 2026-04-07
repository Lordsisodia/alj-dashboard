'use client';

import { useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { motion } from 'framer-motion';
import { containerVariants, fadeUp } from '../../constants';
import { DollarSign, Cpu, ReceiptText, TrendingDown } from 'lucide-react';

function fmtCents(c: number) { return `$${(c / 100).toFixed(2)}`; }
function fmtTokens(n: number) {
  return n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : `${n}`;
}
function fmtDate(ts: number) {
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const BUDGET_ALERT_THRESHOLD_PCT = 40; // flag if agent uses >40% of total monthly spend
const MONTHLY_BUDGET_CENTS = 100_00; // $100.00 default monthly budget

const PROVIDER_COLORS = {
  Anthropic: { grad: 'linear-gradient(135deg,#ff0069,#833ab4)', dot: '#ff0069', bg: 'rgba(255,0,105,0.08)', text: '#cc0054' },
  FLUX:      { grad: 'linear-gradient(135deg,#833ab4,#4a9eff)', dot: '#833ab4', bg: 'rgba(131,58,180,0.08)', text: '#5c2a87' },
  Kling:     { grad: 'linear-gradient(135deg,#4a9eff,#78c257)', dot: '#4a9eff', bg: 'rgba(74,158,255,0.08)',  text: '#1d6eb5' },
  OpenAI:    { grad: 'linear-gradient(135deg,#78c257,#4a9eff)', dot: '#78c257', bg: 'rgba(120,194,87,0.08)', text: '#4a8a2d' },
};

const METRIC_ACCENT: Record<number, string> = {
  0: 'linear-gradient(180deg,#ff0069,#833ab4)',
  1: 'linear-gradient(180deg,#833ab4,#4a9eff)',
  2: 'linear-gradient(180deg,#4a9eff,#78c257)',
};

export function CostsView() {
  const costs = useQuery(api.costs.list);
  const seed  = useMutation(api.costs.seed);

  useEffect(() => {
    if (costs !== undefined && costs.length === 0) seed().catch(() => {});
  }, [costs, seed]);

  const rows = costs ?? [];
  const totalCents  = rows.reduce((s, r) => s + r.costCents, 0);
  const totalTokens = rows.reduce((s, r) => s + (r.inputTokens ?? 0) + (r.outputTokens ?? 0), 0);

  const byAgent = rows.reduce<Record<string, number>>((acc, r) => {
    acc[r.agentName] = (acc[r.agentName] ?? 0) + r.costCents;
    return acc;
  }, {});
  const agentRows = Object.entries(byAgent).sort((a, b) => b[1] - a[1]);
  const maxAgent = Math.max(...agentRows.map(r => r[1]), 1);

  // Flag agents burning >BUDGET_ALERT_THRESHOLD_PCT% of total monthly spend
  const overBudgetAgents = agentRows
    .filter(([, cents]) => totalCents > 0 && (cents / totalCents) * 100 > BUDGET_ALERT_THRESHOLD_PCT)
    .map(([name]) => name);

  const byProvider = Object.entries(
    rows.reduce<Record<string, number>>((acc, r) => {
      acc[r.provider] = (acc[r.provider] ?? 0) + r.costCents;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const totalProviderCents = byProvider.reduce((s, [, c]) => s + c, 0);

  const metrics = [
    { icon: DollarSign,   label: 'Month Spend',   value: fmtCents(totalCents),   sub: 'all providers',  idx: 0 },
    { icon: Cpu,          label: 'Total Tokens',   value: fmtTokens(totalTokens), sub: 'input + output', idx: 1 },
    { icon: ReceiptText,  label: 'Transactions',   value: `${rows.length}`,       sub: 'recorded',       idx: 2 },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">

      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,rgba(255,0,105,0.1),rgba(131,58,180,0.1))', border: '1px solid rgba(255,0,105,0.2)' }}>
          <DollarSign size={15} style={{ color: '#ff0069' }} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-neutral-900">Costs</h3>
          <p className="text-[11px] text-neutral-400">{fmtCents(totalCents)} spend · {rows.length} transactions</p>
        </div>
      </motion.div>

      {/* Metric tiles */}
      {overBudgetAgents.length > 0 && (
        <motion.div variants={fadeUp} className="rounded-2xl px-4 py-3 flex items-center gap-3"
          style={{ background: 'linear-gradient(135deg, rgba(255,100,0,0.06), rgba(255,150,0,0.04))', border: '1px solid rgba(255,100,0,0.18)' }}>
          <TrendingDown size={13} style={{ color: '#ff6400' }} />
          <p className="text-[11px] text-orange-700">
            <span className="font-bold">{overBudgetAgents.length} agent{overBudgetAgents.length > 1 ? 's' : ''}</span> exceeding {BUDGET_ALERT_THRESHOLD_PCT}% of monthly budget:{' '}
            <span className="font-semibold">{overBudgetAgents.join(', ')}</span>
          </p>
        </motion.div>
      )}
      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
        {metrics.map(({ icon: Icon, label, value, sub, idx }) => (
          <div key={label} className="rounded-2xl p-4 flex gap-3 items-start overflow-hidden relative"
            style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            {/* Left accent */}
            <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full" style={{ background: METRIC_ACCENT[idx] }} />
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: METRIC_ACCENT[idx].replace('180deg', '135deg'), opacity: 0.12, position: 'absolute', top: 12, right: 12 }} />
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}>
              <Icon size={13} className="text-neutral-500" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">{label}</p>
              <p className="text-xl font-bold text-neutral-900 tabular-nums leading-tight mt-0.5">{value}</p>
              <p className="text-[10px] text-neutral-400 mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Body: spend by agent + provider breakdown */}
      <div className="grid grid-cols-5 gap-4">

        {/* Spend by agent - 3 cols */}
        <motion.div variants={fadeUp} className="col-span-3 rounded-2xl overflow-hidden"
          style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div className="px-5 py-3.5 border-b border-neutral-100 flex items-center justify-between">
            <p className="text-xs font-bold text-neutral-800">Spend by Agent</p>
            <span className="text-[10px] text-neutral-400 font-medium">{agentRows.length} agents</span>
          </div>
          <div className="px-5 py-4 space-y-4">
            {agentRows.map(([name, cents]) => {
              const pct = (cents / maxAgent) * 100;
              const share = totalCents > 0 ? ((cents / totalCents) * 100).toFixed(0) : '0';
              const isOverBudget = overBudgetAgents.includes(name);
              return (
                <div key={name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      {isOverBudget && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-600">HIGH</span>}
                      <span className="text-[11px] font-semibold text-neutral-800 truncate max-w-[150px]">{name}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] text-neutral-400">{share}%</span>
                      <span className="text-[11px] font-bold text-neutral-900 tabular-nums">{fmtCents(cents)}</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: isOverBudget ? 'linear-gradient(90deg,#ff6400,#ff9900)' : 'linear-gradient(90deg,#ff0069,#833ab4)' }} />
                  </div>
                </div>
              );
            })}
            {agentRows.length === 0 && (
              <p className="text-xs text-neutral-400 py-4 text-center">No spend data yet.</p>
            )}
          </div>
        </motion.div>

        {/* Right: provider breakdown + recent transactions - 2 cols */}
        <div className="col-span-2 flex flex-col gap-4">

          {/* Provider breakdown */}
          <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div className="px-4 py-3 border-b border-neutral-100">
              <p className="text-xs font-bold text-neutral-800">By Provider</p>
            </div>

            {/* Mini donut-style bars */}
            <div className="px-4 py-3 space-y-2.5">
              {byProvider.map(([provider, cents]) => {
                const cfg = PROVIDER_COLORS[provider as keyof typeof PROVIDER_COLORS] ?? { dot: '#94a3b8', bg: 'rgba(148,163,184,0.1)', text: '#6b7280', grad: 'linear-gradient(135deg,#94a3b8,#cbd5e1)' };
                const pct = totalProviderCents > 0 ? (cents / totalProviderCents) * 100 : 0;
                return (
                  <div key={provider}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.dot }} />
                        <span className="text-[11px] font-semibold" style={{ color: cfg.text }}>{provider}</span>
                      </div>
                      <span className="text-[11px] font-bold text-neutral-800 tabular-nums">{fmtCents(cents)}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: cfg.grad }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Recent transactions */}
          <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden flex-1"
            style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
              <p className="text-xs font-bold text-neutral-800">Recent</p>
              <TrendingDown size={11} className="text-neutral-400" />
            </div>
            <div className="divide-y divide-neutral-50 max-h-[180px] overflow-y-auto">
              {rows.slice(0, 8).map(r => {
                const cfg = PROVIDER_COLORS[r.provider as keyof typeof PROVIDER_COLORS];
                return (
                  <div key={r._id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50/60 transition-colors">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: cfg?.grad ?? 'linear-gradient(135deg,#94a3b8,#cbd5e1)' }}>
                      <Cpu size={9} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-neutral-800 truncate">{r.agentName}</p>
                      <p className="text-[9px] font-mono text-neutral-400 truncate">{r.model} · {fmtDate(r.recordedAt)}</p>
                    </div>
                    <span className="text-[10px] font-bold text-neutral-900 tabular-nums flex-shrink-0">{fmtCents(r.costCents)}</span>
                  </div>
                );
              })}
              {rows.length === 0 && (
                <p className="text-xs text-neutral-400 py-6 text-center">No transactions.</p>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}
