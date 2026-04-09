'use client';

import { Heart, X, Send, Clock, Play, Flame } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function LastSessionCard() {
  const stats = useQuery(api.hub.getLastSessionStats);

  const rated  = stats?.rated  ?? 0;
  const passed = stats?.passed ?? 0;
  const sent   = stats?.sent   ?? 0;
  const total  = rated + passed + sent;
  const approvalRate = total > 0 ? Math.round((rated / total) * 100) : 0;

  const isLoading = stats === undefined;

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
            Last 24h
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col gap-2 animate-pulse">
          <div className="h-16 rounded-xl bg-neutral-100" />
          <div className="h-4 w-3/4 rounded bg-neutral-100" />
          <div className="h-3 w-full rounded bg-neutral-100" />
        </div>
      ) : (
        <>
          {/* 3-column mini-grid */}
          <div className="grid grid-cols-3 gap-2">
            {/* Rated */}
            <div className="flex flex-col gap-0.5 items-center p-2 rounded-xl" style={{ background: 'rgba(37,99,235,0.05)' }}>
              <Heart size={11} className="text-rose-500" />
              <span className="text-base font-bold text-neutral-800 leading-tight">{rated}</span>
              <span className="text-[9px] text-neutral-400 uppercase tracking-wide">rated</span>
            </div>
            {/* Passed */}
            <div className="flex flex-col gap-0.5 items-center p-2 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)' }}>
              <X size={11} className="text-neutral-400" />
              <span className="text-base font-bold text-neutral-800 leading-tight">{passed}</span>
              <span className="text-[9px] text-neutral-400 uppercase tracking-wide">passed</span>
            </div>
            {/* Sent */}
            <div className="flex flex-col gap-0.5 items-center p-2 rounded-xl" style={{ background: 'rgba(139,92,246,0.05)' }}>
              <Send size={11} className="text-violet-500" />
              <span className="text-base font-bold text-neutral-800 leading-tight">{sent}</span>
              <span className="text-[9px] text-neutral-400 uppercase tracking-wide">sent</span>
            </div>
          </div>

          {/* Streak placeholder */}
          <div className="flex items-center gap-1">
            <Flame size={11} style={{ color: '#f97316' }} />
            <span className="text-[11px] text-neutral-500 font-medium">Streak active</span>
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

          {total === 0 && (
            <p className="text-[10px] text-neutral-400 text-center">No swipes in the last 24h</p>
          )}
        </>
      )}
    </div>
  );
}
