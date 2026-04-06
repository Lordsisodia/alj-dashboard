export function ReportsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="rounded-xl overflow-hidden animate-pulse"
          style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
        >
          <div style={{ height: 3, backgroundColor: 'rgba(0,0,0,0.08)' }} />
          <div className="p-5 space-y-3">
            <div className="flex gap-2">
              <div className="h-4 w-20 rounded-md" style={{ backgroundColor: 'rgba(0,0,0,0.07)' }} />
              <div className="h-4 w-28 rounded-md" style={{ backgroundColor: 'rgba(0,0,0,0.05)' }} />
            </div>
            <div className="h-4 w-3/4 rounded" style={{ backgroundColor: 'rgba(0,0,0,0.07)' }} />
            <div className="h-10 rounded-lg" style={{ backgroundColor: 'rgba(0,0,0,0.04)' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
