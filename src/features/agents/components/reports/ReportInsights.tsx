'use client';

import { Bot, Download } from 'lucide-react';
import type { Report } from '../../types';
import { relativeTime } from './utils';

export function ReportInsights({ report, catColor }: { report: Report; catColor: string }) {
  return (
    <div style={{ backgroundColor: `${catColor}06`, borderTop: `1px solid ${catColor}18` }}>
      <div className="px-5 py-4 space-y-3">
        <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: catColor }}>
          All Insights
        </p>
        <ol className="space-y-2.5">
          {report.insights.map((insight, i) => (
            <li key={i} className="flex items-start gap-3 text-xs text-neutral-700 leading-relaxed">
              <span
                className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black mt-0.5"
                style={{ backgroundColor: `${catColor}20`, color: catColor }}
              >
                {i + 1}
              </span>
              {insight}
            </li>
          ))}
        </ol>
        <div className="flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${catColor}15` }}>
          <span
            className="flex items-center gap-1.5 text-[10px] font-semibold"
            style={{ color: catColor, opacity: 0.75 }}
          >
            <Bot size={10} />
            {report.generatedBy} · {relativeTime(report.generatedAt)}
          </span>
          <button
            title="Export report"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white"
            style={{ backgroundColor: catColor }}
          >
            <Download size={11} />
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
