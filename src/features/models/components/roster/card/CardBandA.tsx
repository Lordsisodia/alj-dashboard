'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import type { ModelData } from '../../../types';
import type { CardHealthState } from '../health/cardHealthState';

function useCountUp(target: number, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setVal(Math.round(ease(t) * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

interface Props {
  model: ModelData;
  health: CardHealthState;
}

export function CardBandA({ model, health }: Props) {
  const mrrAnimated = useCountUp(model.mrr ?? 0);

  return (
    <div className="flex items-start justify-between gap-3 p-4 pb-3">
      {/* Left: avatar + name + niche + handle */}
      <div className="flex items-start gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${model.color}, ${model.color}aa)` }}
        >
          {model.initials}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-bold text-neutral-900 leading-none">{model.name}</span>
            {health.isPaused ? (
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style={{ backgroundColor: 'rgba(0,0,0,0.06)', color: '#737373' }}
              >
                Paused
              </motion.span>
            ) : (
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#16a34a' }}
              >
                Active
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">{model.niche}</p>
          <a
            href={`https://onlyfans.com/${model.handle.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-medium mt-0.5 hover:underline"
            style={{ color: model.color }}
            onClick={e => e.stopPropagation()}
          >
            <ExternalLink size={9} />
            {model.handle}
          </a>
        </div>
      </div>

      {/* Right: MRR or onboarding phase */}
      <div className="flex-shrink-0 text-right">
        {health.isOnboarding ? (
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
            style={{ backgroundColor: `${model.color}18`, color: model.color }}
          >
            Phase {model.onboardingPhase}
          </span>
        ) : health.isPaused ? (
          <p className="text-sm font-bold text-neutral-400">
            £{(model.mrr ?? 0).toLocaleString()}/mo
          </p>
        ) : (
          <p className="text-sm font-bold text-neutral-900">
            £{mrrAnimated.toLocaleString()}/mo
          </p>
        )}
      </div>
    </div>
  );
}
