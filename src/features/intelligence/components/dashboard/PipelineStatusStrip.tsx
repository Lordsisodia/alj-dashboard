'use client';

import { motion } from 'framer-motion';
import { Radio, Clock } from 'lucide-react';

interface Props {
  totalIndexed:   number;
  postsThisWeek:  number;
  latestScrapeAt: number;
}

function timeAgo(ts: number): string {
  if (!ts) return 'never';
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs  < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function PipelineStatusStrip({ totalIndexed, postsThisWeek, latestScrapeAt }: Props) {
  const isRecent = latestScrapeAt > Date.now() - 24 * 60 * 60 * 1000;

  return (
    <motion.div
      className="flex items-center gap-4 px-4 py-3 rounded-xl"
      style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isRecent ? 'bg-green-400' : 'bg-amber-400'}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${isRecent ? 'bg-green-500' : 'bg-amber-500'}`} />
        </span>
        <span className="text-[11px] font-semibold" style={{ color: isRecent ? '#22c55e' : '#f59e0b' }}>
          {isRecent ? 'Pipeline active' : 'Pipeline idle'}
        </span>
      </div>

      <span className="text-neutral-200">|</span>

      <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
        <Radio size={11} className="text-neutral-400" />
        <span><span className="font-semibold text-neutral-800">{totalIndexed.toLocaleString()}</span> posts indexed</span>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
        <span><span className="font-semibold text-neutral-800">+{postsThisWeek}</span> this week</span>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 ml-auto">
        <Clock size={10} className="text-neutral-400" />
        <span>Last scrape: <span className="font-medium text-neutral-700">{timeAgo(latestScrapeAt)}</span></span>
      </div>
    </motion.div>
  );
}
