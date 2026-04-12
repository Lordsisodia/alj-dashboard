import { motion } from 'framer-motion';
import type { ModelData } from '../../types';

function HealthDot({ status }: { status: 'Active' | 'Paused' }) {
  const color = status === 'Active' ? '#22c55e' : '#f59e0b';
  return (
    <span
      className="inline-block w-2 h-2 rounded-full flex-shrink-0"
      style={{ backgroundColor: color }}
    />
  );
}

function StatusBadge({ status }: { status: 'Active' | 'Paused' }) {
  const isActive = status === 'Active';
  return (
    <span
      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{
        backgroundColor: isActive ? '#dcfce7' : '#fef3c7',
        color: isActive ? '#16a34a' : '#d97706',
      }}
    >
      {status}
    </span>
  );
}

export function ModelRosterCard({ model, index }: { model: ModelData; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
      whileHover={{ scale: 1.005, boxShadow: '0 6px 20px rgba(0,0,0,0.09)' }}
      className="rounded-xl overflow-hidden cursor-pointer"
      style={{
        backgroundColor: '#fff',
        border: '1px solid rgba(0,0,0,0.07)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        opacity: model.status === 'Paused' ? 0.82 : 1,
      }}
    >
      <div className="p-4">
        {/* Top row: avatar + name + health dot */}
        <div className="flex items-center gap-3 mb-3">
          {/* Colored initials circle */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${model.color}, ${model.color}aa)` }}
          >
            {model.initials}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-neutral-900 truncate">{model.name}</p>
              <HealthDot status={model.status} />
            </div>
            <p className="text-[11px] text-neutral-400 truncate">{model.niche}</p>
          </div>

          <StatusBadge status={model.status} />
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4">
          {/* Revenue */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-neutral-400 mb-0.5">MRR</p>
            <p className="text-sm font-bold" style={{ color: model.color }}>
              {model.mrr != null ? `£${model.mrr.toLocaleString()}` : '—'}
            </p>
          </div>

          {/* Subscribers */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-neutral-400 mb-0.5">Subscribers</p>
            <p className="text-sm font-semibold text-neutral-900">
              {model.subscribers != null ? model.subscribers.toLocaleString() : '—'}
            </p>
          </div>

          {/* Handle */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-neutral-400 mb-0.5">Handle</p>
            <p className="text-[11px] text-neutral-600 truncate">{model.handle}</p>
          </div>
        </div>

        {/* Bottom: manager + pipeline */}
        <div
          className="flex items-center gap-2 mt-3 pt-2.5"
          style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}
        >
          {model.manager && (
            <span className="text-[10px] text-neutral-400">
              {model.manager}
            </span>
          )}
          <span className="text-[10px] px-2 py-0.5 rounded-full ml-auto" style={{ backgroundColor: `${model.color}12`, color: model.color }}>
            {model.pipelineStep}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
