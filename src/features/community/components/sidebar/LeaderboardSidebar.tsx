'use client';

import { Award } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { fmtK } from '../../utils';

function getInitials(handle: string) {
  const clean = handle.replace(/^@/, '');
  return clean.length >= 2 ? clean.slice(0, 2).toUpperCase() : clean.toUpperCase();
}

function hashColor(str: string) {
  const COLORS = ['#2563eb', '#3b82f6', '#1d4ed8', '#78c257', '#00b4d8', '#e85d04', '#7c3aed', '#0891b2'];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

const RANK_COLORS = ['#d97706', '#a3a3a3', '#cd7f32', '#d4d4d4', '#d4d4d4'];

export function LeaderboardSidebar() {
  const accounts = useQuery(api.trackedAccounts.list) ?? [];

  const top5 = [...accounts]
    .filter(a => a.avgEngagementRate != null)
    .sort((a, b) => (b.avgEngagementRate ?? 0) - (a.avgEngagementRate ?? 0))
    .slice(0, 20)
    .map((a, i) => ({ ...a, rank: i + 1 }));

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col rounded-xl overflow-hidden bg-white" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
        <div className="px-4 py-3 flex items-center gap-2 flex-shrink-0" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <Award size={14} style={{ color: '#d97706' }} />
          <span className="text-xs font-semibold text-neutral-900">Top Creators</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {top5.length === 0 && (
            <div className="px-4 py-6 text-center text-[11px] text-neutral-400">No creator data yet</div>
          )}
          {top5.map((entry, i) => (
            <div
              key={entry._id}
              className="px-4 py-3 flex items-center gap-3 hover:bg-black/[0.025] transition-colors"
              style={{ borderBottom: i < top5.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}
            >
              <span
                className="text-sm font-black w-4 flex-shrink-0 text-center"
                style={{ color: RANK_COLORS[i] ?? '#d4d4d4' }}
              >
                {entry.rank}
              </span>
              {entry.avatarUrl ? (
                <img
                  src={entry.avatarUrl}
                  alt={entry.handle}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div
                  className="w-8 h-8 min-w-[2rem] rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: entry.avatarColor ?? hashColor(entry.handle) }}
                >
                  {getInitials(entry.handle)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-neutral-800 truncate">{entry.handle}</p>
                <p className="text-[10px] text-neutral-400">{fmtK(entry.followerCount ?? 0)} followers</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-bold" style={{ color: '#2563eb' }}>{(entry.avgEngagementRate ?? 0).toFixed(1)}%</p>
                <p className="text-[9px] text-neutral-400">eng.</p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-2.5 text-center" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <a href="/isso/recon" className="text-[11px] font-semibold hover:underline" style={{ color: '#2563eb' }}>
            View creators list →
          </a>
        </div>
      </div>
    </div>
  );
}
