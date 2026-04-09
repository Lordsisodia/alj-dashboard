"use client";

import CountdownNumber from "@/components/ui/countdown-number";

interface ComingSoonProps {
  deadline?: Date;
  label?: string;
}

export default function ComingSoon({
  deadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  label = "Ready in",
}: ComingSoonProps) {
  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
    >
      <div
        className="flex flex-col items-center gap-4 px-8 py-6 rounded-2xl border border-neutral-200 shadow-lg"
        style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(4px)", boxShadow: "0 4px 32px rgba(0,0,0,0.10)" }}
      >
        {/* Coming Soon badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neutral-300 text-neutral-600 text-xs font-medium bg-white">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          Coming Soon
        </div>

        {/* Countdown */}
        <CountdownNumber
          endDate={deadline}
          className="pointer-events-auto"
          numberClassName="text-neutral-900"
          labelClassName="text-xs text-neutral-500 mt-1"
        />

        <p className="text-xs text-neutral-400 font-medium">{label}</p>
      </div>
    </div>
  );
}
