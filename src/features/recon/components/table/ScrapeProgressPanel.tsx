'use client';

import { useMemo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle2, Circle } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface Props {
  handles:   string[];
  startedAt: number;
  onDismiss: () => void;
}

function formatElapsed(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function ScrapeProgressPanel({ handles, startedAt, onDismiss }: Props) {
  const [tick, setTick] = useState(0);

  // Single 1s ticker for elapsed time + queued→scraping transition
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const progress = useQuery(api.intelligence.getScrapeProgress, {
    handles,
    since: startedAt,
  });

  const elapsed = Date.now() - startedAt;

  const rows = useMemo(() => {
    return handles.map(handle => {
      const entry = progress?.find(p => p.handle === handle);
      const postsScraped = entry?.postsScraped ?? 0;
      let status: 'queued' | 'scraping' | 'done';
      if (postsScraped > 0) {
        status = 'done';
      } else if (elapsed >= 10000) {
        status = 'scraping';
      } else {
        status = 'queued';
      }
      return { handle, postsScraped, status };
    });
  // tick drives elapsed recalculation; progress is Convex live data
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handles, progress, tick]);

  const doneCount         = rows.filter(r => r.status === 'done').length;
  const total             = handles.length;
  const totalPostsScraped = rows.reduce((s, r) => s + r.postsScraped, 0);
  const elapsedFormatted  = formatElapsed(elapsed);
  const allDone           = doneCount === total;

  // Visible rows: if > 8 handles, show first 6 done + first 2 in-progress, rest collapsed
  const MAX_VISIBLE = 8;
  const doneRows      = rows.filter(r => r.status === 'done');
  const activeRows    = rows.filter(r => r.status !== 'done');
  let visibleRows     = rows;
  let hiddenCount     = 0;
  if (rows.length > MAX_VISIBLE) {
    const shownDone   = doneRows.slice(0, 6);
    const shownActive = activeRows.slice(0, 2);
    visibleRows       = [...shownDone, ...shownActive];
    hiddenCount       = rows.length - visibleRows.length;
  }

  return (
    <AnimatePresence>
      <motion.div
        key="scrape-progress-panel"
        initial={{ x: 24, opacity: 0 }}
        animate={{ x: 0,  opacity: 1 }}
        exit={{    x: 24, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          position:     'absolute',
          bottom:       16,
          right:        16,
          zIndex:       50,
          width:        340,
          background:   '#1a1a2e',
          border:       '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16,
          boxShadow:    '0 20px 40px rgba(0,0,0,0.4)',
          overflow:     'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '12px 14px 8px',
          borderBottom:   '1px solid rgba(255,255,255,0.06)',
        }}>
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>
            Scraping reels
          </span>
          <button
            onClick={allDone ? onDismiss : undefined}
            style={{
              background: 'none',
              border:     'none',
              cursor:     allDone ? 'pointer' : 'not-allowed',
              padding:    2,
              opacity:    allDone ? 1 : 0.35,
              color:      '#9ca3af',
              display:    'flex',
              alignItems: 'center',
            }}
            title={allDone ? 'Dismiss' : 'Dismiss when all done'}
          >
            <X size={14} />
          </button>
        </div>

        {/* Sub-header stats */}
        <div style={{
          padding:    '6px 14px 8px',
          fontSize:   11,
          color:      '#6b7280',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}>
          {doneCount}/{total} creators &middot; {totalPostsScraped} posts indexed &middot; {elapsedFormatted}
        </div>

        {/* Rows */}
        <div style={{ maxHeight: 280, overflowY: 'auto', padding: '4px 0' }}>
          {visibleRows.map(row => (
            <div
              key={row.handle}
              style={{
                display:     'flex',
                alignItems:  'center',
                padding:     '6px 14px',
                gap:         10,
              }}
            >
              {/* Status icon */}
              {row.status === 'done' && (
                <CheckCircle2 size={14} style={{ color: '#22c55e', flexShrink: 0 }} />
              )}
              {row.status === 'scraping' && (
                <Loader2
                  size={14}
                  style={{
                    color:     '#f59e0b',
                    flexShrink: 0,
                    animation: 'spin 1s linear infinite',
                  }}
                  className="animate-spin"
                />
              )}
              {row.status === 'queued' && (
                <Circle size={14} style={{ color: '#4b5563', flexShrink: 0 }} />
              )}

              {/* Handle */}
              <span style={{
                flex:         1,
                fontSize:     12,
                color:        row.status === 'done' ? '#e5e7eb' : '#6b7280',
                overflow:     'hidden',
                textOverflow: 'ellipsis',
                whiteSpace:   'nowrap',
              }}>
                {row.handle}
              </span>

              {/* Post count (done only) */}
              {row.status === 'done' && (
                <span style={{ fontSize: 11, color: '#22c55e', flexShrink: 0 }}>
                  {row.postsScraped} reels
                </span>
              )}
            </div>
          ))}

          {hiddenCount > 0 && (
            <div style={{
              padding:  '4px 14px 8px',
              fontSize: 11,
              color:    '#4b5563',
            }}>
              +{hiddenCount} more queued
            </div>
          )}
        </div>

        {/* Completion footer */}
        {allDone && (
          <div style={{
            padding:      '8px 14px',
            borderTop:    '1px solid rgba(255,255,255,0.06)',
            fontSize:     11,
            color:        '#22c55e',
            textAlign:    'center',
          }}>
            All done &mdash; {totalPostsScraped} posts indexed
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
