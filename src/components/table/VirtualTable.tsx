'use client';

import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { SearchX } from 'lucide-react';

export interface VirtualTableProps<T> {
  // Data
  data: T[];
  isLoading?: boolean;
  keyExtractor: (item: T) => string | number;

  // Layout — caller computes these from their column defs
  gridCols: string;          // CSS grid-template-columns
  tableWidth: number;        // minimum table width in px
  rowHeight?: number;        // estimated row height (default: 48)
  containerHeight?: string;  // fixed scroll height — omit to use flex-1 (fills parent)
  paddingBottom?: number;    // extra space after last row (default: 16)

  // Rendering
  renderHeader: () => React.ReactNode;
  renderRow: (item: T, idx: number) => React.ReactNode;

  // States
  emptyState?: React.ReactNode;
  loadingState?: React.ReactNode;
}

function DefaultEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
      <SearchX size={28} className="mb-3 opacity-30" />
      <p className="text-sm font-medium">No results match</p>
      <p className="text-xs mt-1 opacity-70">Try adjusting your filters</p>
    </div>
  );
}

export function VirtualTable<T>({
  data,
  isLoading,
  keyExtractor,
  gridCols,
  tableWidth,
  rowHeight = 48,
  containerHeight,
  paddingBottom = 16,
  renderHeader,
  renderRow,
  emptyState,
  loadingState,
}: VirtualTableProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    overscan: 8,
    paddingEnd: paddingBottom,
  });

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-x-auto">
      {/* Sticky header */}
      <div style={{ width: tableWidth, minWidth: '100%' }}>
        {renderHeader()}
      </div>

      {isLoading ? (
        loadingState ?? (
          <DefaultSkeleton gridCols={gridCols} rowHeight={rowHeight} />
        )
      ) : data.length === 0 ? (
        emptyState ?? <DefaultEmptyState />
      ) : (
        <div
          ref={scrollRef}
          className={containerHeight ? undefined : 'flex-1 min-h-0'}
          style={{ height: containerHeight, overflowY: 'auto', minWidth: tableWidth }}
        >
          <div style={{ height: rowVirtualizer.getTotalSize(), position: 'relative', width: tableWidth }}>
            {rowVirtualizer.getVirtualItems().map(vRow => {
              const item = data[vRow.index];
              return (
                <div
                  key={keyExtractor(item)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: tableWidth,
                    transform: `translateY(${vRow.start}px)`,
                  }}
                >
                  {renderRow(item, vRow.index)}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function DefaultSkeleton({ gridCols, rowHeight }: { gridCols: string; rowHeight: number }) {
  return (
    <div>
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="grid items-center px-4 gap-4"
          style={{ gridTemplateColumns: gridCols, height: rowHeight, borderBottom: '1px solid rgba(0,0,0,0.06)' }}
        >
          <div className="h-3 w-4 rounded bg-neutral-100 animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-neutral-100 animate-pulse flex-shrink-0" />
            <div className="space-y-1.5">
              <div className="h-2.5 w-20 rounded bg-neutral-100 animate-pulse" />
              <div className="h-2 w-10 rounded bg-neutral-100 animate-pulse" />
            </div>
          </div>
          <div className="h-3 w-12 rounded bg-neutral-100 animate-pulse ml-auto" />
          <div className="h-3 w-10 rounded bg-neutral-100 animate-pulse ml-auto" />
        </div>
      ))}
    </div>
  );
}
