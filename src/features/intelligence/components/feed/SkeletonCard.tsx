export function SkeletonCard({ tall }: { tall?: boolean }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
      <div
        className={`w-full ${tall ? 'aspect-[4/5]' : 'aspect-video'} animate-pulse`}
        style={{ backgroundColor: '#f3f4f6' }}
      />
      <div className="px-3 py-2.5 flex items-center gap-3">
        <div className="h-2.5 w-10 rounded animate-pulse" style={{ backgroundColor: '#f3f4f6' }} />
        <div className="h-2.5 w-10 rounded animate-pulse" style={{ backgroundColor: '#f3f4f6' }} />
        <div className="h-2.5 w-10 rounded animate-pulse" style={{ backgroundColor: '#f3f4f6' }} />
      </div>
    </div>
  );
}
