'use client';

import { useState } from 'react';
import { BarChart2, TrendingUp, DollarSign, Users, Heart, MessageCircle, Bookmark, Eye } from 'lucide-react';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon } from '@/isso/layout/ProductIcon';
import type { Tab } from '../types';
import { FOLLOWER_GROWTH, ENGAGEMENT_DATA, TOP_POSTS } from '../constants';
import { StatCard, SectionCard } from './stats';
import { FollowerChart, EngagementBars } from './charts';
import { TopPostsTable } from './tables';
import { AudienceInsights } from './insights';
import { RevenuePlaceholder } from './placeholders';

const PRIMARY_STATS = [
  { label: 'Followers',       value: 245000, icon: <Users size={15} />,     iconColor: '#ff0069', change: 2.4, changeLabel: 'vs last period', delay: 0    },
  { label: 'Following',       value: 892,    icon: <Users size={15} />,     iconColor: '#833ab4',                                             delay: 0.07 },
  { label: 'Posts',           value: 1847,   icon: <BarChart2 size={15} />, iconColor: '#7c3aed',                                             delay: 0.14 },
  { label: 'Engagement Rate', value: 4.2,    icon: <TrendingUp size={15} />,iconColor: '#16a34a', change: 0.3, changeLabel: 'vs last period', delay: 0.21, suffix: '%' },
] as const;

const SECONDARY_STATS = [
  { label: 'Avg Likes',    value: 10300, icon: <Heart size={14} />,         iconColor: '#ff0069', delay: 0.28 },
  { label: 'Avg Comments', value: 389,   icon: <MessageCircle size={14} />, iconColor: '#833ab4', delay: 0.35 },
  { label: 'Avg Saves',    value: 236,   icon: <Bookmark size={14} />,      iconColor: '#7c3aed', delay: 0.42 },
  { label: 'Avg Reach',    value: 74200, icon: <Eye size={14} />,           iconColor: '#0ea5e9', delay: 0.49 },
] as const;

export default function AnalyticsFeaturePage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [activeFilter, setActiveFilter] = useState('30d');

  return (
    <ContentPageShell
      icon={<ProductIcon product="hub" size={32} />}
      title="Analytics"
      stat={{ label: 'Posts this week', value: 23 }}
      searchPlaceholder="Search models, metrics..."
      actionLabel="Export"
      actionIcon={<BarChart2 size={14} />}
      tabs={[
        { id: 'overview', label: 'Overview', icon: <BarChart2 size={13} /> },
        { id: 'growth',   label: 'Growth',   icon: <TrendingUp size={13} /> },
        { id: 'revenue',  label: 'Revenue',  icon: <DollarSign size={13} /> },
      ]}
      activeTab={activeTab}
      onTabChange={(id) => setActiveTab(id as Tab)}
      filterChips={[
        { id: '7d',  label: '7 days' },
        { id: '30d', label: '30 days' },
        { id: '90d', label: '90 days' },
        { id: '1y',  label: '1 year' },
      ]}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
    >
      <div className="p-4 space-y-4" style={{ backgroundColor: '#fafafa' }}>
        {activeTab === 'revenue' && <RevenuePlaceholder />}

        {(activeTab === 'overview' || activeTab === 'growth') && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {PRIMARY_STATS.map(s => (
                <StatCard key={s.label} {...s} />
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SECONDARY_STATS.map(s => (
                <StatCard key={s.label} {...s} />
              ))}
            </div>
            <SectionCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-neutral-900">Follower Growth</h3>
                <span className="text-[11px] text-neutral-400">Jan – Dec 2026</span>
              </div>
              <FollowerChart data={FOLLOWER_GROWTH} />
            </SectionCard>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className="md:col-span-3">
                <TopPostsTable posts={TOP_POSTS} />
              </div>
              <div className="md:col-span-2">
                <SectionCard>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-4">Engagement Over Time</h3>
                  <EngagementBars data={ENGAGEMENT_DATA} />
                </SectionCard>
              </div>
            </div>
            <AudienceInsights />
          </>
        )}
      </div>
    </ContentPageShell>
  );
}
