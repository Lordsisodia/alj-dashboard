export default function PartnersHubLoading() {
  return (
    <div className="min-h-screen bg-siso-bg-primary text-siso-text-primary">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-12 lg:px-8">
        <header className="space-y-3">
          <div className="h-4 w-32 animate-pulse rounded-full bg-white/10" />
          <div className="h-10 w-2/3 animate-pulse rounded-full bg-white/5" />
          <div className="h-4 w-40 animate-pulse rounded-full bg-white/10" />
        </header>
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={`hub-card-${index}`} className="rounded-2xl border border-white/5 bg-white/5 p-4 shadow-inner">
              <div className="mb-3 h-4 w-1/2 animate-pulse rounded-full bg-white/10" />
              <div className="mb-4 h-6 w-2/3 animate-pulse rounded-full bg-white/5" />
              <div className="space-y-2">
                <div className="h-3 w-full animate-pulse rounded-full bg-white/5" />
                <div className="h-3 w-5/6 animate-pulse rounded-full bg-white/5" />
                <div className="h-3 w-2/3 animate-pulse rounded-full bg-white/10" />
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
