"use client";

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B0F1A] px-6 py-12 text-white">
      <div className="max-w-md space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
        <div className="text-2xl font-semibold">You're offline</div>
        <p className="text-sm text-white/70">
          We'll reconnect automatically when your connection returns. Any saved
          changes will sync once you're back online.
        </p>
        <div className="flex gap-3">
          <a
            href=""
            className="rounded-lg bg-white/90 px-4 py-2 text-sm font-medium text-black transition hover:bg-white"
          >
            Retry
          </a>
          <a
            href="/"
            className="rounded-lg border border-white/30 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white hover:text-white"
          >
            Go home
          </a>
        </div>
      </div>
    </main>
  );
}
