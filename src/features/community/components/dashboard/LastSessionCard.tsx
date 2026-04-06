'use client';

import { Heart, X, Send, Clock, Play } from 'lucide-react';
import { MOCK_LAST_SESSION } from '../../constants';

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return mins === 0 ? `${secs}s` : `${mins}m ${secs}s`;
}

interface LastSessionCardProps {
  onStartSession: () => void;
}

export function LastSessionCard({ onStartSession }: LastSessionCardProps) {
  const s = MOCK_LAST_SESSION;
  const total = s.rated + s.passed + s.sent;
  const approvalRate = total > 0 ? Math.round((s.rated / total) * 100) : 0;

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3 h-full"
      style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-neutral-800">Last Session</p>
        <span className="text-[10px] text-neutral-400 flex items-center gap-1">
          <Clock size={10} />
          {s.date}
        </span>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3">
        <Stat icon={<Heart size={11} className="text-rose-500" />} value={s.rated}  label="rated"  />
        <div className="w-px h-3 bg-neutral-100" />
        <Stat icon={<X size={11} className="text-neutral-400" />}   value={s.passed} label="passed" />
        <div className="w-px h-3 bg-neutral-100" />
        <Stat icon={<Send size={11} className="text-violet-500" />} value={s.sent}   label="sent"   />
        <div className="w-px h-3 bg-neutral-100" />
        <Stat icon={<Clock size={11} className="text-neutral-400" />} value={formatDuration(s.durationMs)} label="" raw />
      </div>

      {/* Approval rate bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-neutral-400">Approval rate</span>
          <span className="text-[10px] font-bold" style={{ color: '#ff0069' }}>{approvalRate}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${approvalRate}%`,
              background: 'linear-gradient(90deg, #ff0069, #833ab4)',
            }}
          />
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={onStartSession}
        className="w-full py-2 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90 mt-auto"
        style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
      >
        <Play size={11} className="fill-white" />
        Start New Session
      </button>
    </div>
  );
}

function Stat({
  icon, value, label, raw,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  raw?: boolean;
}) {
  return (
    <div className="flex items-center gap-1 text-[11px] font-semibold text-neutral-700">
      {icon}
      <span>{value}</span>
      {!raw && label && <span className="font-normal text-neutral-400">{label}</span>}
    </div>
  );
}
