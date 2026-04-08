'use client';

/** Full-tab loading placeholder — used as the `loading` prop for dynamic() tab components. */
export function TabSkeleton() {
  return (
    <div className="w-full space-y-3 px-1 py-2 animate-pulse">
      <div className="h-8 w-48 rounded-lg bg-white/[0.06]" />
      <div className="grid grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-white/[0.04]" />
        ))}
      </div>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-12 rounded-lg bg-white/[0.04]" />
      ))}
    </div>
  );
}
