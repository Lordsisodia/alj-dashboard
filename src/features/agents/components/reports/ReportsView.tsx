'use client';

import { useState, type ReactNode } from 'react';
import { FileText, Lightbulb, Clock } from 'lucide-react';
import { REPORTS, REPORT_CAT_COLOR } from '../../constants';
import type { ReportCategory } from '../../types';
import { ReportsContent } from './ReportsContent';
import { relativeTime } from './utils';

type FilterCategory = ReportCategory | 'All';
const FILTER_CHIPS: FilterCategory[] = ['All', 'Intelligence', 'Recon', 'Performance'];

function StatPill({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold"
      style={{ backgroundColor: 'rgba(0,0,0,0.04)', color: '#555' }}
    >
      {icon}
      {children}
    </div>
  );
}

export function ReportsView() {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('All');
  const totalInsights = REPORTS.reduce((sum, r) => sum + r.insights.length, 0);
  const lastGenerated = REPORTS.length > 0 ? Math.max(...REPORTS.map(r => r.generatedAt)) : null;

  return (
    <div className="space-y-5">
      {/* Stats bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <StatPill icon={<FileText size={12} style={{ color: '#ff0069' }} />}>
          <span><strong className="text-neutral-800">{REPORTS.length}</strong> reports</span>
        </StatPill>
        <StatPill icon={<Lightbulb size={12} style={{ color: '#4a9eff' }} />}>
          <span><strong className="text-neutral-800">{totalInsights}</strong> insights</span>
        </StatPill>
        {lastGenerated && (
          <StatPill icon={<Clock size={12} style={{ color: '#78c257' }} />}>
            <span>Last generated <strong className="text-neutral-800">{relativeTime(lastGenerated)}</strong></span>
          </StatPill>
        )}
      </div>

      {/* Category filter chips */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTER_CHIPS.map(cat => {
          const isActive = activeCategory === cat;
          const color = cat === 'All' ? '#555' : REPORT_CAT_COLOR[cat as ReportCategory];
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide transition-all duration-150"
              style={isActive
                ? { backgroundColor: cat === 'All' ? 'rgba(0,0,0,0.12)' : color, color: cat === 'All' ? '#222' : '#fff', border: '1px solid transparent' }
                : { backgroundColor: 'transparent', color: '#aaa', border: '1px solid rgba(0,0,0,0.10)' }
              }
            >
              {cat}
            </button>
          );
        })}
      </div>

      <ReportsContent category={activeCategory} />
    </div>
  );
}
