'use client';

import { Radio, Clock } from 'lucide-react';
import { StatusStrip } from '@/components/ui/status-strip';

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
    <StatusStrip
      status={{ label: isRecent ? 'Pipeline active' : 'Pipeline idle', active: isRecent }}
      stats={[
        { icon: <Radio size={11} />, value: totalIndexed, label: 'posts indexed' },
        { value: `+${postsThisWeek}`, label: 'this week' },
      ]}
      iconColor="text-purple-600"
      rightSlot={
        <>
          <Clock size={10} className="text-purple-600" />
          <span>Last scrape: <span className="font-medium text-neutral-700">{timeAgo(latestScrapeAt)}</span></span>
        </>
      }
    />
  );
}
