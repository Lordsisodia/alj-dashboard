'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { ModelEarnings } from '../types';

function formatCurrency(n: number) {
  return `£${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function ModelEarningsCard({ model, index }: { model: ModelEarnings; index: number }) {
  const TrendIcon = model.trend === 'up' ? TrendingUp : model.trend === 'down' ? TrendingDown : Minus;
  const trendColor = model.trend === 'up' ? 'text-green-600' : model.trend === 'down' ? 'text-red-500' : 'text-neutral-400';
  const trendBg = model.trend === 'up' ? 'bg-green-100' : model.trend === 'down' ? 'bg-red-100' : 'bg-neutral-100';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.08, duration: 0.3 }}
      className="bg-white rounded-2xl p-5"
      style={{ border: '1px solid rgba(0,0,0,0.07)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ background: model.gradient }}
          >
            {model.initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-900">{model.name}</p>
            <p className="text-xs text-neutral-400">{model.margin}% margin</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${trendBg} ${trendColor}`}>
          <TrendIcon size={11} />
          {model.trendValue}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] text-neutral-400 mb-0.5">Revenue</p>
          <p className="text-lg font-bold text-neutral-900">{formatCurrency(model.revenue)}</p>
        </div>
        <div>
          <p className="text-[11px] text-neutral-400 mb-0.5">Margin</p>
          <p className="text-lg font-bold text-neutral-900">{model.margin}%</p>
        </div>
      </div>
    </motion.div>
  );
}

function ModelEarningsBreakdown({ models }: { models: ModelEarnings[] }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {models.map((model, i) => (
        <ModelEarningsCard key={model.id} model={model} index={i} />
      ))}
    </div>
  );
}

export { ModelEarningsBreakdown };
