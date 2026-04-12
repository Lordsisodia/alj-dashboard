import { motion } from 'framer-motion';
import { MODELS } from '../../constants';
import type { ModelData } from '../../types';

function RevenueBar({ model, maxMrr }: { model: ModelData; maxMrr: number }) {
  const pct = maxMrr > 0 ? ((model.mrr ?? 0) / maxMrr) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
        style={{ background: `linear-gradient(135deg, ${model.color}, ${model.color}aa)` }}
      >
        {model.initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-neutral-900">{model.name}</span>
          <span className="text-sm font-bold" style={{ color: model.color }}>
            £{(model.mrr ?? 0).toLocaleString()}
          </span>
        </div>
        <div className="h-1.5 rounded-full" style={{ backgroundColor: 'rgba(0,0,0,0.07)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: model.color }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}

export function PerformanceView() {
  const sorted = [...MODELS].sort((a, b) => (b.mrr ?? 0) - (a.mrr ?? 0));
  const maxMrr = sorted[0]?.mrr ?? 1;

  return (
    <div className="p-4 space-y-4">
      {/* Revenue bars */}
      <div
        className="rounded-xl p-4 space-y-4"
        style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
      >
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Monthly Revenue</p>
        {sorted.map((model, i) => (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <RevenueBar model={model} maxMrr={maxMrr} />
          </motion.div>
        ))}
      </div>

      {/* Comparison table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
      >
        <div
          className="grid px-4 py-2.5"
          style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr', borderBottom: '1px solid rgba(0,0,0,0.07)' }}
        >
          {['Model', 'MRR', 'Subs', 'Pipeline'].map((h) => (
            <p key={h} className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">{h}</p>
          ))}
        </div>
        {sorted.map((model, i) => (
          <motion.div
            key={model.id}
            className="grid px-4 py-3 items-center"
            style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr', borderBottom: i < sorted.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            {/* Model name */}
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${model.color}, ${model.color}aa)` }}
              >
                {model.initials}
              </div>
              <span className="text-sm font-medium text-neutral-900">{model.name}</span>
            </div>
            {/* MRR */}
            <span className="text-sm font-bold" style={{ color: model.color }}>
              £{(model.mrr ?? 0).toLocaleString()}
            </span>
            {/* Subs */}
            <span className="text-sm text-neutral-700">
              {model.subscribers?.toLocaleString() ?? '—'}
            </span>
            {/* Pipeline */}
            <span className="text-xs text-neutral-400">{model.reelsInPipeline} reels</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
