'use client';

import { motion } from 'framer-motion';

const REVENUE_ITEMS = [
  { label: 'Total Revenue',   value: '$48,200',       color: '#16a34a', sub: '+12% vs last month' },
  { label: 'Avg per Creator', value: '$12,050',       color: '#7c3aed', sub: '4 active accounts' },
  { label: 'Top Earner',      value: '@abg.ricebunny', color: '#ff0069', sub: '$19,400 this period' },
  { label: 'Pending Payouts', value: '$3,800',        color: '#d97706', sub: 'Due Apr 15, 2026' },
];

export function RevenuePlaceholder() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {REVENUE_ITEMS.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className="rounded-xl p-4 bg-white"
          style={{ border: '1px solid rgba(0,0,0,0.07)' }}
        >
          <span className="text-xs text-neutral-500 font-medium block mb-2">{item.label}</span>
          <span className="text-xl font-bold" style={{ color: item.color }}>{item.value}</span>
          <span className="text-[11px] text-neutral-400 block mt-1">{item.sub}</span>
        </motion.div>
      ))}
    </div>
  );
}
