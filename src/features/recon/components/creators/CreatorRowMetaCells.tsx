'use client';

import { COL_BORDER } from './tableUtils';

function EmptyCell({ border = true }: { border?: boolean }) {
  return border
    ? <span className="block w-1.5 h-1.5 rounded-full bg-neutral-300 mx-auto" />
    : <span className="block w-1.5 h-1.5 rounded-full bg-neutral-300 mx-auto" />;
}

export function MetaCell({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-center" style={{ borderRight: COL_BORDER }}>{children}</div>;
}

export function MetaCellLeft({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div className="flex items-center px-3" style={{ borderRight: COL_BORDER, ...style }}>{children}</div>;
}

export function MetaCellRight({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-end px-3" style={{ borderRight: COL_BORDER }}>{children}</div>;
}

export { EmptyCell };
