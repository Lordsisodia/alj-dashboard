export default function PartnersCampusLoading() {
  return (
    <div className="min-h-screen bg-[#050505] text-neutral-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 lg:flex-row lg:gap-12">
        <aside className="flex w-full flex-row gap-4 lg:w-64 lg:flex-col">
          <div className="flex w-16 flex-col items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-2 py-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={`nav-icon-${index}`} className="size-10 animate-pulse rounded-xl bg-white/10" />
            ))}
          </div>
          <div className="hidden flex-1 rounded-2xl border border-white/10 bg-white/5 p-4 lg:block">
            <div className="mb-3 h-4 w-32 animate-pulse rounded-full bg-white/10" />
            <div className="mb-4 h-5 w-48 animate-pulse rounded-full bg-white/5" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={`nav-detail-${index}`} className="h-4 w-full animate-pulse rounded-full bg-white/10" />
              ))}
            </div>
          </div>
        </aside>
        <main className="flex-1 space-y-6">
          <div className="space-y-3">
            <div className="h-4 w-28 animate-pulse rounded-full bg-white/10" />
            <div className="h-10 w-3/4 animate-pulse rounded-full bg-white/5" />
            <div className="h-4 w-1/2 animate-pulse rounded-full bg-white/10" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`campus-card-${index}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="mb-2 h-4 w-24 animate-pulse rounded-full bg-white/10" />
                <div className="mb-6 h-6 w-2/3 animate-pulse rounded-full bg-white/5" />
                <div className="space-y-2">
                  <div className="h-3 w-full animate-pulse rounded-full bg-white/5" />
                  <div className="h-3 w-3/4 animate-pulse rounded-full bg-white/5" />
                  <div className="h-3 w-2/3 animate-pulse rounded-full bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
