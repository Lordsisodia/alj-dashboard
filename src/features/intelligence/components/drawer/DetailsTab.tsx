import { Heart, Eye, Bookmark } from 'lucide-react';
import { fmtNum, daysLive } from '../../utils';
import { NICHE_COLORS } from '../../constants';
import type { DrawerPost } from '../../types';

function PlatformBadge({ platform }: { platform: string }) {
  const isIg = platform === 'instagram' || platform === 'Instagram';
  if (isIg) {
    return (
      <span className="flex items-center gap-1 text-xs text-neutral-700">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="ig-dt" x1="0" y1="24" x2="24" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f09433"/><stop offset="50%" stopColor="#dc2743"/><stop offset="100%" stopColor="#bc1888"/>
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#ig-dt)"/>
          <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8" fill="none"/>
          <circle cx="17.2" cy="6.8" r="1.2" fill="white"/>
        </svg>
        Instagram
      </span>
    );
  }
  return <span className="text-xs text-neutral-700">TikTok</span>;
}

export function DetailsTab({ post }: { post: DrawerPost }) {
  const nicheColor = NICHE_COLORS[post.niche] ?? '#833ab4';

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: 'Account',    value: <span className="text-xs font-semibold text-neutral-800">{post.handle}</span> },
    { label: 'Platform',   value: <PlatformBadge platform={post.platform} /> },
    { label: 'Niche',      value: <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md text-white" style={{ backgroundColor: nicheColor }}>{post.niche}</span> },
    { label: 'Format',     value: <span className="text-xs text-neutral-700 capitalize">{post.contentType}</span> },
    { label: 'Days Live',  value: <span className="text-xs text-neutral-700">{daysLive(post.postedAt)}</span> },
    { label: 'Engagement', value: post.engagementRate !== undefined ? <span className="text-xs font-semibold" style={{ color: '#833ab4' }}>{post.engagementRate.toFixed(2)}%</span> : <span className="text-xs text-neutral-400">—</span> },
    { label: 'Likes',      value: <span className="flex items-center gap-1 text-xs text-neutral-700"><Heart    size={10} className="text-neutral-400" />{fmtNum(post.likes)}</span> },
    { label: 'Views',      value: <span className="flex items-center gap-1 text-xs text-neutral-700"><Eye      size={10} className="text-neutral-400" />{fmtNum(post.views)}</span> },
    { label: 'Saves',      value: <span className="flex items-center gap-1 text-xs text-neutral-700"><Bookmark size={10} className="text-neutral-400" />{fmtNum(post.saves)}</span> },
  ];

  return (
    <div className="space-y-0">
      {rows.map(({ label, value }) => (
        <div key={label} className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <span className="text-xs text-neutral-400 w-28 flex-shrink-0">{label}</span>
          {value}
        </div>
      ))}
    </div>
  );
}
