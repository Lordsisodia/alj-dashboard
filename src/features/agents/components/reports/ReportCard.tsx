'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, ChevronDown, Sparkles } from 'lucide-react';
import type { Report } from '../../types';
import { REPORT_CAT_COLOR, fadeUp } from '../../constants';
import { relativeTime } from './utils';
import { ReportInsights } from './ReportInsights';

export function ReportCard({ report }: { report: Report }) {
  const [expanded, setExpanded] = useState(false);
  const catColor = REPORT_CAT_COLOR[report.category];
  const isNew = Date.now() - report.generatedAt < 24 * 60 * 60 * 1000;

  return (
    <motion.div
      variants={fadeUp}
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
      whileHover={expanded ? undefined : { y: -2, boxShadow: '0 6px 20px rgba(0,0,0,0.09)', transition: { duration: 0.18 } }}
    >
      <div style={{ height: 3, background: `linear-gradient(90deg, ${catColor}, ${catColor}88)` }} />

      <div className="p-5 space-y-3.5">
        {/* Badges row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest" style={{ backgroundColor: `${catColor}18`, color: catColor }}>
              {report.category}
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold" style={{ backgroundColor: `${catColor}10`, color: catColor }}>
              <Bot size={9} />{report.generatedBy}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {isNew && (
              <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest" style={{ backgroundColor: catColor, color: '#fff' }}>
                <Sparkles size={8} />New
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ backgroundColor: 'rgba(0,0,0,0.05)', color: '#666' }}>
              {report.insights.length} insights
            </span>
          </div>
        </div>

        <h3 className="text-sm font-bold text-neutral-900 leading-snug">{report.title}</h3>

        {/* Top insight preview */}
        <div className="px-3 py-2.5 rounded-lg text-xs text-neutral-600 leading-relaxed" style={{ backgroundColor: `${catColor}08`, borderLeft: `2px solid ${catColor}50` }}>
          {report.insights[0]}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <span className="text-[11px] text-neutral-400">{relativeTime(report.generatedAt)}</span>
          <button
            onClick={() => setExpanded(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold"
            style={{ backgroundColor: expanded ? catColor : `${catColor}12`, color: expanded ? '#fff' : catColor, border: `1px solid ${catColor}25`, transition: 'background-color 0.15s, color 0.15s' }}
          >
            {expanded ? 'Collapse' : 'Read Full Report'}
            <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ display: 'flex' }}>
              <ChevronDown size={11} />
            </motion.span>
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <ReportInsights report={report} catColor={catColor} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
