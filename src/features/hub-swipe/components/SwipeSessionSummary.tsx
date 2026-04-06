'use client';

import { useEffect, useState } from 'react';
import { Heart, X, Send, Clock, StopCircle } from 'lucide-react';

interface SwipeSessionSummaryProps {
  rated: number;
  passed: number;
  sent: number;
  startedAt: Date;
  onEndSession: () => void;
}

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

export function SwipeSessionSummary({
  rated,
  passed,
  sent,
  startedAt,
  onEndSession,
}: SwipeSessionSummaryProps) {
  const [elapsed, setElapsed] = useState(Date.now() - startedAt.getTime());

  useEffect(() => {
    const id = setInterval(() => setElapsed(Date.now() - startedAt.getTime()), 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  return (
    <div
      className="flex items-center gap-4 px-4 py-2.5 rounded-xl"
      style={{ background: '#f5f5f4', border: '1px solid rgba(0,0,0,0.06)' }}
    >
      <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide mr-1">
        Session
      </span>

      <Stat icon={<Heart size={11} className="text-rose-500" />} value={rated} label="rated" />
      <Stat icon={<X size={11} className="text-neutral-400" />} value={passed} label="passed" />
      <Stat icon={<Send size={11} className="text-violet-500" />} value={sent} label="sent" />

      <div className="flex items-center gap-1 text-[11px] text-neutral-400">
        <Clock size={11} />
        <span>{formatElapsed(elapsed)}</span>
      </div>

      <div className="flex-1" />

      <button
        onClick={onEndSession}
        className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-500 px-3 py-1 rounded-lg transition-colors hover:bg-neutral-200"
      >
        <StopCircle size={12} />
        End session
      </button>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="flex items-center gap-1 text-[11px] font-semibold text-neutral-700">
      {icon}
      <span>{value}</span>
      <span className="font-normal text-neutral-400">{label}</span>
    </div>
  );
}
