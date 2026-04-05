'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { SectionCard } from '../stats/SectionCard';
import { ACTIVE_HOURS } from '../../constants';

export function GenderHoursCard() {
  return (
    <SectionCard>
      <div className="mb-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Gender Split</span>
      </div>
      <div className="flex h-3 rounded-full overflow-hidden gap-0.5 mb-2">
        <motion.div
          style={{ background: 'linear-gradient(90deg, #ff0069, #833ab4)' }}
          className="rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: '78%' }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.65, type: 'spring', stiffness: 120, damping: 14 }}
        />
        <motion.div
          style={{ backgroundColor: '#f9a8d4' }}
          className="rounded-full flex-1"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        />
      </div>
      <div className="flex gap-4 mb-5">
        <span className="text-xs text-neutral-500">
          Male <span className="font-bold" style={{ color: '#ff0069' }}>78%</span>
        </span>
        <span className="text-xs text-neutral-500">
          Female <span className="font-bold text-pink-400">22%</span>
        </span>
      </div>
      <div className="flex items-center gap-1.5 mb-2">
        <Clock size={12} style={{ color: '#ff0069' }} />
        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Active Hours</span>
      </div>
      <div className="flex gap-2 flex-wrap">
        {ACTIVE_HOURS.map(hour => (
          <span
            key={hour}
            className="px-2.5 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: 'rgba(255,0,105,0.07)',
              color: '#ff0069',
              border: '1px solid rgba(255,0,105,0.15)',
            }}
          >
            {hour}
          </span>
        ))}
      </div>
    </SectionCard>
  );
}
