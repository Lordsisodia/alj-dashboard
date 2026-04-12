'use client';

import { motion } from 'framer-motion';
import { MODELS } from '../../constants';
import { ModelRosterCard } from './ModelRosterCard';

function PortfolioStatsStrip() {
  const totalMrr = MODELS.reduce((sum, m) => sum + (m.mrr ?? 0), 0);
  const totalSubs = MODELS.reduce((sum, m) => sum + (m.subscribers ?? 0), 0);
  const activeModels = MODELS.filter((m) => m.status === 'Active').length;

  return (
    <div
      className="grid gap-3 px-4 pt-4 pb-2"
      style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
    >
      {[
        { label: 'Portfolio MRR', value: `£${totalMrr.toLocaleString()}`, sub: 'Monthly' },
        { label: 'Total Subscribers', value: totalSubs.toLocaleString(), sub: 'Across all models' },
        { label: 'Active Models', value: String(activeModels), sub: `of ${MODELS.length} total` },
      ].map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl p-4"
          style={{
            backgroundColor: '#fff',
            border: '1px solid rgba(0,0,0,0.07)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <p className="text-[11px] text-neutral-400 mb-1">{stat.label}</p>
          <p className="text-xl font-bold text-neutral-900 leading-none">{stat.value}</p>
          <p className="text-[10px] text-neutral-400 mt-0.5">{stat.sub}</p>
        </div>
      ))}
    </div>
  );
}

export function RosterView({ activeFilter }: { activeFilter: string }) {
  const filtered = MODELS.filter((m) => {
    if (activeFilter === 'active') return m.status === 'Active';
    if (activeFilter === 'paused') return m.status === 'Paused';
    if (activeFilter === 'onboarding') return m.onboardingPhase < 7;
    return true;
  });

  return (
    <div>
      <PortfolioStatsStrip />
      <div className="px-4 pb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {filtered.map((model, i) => (
          <ModelRosterCard key={model.id} model={model} index={i} />
        ))}
      </div>
    </div>
  );
}
