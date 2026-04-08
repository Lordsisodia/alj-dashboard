'use client';

import type { Competitor } from '../../../types';
import { CreatorRow } from './CreatorRow';
import type { ColVisibility } from '../tableUtils';

interface CreatorRowRendererProps {
  creators:     (Competitor & { _totalPosts?: number })[];
  rowVirtualizer: { getVirtualItems: () => { index: number; start: number }[] };
  tableWidth:    number;
  selected:      Set<number>;
  isEnriching:   (handle: string) => boolean;
  isScraping:    (handle: string) => boolean;
  colVis:        ColVisibility;
  gridCols:      string;
  onOpen:        (c: Competitor) => void;
  toggleSelect:  (id: number, e: React.MouseEvent) => void;
  toggleFavorite: (id: number, e: React.MouseEvent) => void;
  toggleStatus:  (id: number, e: React.MouseEvent) => void;
  enrich:         (handle: string) => void;
  scrapeMany:     (handles: string[]) => void;
}

export function CreatorRowRenderer({
  creators, rowVirtualizer, tableWidth, selected, isEnriching, isScraping, colVis, gridCols,
  onOpen, toggleSelect, toggleFavorite, toggleStatus, enrich, scrapeMany,
}: CreatorRowRendererProps) {
  return (
    <>
      {rowVirtualizer.getVirtualItems().map(vRow => {
        const c = creators[vRow.index];
        return (
          <div
            key={c.id}
            style={{ position: 'absolute', top: 0, left: 0, width: tableWidth, transform: `translateY(${vRow.start}px)` }}
          >
            <CreatorRow
              creator={c}
              rowIdx={vRow.index}
              isSelected={selected.has(c.id)}
              isEnriching={isEnriching(c.handle)}
              isScraping={isScraping(c.handle)}
              anySelected={selected.size > 0}
              colVis={colVis}
              gridCols={gridCols}
              onOpen={() => onOpen(c)}
              onSelect={e => toggleSelect(c.id, e)}
              onFavorite={e => toggleFavorite(c.id, e)}
              onToggleStatus={e => toggleStatus(c.id, e)}
              onEnrich={e => { e.stopPropagation(); enrich(c.handle); }}
              onScrape={() => scrapeMany([c.handle])}
            />
          </div>
        );
      })}
    </>
  );
}
