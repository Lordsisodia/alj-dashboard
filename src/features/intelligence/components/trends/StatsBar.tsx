'use client';

import { TrendingUp, ScanSearch, FileStack, Users, XCircle } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface Props {
  days:      number;
  niche?:    string;
  platform?: string;
  metric?:   'er' | 'views';
}

export function StatsBar({ days, niche = 'all', platform = 'all' }: Props) {
  const dashboardStats  = useQuery(api.intelligence.getReconDashboardStats);
  const allCandidates  = useQuery(api.candidates.list, {});
  const trackedAccounts = useQuery(api.trackedAccounts.list);

  const pending        = allCandidates?.filter(c => c.status === 'pending').length   ?? 0;
  const scraped        = allCandidates?.filter(c => c.status === 'approved').length  ?? 0;
  const rejected       = allCandidates?.filter(c => c.status === 'rejected').length  ?? 0;
  const totalTracked   = dashboardStats?.totalCreators ?? 0;

  // Compute avg* from trackedAccounts
  const accounts = trackedAccounts ?? [];
  const avgViewsRaw       = accounts.filter(a => a.avgViews != null).reduce((s, a) => s + (a.avgViews ?? 0), 0) / Math.max(accounts.filter(a => a.avgViews != null).length, 1);
  const avgEngagementRaw  = accounts.filter(a => a.avgEngagementRate != null).reduce((s, a) => s + (a.avgEngagementRate ?? 0), 0) / Math.max(accounts.filter(a => a.avgEngagementRate != null).length, 1);
  const avgFollowersRaw  = accounts.filter(a => a.followerCount != null).reduce((s, a) => s + a.followerCount, 0) / Math.max(accounts.filter(a => a.followerCount != null).length, 1);

  // top niche
  const nicheCounts: Record<string, number> = {};
  accounts.forEach(a => { if (a.niche) nicheCounts[a.niche] = (nicheCounts[a.niche] ?? 0) + 1; });
  const topNiche = Object.entries(nicheCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';

  return (
    <div className="flex items-center gap-2 flex-wrap px-4 pt-3">
      <StatPill icon={<Users      size={10} />} value={pending}        label="pending"        color="#7f1d1d" />
      <StatPill icon={<ScanSearch  size={10} />} value={scraped}       label="scraped"        color="#991b1b" />
      <StatPill icon={<XCircle     size={10} />} value={rejected}      label="rejected"       color="#7f1d1d" />
      <StatPill icon={<TrendingUp  size={10} />} value={totalTracked}  label="approved"       color="#991b1b" />
      <StatPill icon={<FileStack   size={10} />} value={Math.round(avgViewsRaw).toLocaleString()} label="avg views"     color="#7f1d1d" />
      <StatPill icon={<TrendingUp  size={10} />} value={avgEngagementRaw.toFixed(1) + '%'} label="avg eng."  color="#7f1d1d" />
      <StatPill icon={<Users       size={10} />} value={Math.round(avgFollowersRaw).toLocaleString()} label="avg followers" color="#7f1d1d" />
      {topNiche && (
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white"
          style={{ border: '1px solid rgba(0,0,0,0.07)' }}
        >
          <span className="text-[10px] font-semibold text-neutral-500">Top niche</span>
          <span className="w-px h-3 bg-neutral-300" />
          <span className="text-[11px] font-bold text-neutral-700">{topNiche}</span>
        </div>
      )}
    </div>
  );
}

function StatPill({ icon, value, label, color }: { icon: React.ReactNode; value: number | string; label: string; color: string }) {
  return (
    <div
      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white"
      style={{ border: '1px solid rgba(0,0,0,0.07)' }}
    >
      <span style={{ color }}>{icon}</span>
      <span className="text-[12px] font-bold tabular-nums" style={{ color }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </span>
      <span className="text-[10px] text-neutral-400">{label}</span>
    </div>
  );
}
