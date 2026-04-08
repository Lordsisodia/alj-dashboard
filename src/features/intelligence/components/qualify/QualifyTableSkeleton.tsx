'use client';

const COL_SKELETON = '40px 200px 90px 80px 76px 80px 90px';

export function QualifyTableSkeleton() {
  return (
    <div className="space-y-0">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="grid items-center px-4 gap-4"
          style={{ gridTemplateColumns: COL_SKELETON, height: 48, borderBottom: '1px solid rgba(0,0,0,0.06)' }}
        >
          <div className="h-3 w-4 rounded bg-neutral-100 animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-12 rounded bg-neutral-100 animate-pulse flex-shrink-0" />
            <div className="space-y-1.5">
              <div className="h-2.5 w-20 rounded bg-neutral-100 animate-pulse" />
              <div className="h-2 w-10 rounded bg-neutral-100 animate-pulse" />
            </div>
          </div>
          <div className="h-3 w-12 rounded bg-neutral-100 animate-pulse ml-auto" />
          <div className="h-3 w-10 rounded bg-neutral-100 animate-pulse ml-auto" />
          <div className="h-3 w-8 rounded bg-neutral-100 animate-pulse ml-auto" />
          <div className="h-3 w-10 rounded bg-neutral-100 animate-pulse ml-auto" />
          <div />
        </div>
      ))}
    </div>
  );
}
