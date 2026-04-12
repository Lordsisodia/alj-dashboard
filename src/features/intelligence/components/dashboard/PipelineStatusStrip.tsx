'use client';

import { Radio, Clock, Inbox, CheckCircle2, Zap, Bookmark, Users, Flame, TrendingUp, Database } from 'lucide-react';
import { StatusStrip } from '@/components/ui/status-strip';

interface Props {
  totalIndexed:         number;
  postsThisWeek:        number;
  latestScrapeAt:       number;
  inQueue?:             number;
  analysedCount?:       number;
  avgHookScore?:        number;
  avgER?:               number;
  outlierCount?:        number;
  totalRatings?:        number;
  saveCount?:           number;
  postsToday?:          number;
  activeCreators?:      number;
  totalCreators?:       number;
  lastRunFormatted?:   string;
  controlsSlot?:        React.ReactNode;
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

export function PipelineStatusStrip({ totalIndexed, postsThisWeek, latestScrapeAt, inQueue, analysedCount, avgHookScore, avgER, outlierCount, totalRatings, saveCount, postsToday, activeCreators, totalCreators, lastRunFormatted, controlsSlot }: Props) {
  const isRecent = latestScrapeAt > Date.now() - 24 * 60 * 60 * 1000;
  return (
    <StatusStrip
      status={{ label: isRecent ? 'Pipeline active' : 'Pipeline idle', active: isRecent }}
      stats={[
        { icon: <Radio size={11} />, value: totalIndexed, label: 'posts indexed' },
        { value: `+${postsThisWeek}`, label: 'this week' },
        ...(postsToday != null ? [{ icon: <Database size={11} />, value: postsToday, label: 'today' }] : []),
        ...(activeCreators != null && totalCreators != null ? [{ icon: <Users size={11} />, value: `${activeCreators}/${totalCreators}`, label: 'active' }] : []),
        ...(saveCount    != null && saveCount    > 0 ? [{ icon: <Bookmark size={11} />, value: saveCount,             label: 'saved'      }] : []),
        ...(inQueue      != null ? [{ icon: <Inbox        size={11} />, value: inQueue,                              label: 'in queue'  }] : []),
        ...(analysedCount != null ? [{ icon: <CheckCircle2 size={11} />, value: analysedCount,                        label: 'analyzed'  }] : []),
        ...(avgHookScore  != null && avgHookScore > 0 ? [{ icon: <Zap        size={11} />, value: avgHookScore.toFixed(1), label: 'avg hook'   }] : []),
        ...(avgER        != null && avgER         > 0 ? [{ icon: <TrendingUp size={11} />, value: `${(avgER * 100).toFixed(2)}%`, label: 'avg ER'  }] : []),
        ...(outlierCount != null && outlierCount > 0 ? [{ icon: <Flame      size={11} />, value: outlierCount,            label: 'outliers'   }] : []),
        ...(totalRatings != null && totalRatings > 0 ? [{ icon: <Users     size={11} />, value: totalRatings,            label: 'rated'      }] : []),
        ...(lastRunFormatted ? [{ value: lastRunFormatted, label: 'last run' }] : []),
      ]}
      iconColor="text-purple-600"
      rightSlot={
        <>
          {controlsSlot}
          {controlsSlot && <div className="w-px h-3.5 bg-neutral-200 mx-1" />}
          <Clock size={10} className="text-purple-600" />
          <span>Last scrape: <span className="font-medium text-neutral-700">{timeAgo(latestScrapeAt)}</span></span>
        </>
      }
    />
  );
}
