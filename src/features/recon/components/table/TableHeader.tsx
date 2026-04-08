'use client';

import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ColumnFilterHeader } from './filters/ColumnFilterHeader';
import { POSTS_OPTS, NICHE_OPTS, HEALTH_OPTS, COL_BORDER, type ColVisibility } from './tableUtils';
import type { CreatorFilters } from './filters/CreatorsFilterBar';

interface TableHeaderProps {
  colVis:       ColVisibility;
  filters:      CreatorFilters;
  set:          <K extends keyof CreatorFilters>(key: K, val: CreatorFilters[K]) => void;
  gridCols:     string;
  tableWidth:   number;
  allSelected:  boolean;
  someSelected: boolean;
  toggleSelectAll: () => void;
}

export function TableHeader({ colVis, filters, set, gridCols, tableWidth, allSelected, someSelected, toggleSelectAll }: TableHeaderProps) {
  const hdrCell = { borderRight: COL_BORDER };
  const hdrBase = 'flex items-center justify-center h-full text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400';

  const visibleCols = colVis
    ? Object.entries(colVis).filter(([, v]) => v).map(([k]) => k)
    : [];

  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: gridCols, height: 36, backgroundColor: '#fafafa', borderBottom: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 1px 0 rgba(0,0,0,0.04)', width: tableWidth, minWidth: '100%' }}
    >
      {/* Select-all checkbox */}
      <div className="flex items-center justify-center cursor-pointer" style={hdrCell} onClick={toggleSelectAll}>
        <div className={cn(
          'w-3.5 h-3.5 rounded flex items-center justify-center border transition-all',
          allSelected  ? 'bg-red-500 border-red-500' :
          someSelected ? 'bg-red-200 border-red-300' :
                         'border-neutral-300 bg-white hover:border-neutral-400',
        )}>
          {allSelected  && <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          {someSelected && !allSelected && <div className="w-1.5 h-0.5 rounded-full bg-red-500" />}
        </div>
      </div>

      <div className={hdrBase} style={hdrCell}>#</div>
      <ColumnFilterHeader label="Creator" style={hdrCell} />
      {visibleCols.map(key => {
        if (key === 'health')    return <ColumnFilterHeader key={key} label="Profile" options={HEALTH_OPTS} value={filters.health} onChange={v => set('health', v as string)} style={hdrCell} />;
        if (key === 'niche')     return <ColumnFilterHeader key={key} label="Niche" options={NICHE_OPTS} multi value={filters.niche} onChange={v => set('niche', v as string[])} style={hdrCell} />;
        if (key === 'followers') return <div key={key} className={`${hdrBase} justify-end pr-3`} style={hdrCell}>Followers</div>;
        if (key === 'following') return <div key={key} className={`${hdrBase} justify-end pr-3`} style={hdrCell}>Following</div>;
        if (key === 'posts')     return <ColumnFilterHeader key={key} label="Posts" options={POSTS_OPTS} value={filters.posts} align="right" onChange={v => set('posts', v as string)} style={hdrCell} />;
        if (key === 'engRate')   return <div key={key} className={`${hdrBase} justify-end pr-3`} style={hdrCell}>Eng. Rate</div>;
        if (key === 'score')     return <div key={key} className={hdrBase} style={hdrCell}>Score</div>;
        if (key === 'postsThisWeek') return <div key={key} className={hdrBase} style={hdrCell}>Posts/Wk</div>;
        if (key === 'category')  return <div key={key} className={hdrBase} style={hdrCell}>IG Category</div>;
        if (key === 'linkInBio') return <div key={key} className={`${hdrBase} justify-center`} style={hdrCell}>Link</div>;
        if (key === 'email')     return <div key={key} className={hdrBase} style={hdrCell}>Email</div>;
        if (key === 'verified')  return <div key={key} className={hdrBase} style={hdrCell}>Verified</div>;
        if (key === 'private')   return <div key={key} className={hdrBase} style={hdrCell}>Private</div>;
        if (key === 'enrichStatus') return <div key={key} className={hdrBase} style={hdrCell}>Enrich</div>;
        if (key === 'source')    return <div key={key} className={hdrBase} style={hdrCell}>Source</div>;
        if (key === 'igtvVideoCount') return <div key={key} className={hdrBase} style={hdrCell}>IGTV</div>;
        if (key === 'highlightReels') return <div key={key} className={hdrBase} style={hdrCell}>Highlights</div>;
        return null;
      })}
      <div className={hdrBase} style={hdrCell} title="Favorites"><Heart size={11} /></div>
      <div />
    </div>
  );
}
