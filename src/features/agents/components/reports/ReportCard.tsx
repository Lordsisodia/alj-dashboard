'use client';

import { motion } from 'framer-motion';
import { FileText, ChevronRight } from 'lucide-react';
import type { Report } from '../../types';
import { REPORT_CAT_COLOR, fadeUp } from '../../constants';

export function ReportCard({ report }: { report: Report }) {
  const catColor = REPORT_CAT_COLOR[report.category];

  return (
    <motion.div
      variants={fadeUp}
      className="p-5 rounded-xl space-y-4"
      style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
      whileHover={{ y: -2, transition: { duration: 0.18 } }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div
            className="inline-block mb-2 px-2 py-0.5 rounded-lg text-[10px] font-semibold"
            style={{ backgroundColor: `${catColor}15`, color: catColor }}
          >
            {report.category}
          </div>
          <h3 className="text-sm font-semibold text-neutral-900 leading-snug">{report.title}</h3>
        </div>
        <FileText size={16} className="text-neutral-300 flex-shrink-0 mt-1" />
      </div>

      <ul className="space-y-2">
        {report.insights.map((insight, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-neutral-600">
            <div className="w-1 h-1 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: catColor }} />
            {insight}
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-neutral-400">{report.generatedBy} · {report.date}</span>
        <button className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: '#ff0069' }}>
          Read Full Report <ChevronRight size={12} />
        </button>
      </div>
    </motion.div>
  );
}
