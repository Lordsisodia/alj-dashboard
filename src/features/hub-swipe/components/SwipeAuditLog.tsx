'use client';

import { motion } from 'framer-motion';
import { Heart, X, Send, ArrowLeft, Play } from 'lucide-react';
import type { RatingRecord, SwipeDecision } from '../types';

interface SwipeAuditLogProps {
  log: RatingRecord[];
  onBack: () => void;
}

function groupByDate(log: RatingRecord[]): { label: string; entries: RatingRecord[] }[] {
  const map = new Map<string, RatingRecord[]>();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const entry of log) {
    const d = new Date(entry.timestamp);
    d.setHours(0, 0, 0, 0);
    const diff = (today.getTime() - d.getTime()) / 86400000;
    const label =
      diff === 0
        ? 'Today'
        : diff === 1
        ? 'Yesterday'
        : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(entry);
  }

  return Array.from(map.entries()).map(([label, entries]) => ({ label, entries }));
}

const DECISION_CONFIG: Record<SwipeDecision, { icon: React.ReactNode; color: string; label: string }> = {
  like: {
    icon: <Heart size={11} className="fill-current" />,
    color: '#f43f5e',
    label: 'Rated',
  },
  pass: {
    icon: <X size={11} />,
    color: '#a3a3a3',
    label: 'Passed',
  },
  sent: {
    icon: <Send size={11} />,
    color: '#7c3aed',
    label: 'Sent',
  },
};

export function SwipeAuditLog({ log, onBack }: SwipeAuditLogProps) {
  const groups = groupByDate([...log].reverse());

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-800 transition-colors"
        >
          <ArrowLeft size={13} />
          Back to swipe
        </button>
        <div
          className="h-4 w-px"
          style={{ background: 'rgba(0,0,0,0.1)' }}
        />
        <p className="text-sm font-bold text-neutral-900">Rating History</p>
        <div
          className="ml-auto text-[11px] font-semibold text-neutral-400 px-2 py-0.5 rounded-full"
          style={{ background: '#f5f5f4' }}
        >
          {log.length} total
        </div>
      </div>

      {/* Log */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
        {groups.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
            <p className="text-sm font-medium">No ratings yet</p>
            <p className="text-xs mt-1">Start swiping to build your history</p>
          </div>
        )}

        {groups.map(({ label, entries }) => {
          const liked  = entries.filter((e) => e.decision === 'like').length;
          const passed = entries.filter((e) => e.decision === 'pass').length;

          return (
            <div key={label}>
              {/* Day header */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-neutral-700">{label}</span>
                <span className="text-[10px] text-neutral-400">
                  · {liked} rated · {passed} passed
                </span>
              </div>

              {/* Entries */}
              <div className="flex flex-col gap-1">
                {entries.map((entry, i) => {
                  const cfg = DECISION_CONFIG[entry.decision];
                  const tagSummary = Object.entries(entry.tags)
                    .flatMap(([, opts]) => opts ?? [])
                    .slice(0, 4)
                    .join(', ');

                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-start gap-3 px-3 py-2.5 rounded-xl"
                      style={{ background: '#f9f9f9', border: '1px solid rgba(0,0,0,0.04)' }}
                    >
                      {/* Thumbnail */}
                      <div
                        className="w-8 h-10 rounded-lg flex-shrink-0 flex items-center justify-center relative overflow-hidden"
                        style={{ background: entry.reel.gradient }}
                      >
                        {entry.reel.isVideo && (
                          <Play size={10} className="text-white fill-white" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {/* Decision badge */}
                          <span
                            className="flex items-center gap-0.5 text-[10px] font-bold"
                            style={{ color: cfg.color }}
                          >
                            {cfg.icon}
                            {cfg.label}
                          </span>
                          {entry.sentToModel && (
                            <span className="text-[10px] text-neutral-400">
                              → {entry.sentToModel}
                            </span>
                          )}
                          <span className="text-[9px] text-neutral-300 ml-auto">
                            {new Date(entry.timestamp).toLocaleTimeString('en-GB', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        <p className="text-[10px] font-semibold text-neutral-600 truncate">
                          {entry.reel.creator.handle}
                        </p>

                        {tagSummary && (
                          <p className="text-[10px] text-neutral-400 mt-0.5 truncate">
                            {tagSummary}
                          </p>
                        )}

                        {entry.note && (
                          <p
                            className="text-[10px] mt-1 italic text-neutral-500 truncate"
                          >
                            &ldquo;{entry.note}&rdquo;
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
