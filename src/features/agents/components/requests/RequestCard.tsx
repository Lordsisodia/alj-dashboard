'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import type { FeatureRequest } from '../../types';
import { REQUEST_STATUS_CONFIG, fadeUp } from '../../constants';

export function RequestCard({ request }: { request: FeatureRequest }) {
  const cfg = REQUEST_STATUS_CONFIG[request.status];

  return (
    <motion.div
      variants={fadeUp}
      className="p-4 rounded-xl space-y-3"
      style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-neutral-900">{request.title}</p>
          <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{request.description}</p>
        </div>
        <div
          className="px-2 py-0.5 rounded-lg text-[10px] font-semibold flex-shrink-0"
          style={{ backgroundColor: cfg.bg, color: cfg.color }}
        >
          {request.status}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-neutral-400">
        <span>By {request.requestedBy} · {request.date}</span>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg" style={{ backgroundColor: '#f3f4f6' }}>
          <Clock size={10} />
          <span className="text-neutral-600 font-medium">{request.eta}</span>
        </div>
      </div>
    </motion.div>
  );
}
