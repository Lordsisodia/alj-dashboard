'use client';

import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Filter } from 'lucide-react';
import { QualifyTableRow } from './QualifyTableRow';
import { QualifyTableSkeleton } from './QualifyTableSkeleton';
import type { QualifyPost } from './QualifyTableRow';

type SortKey = 'baselineScore' | 'views' | 'likes' | 'comments' | 'handle' | 'postedAt';

interface Props {
  posts: QualifyPost[];
  isLoading: boolean;
  search: string;
  band: number;
  sortKey: SortKey;
  sortAsc: boolean;
  onClearFilters: () => void;
}

export function QualifyTableBody({
  posts, isLoading, search, band, sortKey, sortAsc, onClearFilters,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: posts.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 48,
    overscan: 8,
  });

  if (isLoading) {
    return <QualifyTableSkeleton />;
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#f5f5f4' }}>
          <Filter size={20} className="text-neutral-300" />
        </div>
        {search || band > 0 ? (
          <>
            <p className="text-sm font-semibold text-neutral-600">No reels match your filters</p>
            <p className="text-xs text-neutral-400">Try a broader search or lower the multiplier threshold</p>
            <button
              onClick={onClearFilters}
              className="mt-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
              style={{ backgroundColor: '#f5f5f4', color: '#666' }}
            >
              Clear filters
            </button>
          </>
        ) : (
          <p className="text-sm font-medium text-neutral-400">No reels indexed yet</p>
        )}
      </div>
    );
  }

  return (
    <div ref={scrollRef} style={{ height: 'calc(100vh - 380px)', overflowY: 'auto' }}>
      <div style={{ height: rowVirtualizer.getTotalSize(), position: 'relative' }}>
        {rowVirtualizer.getVirtualItems().map(vRow => {
          const post = posts[vRow.index];
          return (
            <div
              key={post._id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                transform: `translateY(${vRow.start}px)`,
              }}
            >
              <QualifyTableRow post={post} rowIdx={vRow.index} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
