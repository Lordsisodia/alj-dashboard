'use client';

import { useState } from 'react';
import { TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { MODEL_PNL } from '../../constants';

function fmt(n: number) {
  return `£${n.toLocaleString()}`;
}

function pct(n: number) {
  return `${Math.round(n * 100)}%`;
}

export function ModelPnLCard() {
  const [page, setPage] = useState(0);
  const perPage = 4;
  const totalPages = Math.ceil(MODEL_PNL.length / perPage);
  const visible = MODEL_PNL.slice(page * perPage, page * perPage + perPage);

  return (
    <div
      className="rounded-xl bg-white overflow-hidden"
      style={{ border: '1px solid rgba(0,0,0,0.07)' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,0,105,0.1)', color: '#ff0069' }}
          >
            <TrendingUp size={13} />
          </div>
          <p className="text-sm font-semibold text-neutral-900">Model P&amp;L</p>
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded-full text-neutral-500"
            style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
          >
            This Month
          </span>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-6 h-6 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-black/[0.04] disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={13} />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="w-6 h-6 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-black/[0.04] disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Model columns */}
      <div className="grid grid-cols-4">
        {visible.map((model, i) => {
          const net = model.revenue - model.cost;
          const margin = net / model.revenue;
          return (
            <div
              key={model.id}
              className="p-4"
              style={{ borderRight: i < visible.length - 1 ? '1px solid rgba(0,0,0,0.06)' : undefined }}
            >
              {/* Avatar + name */}
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: model.color }}
                >
                  {model.initials}
                </div>
                <p className="text-xs font-semibold text-neutral-900 truncate">{model.name}</p>
              </div>

              {/* Rows */}
              <div className="space-y-2">
                <Row label="Revenue" value={fmt(model.revenue)} color="#22c55e" />
                <Row label="Cost"    value={fmt(model.cost)}    color="#f59e0b" />
                <div
                  className="pt-2"
                  style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}
                >
                  <Row label="Net" value={fmt(net)} color={model.color} bold />
                  <p className="text-[10px] text-neutral-400 mt-0.5">{pct(margin)} margin</p>
                </div>
                <div
                  className="pt-2"
                  style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}
                >
                  <Row label="90d LTV"    value={fmt(model.ltv)}       color="#833ab4" />
                  <Row label="Chat CVR"   value={pct(model.chatCvr)}   color="#0891b2" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Row({ label, value, color, bold }: { label: string; value: string; color: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[10px] text-neutral-400 truncate">{label}</span>
      <span
        className={`text-[11px] tabular-nums flex-shrink-0 ${bold ? 'font-bold' : 'font-semibold'}`}
        style={{ color }}
      >
        {value}
      </span>
    </div>
  );
}
