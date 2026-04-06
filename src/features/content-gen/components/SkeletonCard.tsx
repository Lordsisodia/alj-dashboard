export function SkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden animate-pulse"
      style={{ backgroundColor: '#f5f5f4' }}
    >
      <div className="h-44 bg-neutral-200" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-neutral-200 rounded-lg w-2/3" />
        <div className="h-3 bg-neutral-200 rounded-lg w-1/2" />
        <div className="h-3 bg-neutral-200 rounded-lg w-1/3 mt-3" />
      </div>
    </div>
  );
}
