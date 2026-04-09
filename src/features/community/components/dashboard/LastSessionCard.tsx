'use client';

import { Heart, X, Send, Clock, Play, Flame, Zap } from 'lucide-react';
import { MOCK_LAST_SESSION } from '../../constants';

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return mins === 0 ? `${secs}s` : `${mins}m ${secs}s`;
}

export function LastSessionCard() {
  const s = MOCK_LAST_SESSION;
  const total = s.rated + s.passed + s.sent;
  const approvalRate = total > 0 ? Math.round((s.rated / total) * 100) : 0;
  const dailyProgress = Math.min(100, Math.round((s.rated / s.dailyTarget) * 100));

  const prev = s.previousSession;
  const ratedDelta  = s.rated  - prev.rated;
  const passedDelta = s.passed - prev.passed;
  const sentDelta   = s.sent   - prev.sent;

  function DeltaChip({ delta }: { delta: number }) {
    if (delta === 0) return <span className="text-[10px] text-neutral-400">same</span>;
    const positive = delta > 0;
    return (
      <span className={`text-[10px] font-semibold ${positive ? 'text-emerald-500' : 'text-rose-400'}`}>
        {positive ? '+' : ''}{delta} vs last
      </span>
    );
  }

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3 h-full"
      style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Play size={13} style={{ color: '#2563eb' }} />
          <p className="text-xs font-bold text-neutral-800">Last Session</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-neutral-400 flex items-center gap-1">
            <Clock size={10} />
            {s.date}
          </span>
          <span className="text-[10px] text-blue-500 font-medium cursor-pointer hover:text-blue-600">
            View →
          </span>
        </div>
      </div>

      {/* 3-column mini-grid */}
      <div className="grid grid-cols-3 gap-2">
        {/* Rated */}
        <div className="flex flex-col gap-0.5 items-center p-2 rounded-xl" style={{ background: 'rgba(37,99,235,0.05)' }}>
          <Heart size={11} className="text-rose-500" />
          <span className="text-base font-bold text-neutral-800 leading-tight">{s.rated}</span>
          <span className="text-[9px] text-neutral-400 uppercase tracking-wide">rated</span>
          <DeltaChip delta={ratedDelta} />
        </div>
        {/* Passed */}
        <div className="flex flex-col gap-0.5 items-center p-2 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)' }}>
          <X size={11} className="text-neutral-400" />
          <span className="text-base font-bold text-neutral-800 leading-tight">{s.passed}</span>
          <span className="text-[9px] text-neutral-400 uppercase tracking-wide">passed</span>
          <DeltaChip delta={passedDelta} />
        </div>
        {/* Sent */}
        <div className="flex flex-col gap-0.5 items-center p-2 rounded-xl" style={{ background: 'rgba(139,92,246,0.05)' }}>
          <Send size={11} className="text-violet-500" />
          <span className="text-base font-bold text-neutral-800 leading-tight">{s.sent}</span>
          <span className="text-[9px] text-neutral-400 uppercase tracking-wide">sent</span>
          <DeltaChip delta={sentDelta} />
        </div>
      </div>

      {/* Streak line */}
      <div className="flex items-center gap-1">
        <Flame size={11} style={{ color: '#f97316' }} />
        <span className="text-[11px] text-neutral-500 font-medium">{s.streakDays}-day streak</span>
        <span className="text-[10px] text-neutral-300 ml-auto">{formatDuration(s.durationMs)}</span>
      </div>

      {/* Approval rate bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-neutral-400">Approval rate</span>
          <span className="text-[10px] font-bold" style={{ color: '#2563eb' }}>{approvalRate}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${approvalRate}%`,
              background: 'linear-gradient(90deg, #2563eb, #1d4ed8)',
            }}
          />
        </div>
      </div>

      {/* Daily target bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-neutral-400">Daily target</span>
          <span className="text-[10px] font-bold text-neutral-600">{s.rated}/{s.dailyTarget} today</span>
        </div>
        <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${dailyProgress}%`,
              background: 'linear-gradient(90deg, #f59e0b, #d97706)',
            }}
          />
        </div>
      </div>

      {/* Pace gauge line */}
      <div className="flex items-center gap-1 text-[10px] text-neutral-500">
        <Zap size={10} />
        <span>1.2 posts/sec · {s.paceVsAvgPct}% faster than avg</span>
      </div>
    </div>
  );
}
