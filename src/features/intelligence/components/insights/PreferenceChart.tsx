'use client';

import { NICHE_COLORS } from '../../constants';
import type { NichePreference, FormatPreference } from '../../types';
import { BarRow } from './BarRow';

// ── Format color map ──────────────────────────────────────────────────────────

const FORMAT_COLORS: Record<string, string> = {
  reel:     '#ff0069',
  post:     '#4a9eff',
  carousel: '#f97316',
  story:    '#8b5cf6',
};

// ── Shared legend ─────────────────────────────────────────────────────────────

function Legend() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-[10px] text-neutral-400">Liked</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 rounded-full" style={{ background: 'linear-gradient(90deg, #ff0069, #833ab4)' }} />
        <span className="text-[10px] text-neutral-400">Saved</span>
      </div>
    </div>
  );
}

// ── Card shell ────────────────────────────────────────────────────────────────

function ChartCard({ title, subtitle, children }: {
  title:    string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl p-4 space-y-4"
      style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff' }}
    >
      <div>
        <p className="text-xs font-semibold text-neutral-900">{title}</p>
        <p className="text-[10px] text-neutral-400 mt-0.5">{subtitle}</p>
      </div>
      <Legend />
      {children}
    </div>
  );
}

const EMPTY = <p className="text-xs text-neutral-400 py-4 text-center">No ratings yet</p>;

// ── Niche preferences ─────────────────────────────────────────────────────────

export function NichePreferenceChart({ niches }: { niches: NichePreference[] }) {
  return (
    <ChartCard title="Niche preferences" subtitle="Which niches your team rates up & saves most">
      <div className="space-y-3">
        {niches.length === 0 ? EMPTY : niches.map((n, i) => (
          <BarRow
            key={n.niche}
            label={n.niche}
            upRate={n.upRate}
            saveRate={n.saveRate}
            total={n.total}
            color={(NICHE_COLORS as Record<string, string>)[n.niche] ?? '#833ab4'}
            index={i}
          />
        ))}
      </div>
    </ChartCard>
  );
}

// ── Format preferences ────────────────────────────────────────────────────────

export function FormatPreferenceChart({ formats }: { formats: FormatPreference[] }) {
  return (
    <ChartCard title="Format preferences" subtitle="Which content formats score highest">
      <div className="space-y-3">
        {formats.length === 0 ? EMPTY : formats.map((f, i) => (
          <BarRow
            key={f.format}
            label={f.format.charAt(0).toUpperCase() + f.format.slice(1)}
            upRate={f.upRate}
            saveRate={f.saveRate}
            total={f.total}
            color={FORMAT_COLORS[f.format] ?? '#833ab4'}
            index={i}
          />
        ))}
      </div>
    </ChartCard>
  );
}
