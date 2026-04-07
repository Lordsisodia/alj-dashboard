'use client';

import { motion } from 'framer-motion';
import { InfoTooltip } from './InfoTooltip';

export interface LiveScrapeItem {
  handle: string;
  displayName: string;
  initials: string;
  startedAt: number;
}

interface Props {
  liveItems?: LiveScrapeItem[];
  columnBg?: string;
}

function LiveScrapeRow({ item }: { item: LiveScrapeItem }) {
  const elapsed   = (Date.now() - item.startedAt) / 1000;
  const remaining = Math.max(6 - elapsed, 0.1);
  const initialPct = Math.min((elapsed / 6) * 100, 99);

  return (
    <div
      className="px-3 py-3 rounded-xl bg-white space-y-2"
      style={{ border: '1px solid rgba(0,0,0,0.06)' }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center text-[8px] font-bold flex-shrink-0"
          style={{ backgroundColor: 'rgba(127,29,29,0.08)', color: '#7f1d1d' }}
        >
          {item.initials}
        </div>
        <p className="text-[11px] font-semibold text-neutral-800 truncate flex-1">{item.handle}</p>
        <motion.div
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: '#dc2626' }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>

      <div className="h-1.5 rounded-full w-full overflow-hidden" style={{ backgroundColor: 'rgba(220,38,38,0.1)' }}>
        <motion.div
          className="h-full rounded-full relative overflow-hidden"
          style={{ backgroundColor: '#dc2626' }}
          initial={{ width: `${initialPct}%` }}
          animate={{ width: '100%' }}
          transition={{ duration: remaining, ease: 'linear' }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)' }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.8 }}
          />
        </motion.div>
      </div>
    </div>
  );
}

export function ScrapingColumn({ liveItems = [], columnBg = '#fff' }: Props) {
  const isActive = liveItems.length > 0;

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: columnBg }}>
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#7f1d1d' }}>Scraping</p>
        <InfoTooltip text="Active data collection. Oracle is pulling full profile data from Instagram." />
        <span
          className="ml-auto text-[10px] font-semibold tabular-nums px-1.5 py-0.5 rounded-md"
          style={{ backgroundColor: 'rgba(127,29,29,0.1)', color: '#7f1d1d' }}
        >
          {liveItems.length}
        </span>
      </div>

      <div className="p-3 max-h-[440px] overflow-y-auto space-y-1.5">
        {isActive ? (
          liveItems.map(item => <LiveScrapeRow key={item.handle} item={item} />)
        ) : (
          <p className="text-[11px] text-center py-8" style={{ color: 'rgba(127,29,29,0.3)' }}>
            Click Scrape on an approved card
          </p>
        )}
      </div>
    </div>
  );
}
