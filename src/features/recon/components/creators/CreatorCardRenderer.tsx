'use client';

import type { Competitor } from '../../types';
import { CreatorCard } from './CreatorCard';

interface CreatorCardRendererProps {
  creators:     (Competitor & { _totalPosts?: number })[];
  isEnriching:  (handle: string) => boolean;
  selected:     Set<number>;
  onOpen:       (c: Competitor) => void;
  toggleSelect: (id: number, e: React.MouseEvent) => void;
  toggleFavorite: (id: number, e: React.MouseEvent) => void;
  enrich:       (handle: string) => void;
}

export function CreatorCardRenderer({
  creators, isEnriching, selected, onOpen, toggleSelect, toggleFavorite, enrich,
}: CreatorCardRendererProps) {
  return (
    <>
      {creators.map(c => (
        <CreatorCard
          key={c.id}
          creator={c}
          isEnriching={isEnriching(c.handle)}
          isSelected={selected.has(c.id)}
          onOpen={() => onOpen(c)}
          onSelect={e => toggleSelect(c.id, e)}
          onFavorite={e => toggleFavorite(c.id, e)}
          onEnrich={e => { e.stopPropagation(); enrich(c.handle); }}
        />
      ))}
    </>
  );
}
