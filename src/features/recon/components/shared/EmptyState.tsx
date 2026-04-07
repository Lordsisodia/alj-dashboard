'use client';

import { Users, ShieldCheck, Layers } from 'lucide-react';
import { ProductIcon } from '@/shared/layout/ProductIcon';

export function EmptyState({ filter }: { filter: 'pending' | 'approved' | 'scraped' }) {
  const configs = {
    pending: {
      icon: <Users size={20} className="text-red-300" />,
      title: 'No pending candidates',
      sub: 'Run discovery to find new creators',
    },
    approved: {
      icon: <ShieldCheck size={20} className="text-red-300" />,
      title: 'None approved yet',
      sub: 'Approve candidates from the pending pile',
    },
    scraped: {
      icon: <Layers size={20} className="text-red-300" />,
      title: 'No scraped profiles yet',
      sub: 'Click Scrape on an approved card',
    },
  };

  const config = configs[filter] ?? configs.pending;

  return (
    <div className="flex flex-col items-center justify-center py-10 gap-2">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-1"
        style={{ backgroundColor: 'rgba(220,38,38,0.06)' }}
      >
        {config.icon}
      </div>
      <p className="text-[11px] font-semibold text-neutral-500">{config.title}</p>
      <p className="text-[10px] text-neutral-300 leading-snug text-center">{config.sub}</p>
    </div>
  );
}
