'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { REPORTS, containerVariants } from '../../constants';
import { useReports } from '../../hooks';
import type { Report, ReportCategory } from '../../types';
import { ReportCard } from './ReportCard';
import { ReportsSkeleton } from './ReportsSkeleton';

type FilterCategory = ReportCategory | 'All';

class ReportsErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() { return this.state.hasError ? this.props.fallback : this.props.children; }
}

function EmptyState({ category }: { category: FilterCategory }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-14 rounded-xl text-center"
      style={{ backgroundColor: '#fafafa', border: '1px dashed rgba(0,0,0,0.10)' }}
    >
      <FileText size={28} className="text-neutral-300 mb-3" />
      <p className="text-sm font-semibold text-neutral-500">No {category} reports yet</p>
      <p className="text-xs text-neutral-400 mt-1">Reports are generated automatically by your agents</p>
    </div>
  );
}

function ReportList({ reports, category }: { reports: Report[]; category: FilterCategory }) {
  const filtered = category === 'All' ? reports : reports.filter(r => r.category === category);
  if (filtered.length === 0) return <EmptyState category={category} />;
  return (
    <motion.div key={category} variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
      {filtered.map(r => <ReportCard key={String(r.id)} report={r} />)}
    </motion.div>
  );
}

function LiveContent({ category }: { category: FilterCategory }) {
  const reports = useReports();
  if (reports === undefined) return <ReportsSkeleton />;
  return <ReportList reports={reports} category={category} />;
}

function StaticContent({ category }: { category: FilterCategory }) {
  return <ReportList reports={REPORTS} category={category} />;
}

export function ReportsContent({ category }: { category: FilterCategory }) {
  return (
    <ReportsErrorBoundary fallback={<StaticContent category={category} />}>
      <LiveContent category={category} />
    </ReportsErrorBoundary>
  );
}
