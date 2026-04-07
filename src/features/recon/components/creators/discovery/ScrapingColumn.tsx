'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
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
  const elapsed    = (Date.now() - item.startedAt) / 1000;
  const remaining  = Math.max(8 - elapsed, 0.1);
  const initialPct = Math.min((elapsed / 8) * 100, 99);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -12, scale: 0.95, transition: { duration: 0.25 } }}
      className="px-3 py-3 rounded-xl bg-white space-y-2"
      style={{ border: '1px solid rgba(0,0,0,0.06)' }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center text-[8px] font-bold flex-shrink-0 ring-2 ring-red-100"
          style={{ backgroundColor: 'rgba(127,29,29,0.08)', color: '#7f1d1d' }}
        >
          {item.initials}
        </div>
        <p className="text-[11px] font-semibold text-neutral-800 truncate flex-1">{item.handle}</p>
        {/* Status dot */}
        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#dc2626' }} />
      </div>

      <div className="h-1.5 rounded-full w-full overflow-hidden" style={{ backgroundColor: 'rgba(220,38,38,0.1)' }}>
        <motion.div
          className="h-full rounded-full relative overflow-hidden"
          style={{ backgroundColor: '#dc2626' }}
          initial={{ width: `${initialPct}%` }}
          animate={{ width: '100%' }}
          transition={{ duration: remaining, ease: [0.1, 0.2, 0.5, 1] }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)' }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.8 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export function ScrapingColumn({ liveItems = [], columnBg = '#fff' }: Props) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid rgba(0,0,0,0.07)', borderLeft: '2px solid #dc2626', backgroundColor: columnBg }}
    >
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
        <AnimatePresence mode="popLayout">
          {liveItems.length > 0 ? (
            liveItems.map(item => <LiveScrapeRow key={item.handle} item={item} />)
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-10 gap-2"
            >
              <RefreshCw size={18} className="text-red-200" />
              <p className="text-[10px] text-center leading-snug" style={{ color: 'rgba(127,29,29,0.3)' }}>
                Click Scrape on<br />an approved card
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
