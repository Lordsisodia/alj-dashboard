'use client';

import type { MappedCandidate } from './data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  candidates: MappedCandidate[];
}

const SOURCES = [
  { key: 'pre_approved', label: 'Pre-approved', color: '#dc2626' },
  { key: 'scraper',      label: 'Scraper',      color: '#ef4444' },
  { key: 'manual',       label: 'Manual',       color: '#f87171' },
] as const;

export function SourceChart({ candidates }: Props) {
  const counts: Record<string, number> = {};
  for (const c of candidates) {
    const src = c.source ?? 'manual';
    counts[src] = (counts[src] ?? 0) + 1;
  }

  const total = candidates.length;
  const rows = SOURCES.map(s => ({
    ...s,
    value: counts[s.key] ?? 0,
    pct: total > 0 ? Math.round(((counts[s.key] ?? 0) / total) * 100) : 0,
  }));

  return (
    <Card className="border-[rgba(0,0,0,0.07)]">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-xs font-semibold text-neutral-500 uppercase tracking-wide leading-none">Source Mix</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-3">
        <div className="flex flex-col gap-3">
          {rows.map(s => (
            <div key={s.key} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-neutral-600">{s.label}</span>
                <span className="text-[10px] tabular-nums">
                  <span className="font-semibold text-neutral-800">{s.value}</span>
                  <span className="text-neutral-400 ml-1">{s.pct}%</span>
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${s.pct}%`, backgroundColor: s.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
