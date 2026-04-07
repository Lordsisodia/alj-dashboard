'use client';

import { Sparkles, Play, CheckCircle2, Clock, Zap } from 'lucide-react';
import { ModelSummaryCard } from './ModelSummaryCard';
import { ActivityFeed } from './ActivityFeed';
import { SEED_MODEL_SUMMARIES, SEED_ACTIVITY } from './types';

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl flex-1 min-w-0"
      style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}18` }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-black text-neutral-900 leading-none">{value}</p>
        <p className="text-[11px] text-neutral-400 mt-0.5 truncate">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardFeaturePage() {
  const models   = SEED_MODEL_SUMMARIES;
  const activity = SEED_ACTIVITY;

  const totalToday    = models.reduce((s, m) => s + m.clipsToday, 0);
  const totalApproved = models.reduce((s, m) => s + m.approved, 0);
  const totalPending  = models.reduce((s, m) => s + m.pending, 0);
  const generating    = activity.filter(e => e.type === 'generated').length;

  return (
    <div className="p-5 flex flex-col gap-6">

        {/* ── Stats row ─────────────────────────────────────────────── */}
        <div className="flex gap-3">
          <StatCard icon={<Sparkles size={16} />}    label="Generated today"  value={totalToday}    color="#8b5cf6" />
          <StatCard icon={<CheckCircle2 size={16} />} label="Approved today"   value={totalApproved} color="#10b981" />
          <StatCard icon={<Clock size={16} />}        label="Pending review"   value={totalPending}  color="#f59e0b" />
          <StatCard icon={<Zap size={16} />}          label="Jobs dispatched"  value={generating}    color="#ff0069" />
        </div>

        {/* ── Main two-column layout ─────────────────────────────────── */}
        <div className="flex gap-5 min-h-0">

          {/* Left: model breakdown */}
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400 mb-3">Models - Today</p>
            <div className="grid grid-cols-2 gap-3">
              {models.map(m => <ModelSummaryCard key={m.name} model={m} />)}
            </div>

            {/* Quick actions */}
            <div className="mt-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400 mb-3">Quick Actions</p>
              <div className="flex gap-2">
                <button
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-white transition-all hover:brightness-105"
                  style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
                >
                  <Sparkles size={14} /> Run Today's Queue
                </button>
                <button
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold text-neutral-600 transition-all hover:bg-black/[0.05]"
                  style={{ backgroundColor: '#f5f5f4', border: '1px solid rgba(0,0,0,0.08)' }}
                >
                  <Play size={14} /> View Gallery
                </button>
              </div>
            </div>
          </div>

          {/* Right: activity feed */}
          <div className="w-72 flex-shrink-0 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Activity</p>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div
              className="rounded-2xl overflow-hidden flex-1"
              style={{ border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
            >
              <ActivityFeed events={activity} />
            </div>
          </div>

        </div>
    </div>
  );
}
