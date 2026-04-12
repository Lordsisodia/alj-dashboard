'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, TrendingUp, Users, LayoutGrid, BarChart2, PieChart } from 'lucide-react';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { StatCard } from './stats/StatCard';
import { EngagementBars } from './charts/EngagementBars';
import { FollowerChart } from './charts/FollowerChart';
import { TopPostsTable } from './tables/TopPostsTable';
import { AudienceInsights } from './insights/AudienceInsights';
import type { Tab, Period, ModelProfile } from '../types';
import {
  MODEL_PROFILES,
  PER_MODEL_DATA,
  FOLLOWER_GROWTH_DATA,
  ENGAGEMENT_DATA,
  REVENUE_PERIODS,
} from '../constants';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview',  label: 'Overview' },
  { id: 'growth',    label: 'Growth' },
  { id: 'revenue',   label: 'Revenue' },
];

const PERIODS: { id: Period; label: string }[] = [
  { id: '7d',  label: '7D' },
  { id: '30d', label: '30D' },
  { id: '90d', label: '90D' },
];

export default function AgencyAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [activePeriod, setActivePeriod] = useState<Period>('30d');

  const revenueData = REVENUE_PERIODS[activePeriod];

  const kpiCards = [
    {
      label: 'Total Revenue',
      value: revenueData.total,
      prefix: '£',
      icon: <DollarSign size={16} />,
      iconColor: '#ff0069',
      change: 18,
      changeLabel: 'vs last period',
      delay: 0,
    },
    {
      label: 'Avg Engagement',
      value: 5.4,
      suffix: '%',
      icon: <TrendingUp size={16} />,
      iconColor: '#833ab4',
      change: 12,
      changeLabel: 'vs last period',
      delay: 0.1,
    },
    {
      label: 'Active Models',
      value: 4,
      icon: <Users size={16} />,
      iconColor: '#ff0069',
      change: 0,
      changeLabel: 'models',
      delay: 0.2,
    },
    {
      label: 'Content Output',
      value: 847,
      icon: <LayoutGrid size={16} />,
      iconColor: '#833ab4',
      change: 24,
      changeLabel: 'posts this month',
      delay: 0.3,
    },
  ];

  return (
    <ContentPageShell title="Analytics">
      {/* Tab bar */}
      <div className="flex items-center gap-1 mb-6">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative px-4 py-2 text-sm font-medium rounded-xl transition-all"
            style={
              activeTab === tab.id
                ? { color: '#fff', background: 'linear-gradient(135deg, #ff0069, #833ab4)' }
                : { color: '#737373', background: 'transparent' }
            }
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute inset-0 rounded-xl"
                style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)', zIndex: -1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}

        {/* Period toggle — right aligned */}
        <div className="ml-auto flex items-center gap-1 rounded-xl p-1" style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}>
          {PERIODS.map(p => (
            <button
              key={p.id}
              onClick={() => setActivePeriod(p.id)}
              className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all"
              style={
                activePeriod === p.id
                  ? { background: '#ff0069', color: '#fff' }
                  : { color: '#737373' }
              }
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {kpiCards.map(card => (
                <StatCard key={card.label} {...card} />
              ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* Follower Chart */}
              <div
                className="rounded-xl bg-white p-5"
                style={{ border: '1px solid rgba(0,0,0,0.07)' }}
              >
                <div className="flex items-center gap-1.5 mb-4">
                  <BarChart2 size={14} style={{ color: '#ff0069' }} />
                  <h3 className="text-sm font-semibold text-neutral-900">Follower Growth</h3>
                </div>
                <FollowerChart data={FOLLOWER_GROWTH_DATA} />
              </div>

              {/* Engagement Bars */}
              <div
                className="rounded-xl bg-white p-5"
                style={{ border: '1px solid rgba(0,0,0,0.07)' }}
              >
                <div className="flex items-center gap-1.5 mb-4">
                  <TrendingUp size={14} style={{ color: '#ff0069' }} />
                  <h3 className="text-sm font-semibold text-neutral-900">Engagement Rate</h3>
                </div>
                <EngagementBars data={ENGAGEMENT_DATA} />
              </div>
            </div>

            {/* Top Posts */}
            <TopPostsTable posts={PER_MODEL_DATA.tyler.topPosts} />

            {/* Audience Insights */}
            <AudienceInsights data={PER_MODEL_DATA.tyler} />
          </motion.div>
        )}

        {activeTab === 'growth' && (
          <motion.div
            key="growth"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            {/* Model revenue breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div
                className="rounded-xl bg-white p-5"
                style={{ border: '1px solid rgba(0,0,0,0.07)' }}
              >
                <div className="flex items-center gap-1.5 mb-4">
                  <BarChart2 size={14} style={{ color: '#ff0069' }} />
                  <h3 className="text-sm font-semibold text-neutral-900">Revenue by Model — {activePeriod.toUpperCase()}</h3>
                </div>
                <div className="space-y-3">
                  {MODEL_PROFILES.map((model, i) => {
                    const pct = (revenueData.modelRevenue[model.id] / revenueData.total) * 100;
                    return (
                      <div key={model.id} className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                          style={{ background: `linear-gradient(135deg, ${model.color}, ${model.color}88)` }}
                        >
                          {model.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-neutral-800">{model.displayName}</span>
                            <span className="text-xs font-bold" style={{ color: model.color }}>
                              £{revenueData.modelRevenue[model.id].toLocaleString()}
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}>
                            <motion.div
                              className="h-full rounded-full"
                              style={{ background: `linear-gradient(90deg, ${model.color}, ${model.color}88)` }}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ delay: i * 0.1, duration: 0.65 }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Combined Follower Chart */}
              <div
                className="rounded-xl bg-white p-5"
                style={{ border: '1px solid rgba(0,0,0,0.07)' }}
              >
                <div className="flex items-center gap-1.5 mb-4">
                  <Users size={14} style={{ color: '#ff0069' }} />
                  <h3 className="text-sm font-semibold text-neutral-900">Combined Follower Growth</h3>
                </div>
                <FollowerChart data={FOLLOWER_GROWTH_DATA} />
              </div>
            </div>

            {/* Audience Insights */}
            <AudienceInsights data={PER_MODEL_DATA.tyler} />
          </motion.div>
        )}

        {activeTab === 'revenue' && (
          <motion.div
            key="revenue"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            {/* Revenue KPI row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard
                label="Total Revenue"
                value={revenueData.total}
                prefix="£"
                icon={<DollarSign size={16} />}
                iconColor="#ff0069"
                change={18}
                changeLabel="vs last period"
                delay={0}
              />
              <StatCard
                label="Top Model"
                value={4200}
                prefix="£"
                icon={<TrendingUp size={16} />}
                iconColor="#833ab4"
                changeLabel="Tyler Rex"
                delay={0.1}
              />
              <StatCard
                label="Avg per Model"
                value={Math.round(revenueData.total / 4)}
                prefix="£"
                icon={<PieChart size={16} />}
                iconColor="#ff0069"
                change={8}
                changeLabel="vs last period"
                delay={0.2}
              />
              <StatCard
                label="Posts This Period"
                value={activePeriod === '7d' ? 84 : activePeriod === '30d' ? 387 : 847}
                icon={<LayoutGrid size={16} />}
                iconColor="#833ab4"
                change={24}
                changeLabel="vs last period"
                delay={0.3}
              />
            </div>

            {/* Revenue by model breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {MODEL_PROFILES.map((model, i) => {
                const rev = revenueData.modelRevenue[model.id];
                const pct = (rev / revenueData.total) * 100;
                return (
                  <motion.div
                    key={model.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-xl bg-white p-5"
                    style={{ border: '1px solid rgba(0,0,0,0.07)' }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                        style={{ background: `linear-gradient(135deg, ${model.color}, ${model.color}88)` }}
                      >
                        {model.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">{model.displayName}</p>
                        <p className="text-[11px] text-neutral-500">{model.niche}</p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-lg font-bold" style={{ color: model.color }}>
                          £{rev.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-neutral-400">{pct.toFixed(1)}% of total</p>
                      </div>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${model.color}, ${model.color}88)` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: i * 0.08 + 0.2, duration: 0.65 }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ContentPageShell>
  );
}
