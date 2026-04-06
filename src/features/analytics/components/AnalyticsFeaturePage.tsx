'use client';

import { useState } from 'react';
import { BarChart2, TrendingUp, DollarSign, Users, Heart, MessageCircle, Bookmark, Eye } from 'lucide-react';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon } from '@/isso/layout/ProductIcon';
import type { Tab, ModelId } from '../types';
import { PER_MODEL_DATA, MODEL_PROFILES } from '../constants';
import { StatCard, SectionCard } from './stats';
import { FollowerChart, EngagementBars } from './charts';
import { TopPostsTable } from './tables';
import { AudienceInsights } from './insights';
import { ModelAccountHeader } from './header';
import { RevenuePlaceholder } from './placeholders';

export default function AnalyticsFeaturePage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [activeFilter, setActiveFilter] = useState('30d');
  const [selectedModel, setSelectedModel] = useState<ModelId>('tyler');

  const data = PER_MODEL_DATA[selectedModel];
  const { stats } = data;

  const primaryStats = [
    { label: 'Followers',       value: stats.followers,      icon: <Users size={15} />,      iconColor: '#ff0069', change: 2.4, changeLabel: 'vs last period', delay: 0,    suffix: ''  },
    { label: 'Following',       value: stats.following,      icon: <Users size={15} />,      iconColor: '#833ab4',                                              delay: 0.07, suffix: ''  },
    { label: 'Posts',           value: stats.posts,          icon: <BarChart2 size={15} />,  iconColor: '#7c3aed',                                              delay: 0.14, suffix: ''  },
    { label: 'Engagement Rate', value: stats.engagementRate, icon: <TrendingUp size={15} />, iconColor: '#16a34a', change: 0.3, changeLabel: 'vs last period', delay: 0.21, suffix: '%' },
  ];

  const secondaryStats = [
    { label: 'Avg Likes',    value: stats.avgLikes,    icon: <Heart size={14} />,         iconColor: '#ff0069', delay: 0.28, suffix: '' },
    { label: 'Avg Comments', value: stats.avgComments, icon: <MessageCircle size={14} />, iconColor: '#833ab4', delay: 0.35, suffix: '' },
    { label: 'Avg Saves',    value: stats.avgSaves,    icon: <Bookmark size={14} />,      iconColor: '#7c3aed', delay: 0.42, suffix: '' },
    { label: 'Avg Reach',    value: stats.avgReach,    icon: <Eye size={14} />,           iconColor: '#0ea5e9', delay: 0.49, suffix: '' },
  ];

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
            {/* Per-model account header + switcher */}
            <ModelAccountHeader
              profiles={MODEL_PROFILES}
              selectedId={selectedModel}
              onSelect={setSelectedModel}
              stats={stats}
            />

            {/* Primary stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {primaryStats.map(s => <StatCard key={s.label} {...s} />)}
            </div>

            {/* Secondary stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {secondaryStats.map(s => <StatCard key={s.label} {...s} />)}
            </div>

            {/* Follower growth chart */}
            <SectionCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-neutral-900">Follower Growth</h3>
                <span className="text-[11px] text-neutral-400">Jan - Dec 2026</span>
              </div>
              <FollowerChart data={data.followerGrowth} />
            </SectionCard>

            {/* Top posts + engagement */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className="md:col-span-3">
                <TopPostsTable posts={data.topPosts} />
              </div>
              <div className="md:col-span-2">
                <SectionCard>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-4">Engagement Over Time</h3>
                  <EngagementBars data={data.engagementData} />
                </SectionCard>
              </div>
            </div>

            {/* Audience insights */}
            <AudienceInsights data={data} />
          </>
        )}
      </div>
    </ContentPageShell>
  );
}
