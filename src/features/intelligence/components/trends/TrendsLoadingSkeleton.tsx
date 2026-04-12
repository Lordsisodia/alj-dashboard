'use client';

import { motion } from 'framer-motion';

/** Shimmer pills matching StatsBar layout exactly */
function PillsSkeleton() {
  return (
    <div className="flex items-center gap-2 flex-wrap px-4 pt-3">
      {PILL_SKELETONS.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white"
          style={{ border: '1px solid rgba(0,0,0,0.07)' }}
        >
          <motion.div
            className="w-3 h-3 rounded-full"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ backgroundColor: s.color }}
          />
          <div className="space-y-1">
            <motion.div
              className="h-2 w-12 rounded animate-pulse"
              style={{ backgroundColor: '#e5e7eb' }}
            />
            <motion.div
              className="h-2 w-8 rounded animate-pulse"
              style={{ backgroundColor: '#f3f4f6' }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

const PILL_SKELETONS = [
  { label: 'pending',    color: '#7f1d1d' },
  { label: 'scraped',   color: '#991b1b' },
  { label: 'rejected',  color: '#7f1d1d' },
  { label: 'approved',  color: '#991b1b' },
  { label: 'avg views', color: '#7f1d1d' },
  { label: 'avg eng.',  color: '#7f1d1d' },
  { label: 'avg fllwrs',color: '#7f1d1d' },
];

/** Table skeleton matching QualifyTableView column layout exactly */
function TableSkeleton() {
  const COL = '36px 40px 200px 90px 80px 76px 80px 90px';

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
    >
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', backgroundColor: '#fafafa' }}
      >
        <div className="flex items-center gap-3">
          <div className="h-7 w-44 rounded-lg animate-pulse" style={{ backgroundColor: '#f3f4f6', border: '1px solid rgba(0,0,0,0.09)' }} />
          <div className="h-7 w-16 rounded-lg animate-pulse" style={{ backgroundColor: '#f3f4f6', border: '1px solid rgba(0,0,0,0.09)' }} />
        </div>
        <div className="flex gap-1">
          {[7, 30, 90].map(d => (
            <div key={d} className="h-7 w-8 rounded-lg animate-pulse" style={{ backgroundColor: d === 30 ? '#d1d5db' : '#f3f4f6' }} />
          ))}
        </div>
      </div>

      {/* Header row */}
      <div
        className="grid items-center px-4"
        style={{ gridTemplateColumns: COL, height: 36, borderBottom: '1px solid rgba(0,0,0,0.10)', backgroundColor: '#f9f9f9' }}
      >
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-2 w-8 rounded animate-pulse" style={{ backgroundColor: '#e5e7eb' }} />
        ))}
      </div>

      {/* Data rows */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.04 }}
          className="grid items-center px-4"
          style={{
            gridTemplateColumns: COL,
            height: 48,
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa',
          }}
        >
          {/* Checkbox */}
          <div className="flex items-center justify-center">
            <div className="w-3.5 h-3.5 rounded animate-pulse" style={{ backgroundColor: '#e5e7eb' }} />
          </div>
          {/* # */}
          <div className="flex items-center justify-center">
            <div className="h-2 w-3 rounded animate-pulse" style={{ backgroundColor: '#e5e7eb' }} />
          </div>
          {/* Avatar + handle */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full animate-pulse flex-shrink-0" style={{ backgroundColor: '#e5e7eb' }} />
            <div className="space-y-1">
              <div className="h-2 w-16 rounded animate-pulse" style={{ backgroundColor: '#e5e7eb' }} />
              <div className="h-2 w-8 rounded animate-pulse" style={{ backgroundColor: '#f3f4f6' }} />
            </div>
          </div>
          {/* Posted */}
          <div className="flex items-center justify-center">
            <div className="h-2 w-10 rounded animate-pulse" style={{ backgroundColor: '#e5e7eb' }} />
          </div>
          {/* Views */}
          <div className="flex items-center justify-center">
            <div className="h-2 w-10 rounded animate-pulse" style={{ backgroundColor: '#e5e7eb' }} />
          </div>
          {/* Likes */}
          <div className="flex items-center justify-center">
            <div className="h-2 w-8 rounded animate-pulse" style={{ backgroundColor: '#e5e7eb' }} />
          </div>
          {/* Comments */}
          <div className="flex items-center justify-center">
            <div className="h-2 w-8 rounded animate-pulse" style={{ backgroundColor: '#e5e7eb' }} />
          </div>
          {/* vs Median */}
          <div className="flex items-center justify-center">
            <div className="h-3 w-8 rounded animate-pulse" style={{ backgroundColor: '#e5e7eb' }} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/** Outlier panel skeleton */
function OutlierPanelSkeleton() {
  return (
    <div
      className="w-72 rounded-xl overflow-hidden"
      style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fafafa' }}
      >
        <div className="w-6 h-6 rounded-lg animate-pulse" style={{ backgroundColor: '#e5e7eb' }} />
        <div className="space-y-1">
          <div className="h-2 w-24 rounded animate-pulse" style={{ backgroundColor: '#e5e7eb' }} />
          <div className="h-2 w-32 rounded animate-pulse" style={{ backgroundColor: '#f3f4f6' }} />
        </div>
      </div>
      {/* Cards */}
      <div className="p-3 space-y-3">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="rounded-lg p-3 animate-pulse"
            style={{ backgroundColor: '#f9f9f9', border: '1px solid rgba(0,0,0,0.05)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full" style={{ backgroundColor: '#e5e7eb' }} />
              <div className="h-2 w-16 rounded" style={{ backgroundColor: '#e5e7eb' }} />
            </div>
            <div className="h-2 w-full rounded mb-1" style={{ backgroundColor: '#f3f4f6' }} />
            <div className="h-2 w-3/4 rounded" style={{ backgroundColor: '#f3f4f6' }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function TrendsLoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col flex-1 min-w-0 min-h-0 gap-3 px-4"
    >
      <PillsSkeleton />
      <div className="relative flex-1 min-h-0">
        <div className="pr-80">
          <TableSkeleton />
        </div>
        <div className="absolute right-4 top-0 bottom-0">
          <OutlierPanelSkeleton />
        </div>
      </div>
    </motion.div>
  );
}
