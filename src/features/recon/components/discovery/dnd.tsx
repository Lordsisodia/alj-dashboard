'use client';

import type { ReactNode } from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import type { MappedCandidate } from './data';

export type { ColumnId } from './data';

export function DraggableCard({ id, column, children }: { id: string; column: import('./data').ColumnId; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id, data: { column } });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        opacity:     isDragging ? 0 : 1,
        cursor:      isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
        userSelect:  'none',
      }}
    >
      {children}
    </div>
  );
}

export function DroppableZone({ id, isOver, children }: { id: import('./data').ColumnId; isOver: boolean; children: ReactNode }) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ borderRadius: 12, transition: 'box-shadow 0.15s', boxShadow: isOver ? '0 0 0 2px #991b1b66' : 'none' }}
    >
      {children}
    </div>
  );
}

export function DragGhost({ c }: { c: MappedCandidate }) {
  return (
    <div
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg shadow-xl"
      style={{ border: '1px solid rgba(153,27,27,0.25)', backgroundColor: '#fff', opacity: 0.95, width: 180, cursor: 'grabbing' }}
    >
      {c.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={c.avatarUrl} alt="" className="w-5 h-5 rounded flex-shrink-0 object-cover" />
      ) : (
        <span className="text-[9px] font-bold flex-shrink-0 w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: 'rgba(153,27,27,0.08)', color: '#991b1b' }}>
          {c.initials}
        </span>
      )}
      <p className="text-[11px] font-medium text-neutral-700 truncate flex-1">{c.handle}</p>
    </div>
  );
}
