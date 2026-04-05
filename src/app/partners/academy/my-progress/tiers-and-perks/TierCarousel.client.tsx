"use client";

import { useState } from "react";

type Tier = {
  level: number;
  name: string;
  points: number;
  requirement: string;
  perks: string[];
};

interface TierCarouselProps {
  tiers: Tier[];
}

export function TierCarousel({ tiers }: TierCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="text-sm text-white">
      <div className="rounded-[28px] border border-white/10 bg-siso-bg-secondary/70 p-1.5 shadow-[0_20px_45px_rgba(0,0,0,0.45)]">
        <div className="relative overflow-hidden rounded-[22px] border border-white/10 siso-inner-card">
          <div className="flex transition-transform duration-300 ease-out" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
            {tiers.map((tier) => (
              <div
                key={tier.level}
                className="min-w-full space-y-4 px-6 py-6"
                style={{ scrollSnapAlign: "start" }}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-white/70">Tier {tier.level}</p>
                    <p className="text-2xl font-semibold text-white">{tier.name}</p>
                    <p className="text-xs text-siso-text-muted">
                      Requirement: {tier.requirement} • {tier.points} pts
                    </p>
                  </div>
                  <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/80">
                    {tier.points} pts
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tier.perks.map((perk) => (
                    <span
                      key={perk}
                      className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/80"
                    >
                      {perk}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 border-t border-white/10 bg-siso-bg-secondary/80 py-3">
            {tiers.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Go to tier ${idx + 1}`}
                className={`h-2.5 w-2.5 rounded-full transition ${idx === activeIndex ? "bg-siso-orange" : "bg-white/25"}`}
                onClick={() => setActiveIndex(idx)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
