import { Award } from 'lucide-react';
import { LEADERBOARD_ENTRIES } from '../../constants';
import { fmtK } from '../../utils';

export function LeaderboardSidebar() {
  return (
    <div className="space-y-3">
      <div className="rounded-xl overflow-hidden bg-white" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
        <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <Award size={14} style={{ color: '#d97706' }} />
          <span className="text-xs font-semibold text-neutral-900">Top Creators</span>
        </div>
        <div>
          {LEADERBOARD_ENTRIES.map((entry, i) => (
            <div
              key={entry.handle}
              className="px-4 py-3 flex items-center gap-3 hover:bg-black/[0.025] transition-colors"
              style={{ borderBottom: i < LEADERBOARD_ENTRIES.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}
            >
              <span
                className="text-sm font-black w-4 flex-shrink-0 text-center"
                style={{ color: entry.rank === 1 ? '#d97706' : entry.rank === 2 ? '#a3a3a3' : entry.rank === 3 ? '#cd7f32' : '#d4d4d4' }}
              >
                {entry.rank}
              </span>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0" style={{ backgroundColor: entry.color }}>
                {entry.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-neutral-800 truncate">{entry.handle}</p>
                <p className="text-[10px] text-neutral-400">{fmtK(entry.followers)} followers</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-bold" style={{ color: '#ff0069' }}>{entry.engagementRate}%</p>
                <p className="text-[9px] text-neutral-400">eng.</p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-2.5 text-center" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <a href="#" className="text-[11px] font-semibold hover:underline" style={{ color: '#ff0069' }}>
            View full leaderboard →
          </a>
        </div>
      </div>

    </div>
  );
}
