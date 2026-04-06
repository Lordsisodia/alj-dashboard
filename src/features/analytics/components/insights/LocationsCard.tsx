'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { SectionCard } from '../stats/SectionCard';
import type { AudienceLocation } from '../../types';

interface LocationsCardProps {
  locations: AudienceLocation[];
}

export function LocationsCard({ locations }: LocationsCardProps) {
  const maxPct = Math.max(...locations.map(l => l.pct));
  return (
    <SectionCard>
      <div className="flex items-center gap-1.5 mb-3">
        <MapPin size={13} style={{ color: '#ff0069' }} />
        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Top Locations</span>
      </div>
      <div className="space-y-2.5">
        {locations.map(loc => (
          <div key={loc.city} className="flex items-center gap-2.5">
            <span className="text-sm flex-shrink-0">{loc.flag}</span>
            <span className="text-xs text-neutral-700 w-24 flex-shrink-0">{loc.city}</span>
            <div
              className="flex-1 h-1.5 rounded-full overflow-hidden"
              style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #ff0069, #833ab4)' }}
                initial={{ width: 0 }}
                whileInView={{ width: `${(loc.pct / maxPct) * 100}%` }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.65, type: 'spring', stiffness: 120, damping: 14 }}
              />
            </div>
            <span className="text-[11px] font-bold w-7 text-right flex-shrink-0" style={{ color: '#ff0069' }}>
              {loc.pct}%
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
