'use client';

import { useState, useEffect } from 'react';
import { PoundSterling, Users, Film, TrendingUp } from 'lucide-react';
import { MODELS } from '../../constants';

function useCountUp(target: number, duration = 1200, delay = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf: number;
    const timer = setTimeout(() => {
      const start = performance.now();
      const ease = (t: number) => 1 - Math.pow(1 - t, 3);
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        setVal(Math.round(ease(t) * target));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [target, duration, delay]);
  return val;
}

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  formatValue: (n: number) => string;
  label: string;
  subLabel?: string;
  delta?: string;
  deltaColor?: string;
  delay?: number;
}

function StatCard({ icon, value, formatValue, label, subLabel, delta, deltaColor, delay = 0 }: StatCardProps) {
  const animated = useCountUp(value, 1200, delay);

  return (
    <div className="bg-white rounded-xl border border-black/[0.07] shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-4 transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-neutral-400">{icon}</span>
        {delta && (
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
            style={{ backgroundColor: `${deltaColor}18`, color: deltaColor }}
          >
            {delta}
          </span>
        )}
      </div>
      <p className="text-xl font-bold text-neutral-900 leading-none mb-1">
        {formatValue(animated)}
      </p>
      <p className="text-xs text-neutral-500">{label}</p>
      {subLabel && <p className="text-[10px] text-neutral-400 mt-0.5">{subLabel}</p>}
    </div>
  );
}

export function PortfolioStatsStrip() {
  const totalMrr = MODELS.reduce((sum, m) => sum + (m.mrr ?? 0), 0);
  const totalSubs = MODELS.reduce((sum, m) => sum + (m.subscribers ?? 0), 0);
  const totalReels = MODELS.reduce((sum, m) => sum + m.reelsInPipeline, 0);

  return (
    <div className="grid grid-cols-4 gap-3 px-4 pt-4 pb-2">
      <StatCard
        icon={<PoundSterling size={16} />}
        value={totalMrr}
        formatValue={(n) => `£${n.toLocaleString()}/mo`}
        label="Portfolio MRR"
        delta="+£800 vs last mo"
        deltaColor="#22c55e"
        delay={0}
      />
      <StatCard
        icon={<Users size={16} />}
        value={totalSubs}
        formatValue={(n) => n.toLocaleString()}
        label="Total Subscribers"
        delta="+124 this week"
        deltaColor="#22c55e"
        delay={150}
      />
      <StatCard
        icon={<Film size={16} />}
        value={totalReels}
        formatValue={(n) => String(n)}
        label="Reels in Pipeline"
        subLabel={`across ${MODELS.length} models`}
        delay={300}
      />
      <StatCard
        icon={<TrendingUp size={16} />}
        value={50}
        formatValue={() => '5.0%'}
        label="Avg Engagement"
        subLabel="across active models"
        delay={450}
      />
    </div>
  );
}
