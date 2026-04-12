'use client';

import { StatusStrip } from '@/components/ui/status-strip';
import { Send, Zap, CheckCircle2, Clock } from 'lucide-react';
import { timeAgo } from '@/components/ui/status-strip';

interface Props {
  readyCount: number;
  inFlightCount: number;
  completedTodayCount: number;
  lastCompletedAt?: number;
}

export function GeneratePipelineStrip({ readyCount, inFlightCount, completedTodayCount, lastCompletedAt }: Props) {
  const isOnline = true; // In the future, this could be tied to provider uptime API checks

  return (
    <StatusStrip
      status={{ label: isOnline ? 'Generators Online' : 'Generators Offline', active: isOnline }}
      stats={[
        { icon: <Send size={11} />, value: readyCount, label: 'ready to dispatch', accent: readyCount > 0 ? '#10b981' : undefined },
        { icon: <Zap size={11} />, value: inFlightCount, label: 'in flight', accent: inFlightCount > 0 ? '#eab308' : undefined },
        { icon: <CheckCircle2 size={11} />, value: completedTodayCount, label: 'completed today' },
      ]}
      iconColor="text-purple-600"
      rightSlot={
        lastCompletedAt ? (
          <>
            <Clock size={10} className="text-purple-600" />
            <span>Last completed: <span className="font-medium text-neutral-700">{timeAgo(lastCompletedAt)}</span></span>
          </>
        ) : null
      }
    />
  );
}
