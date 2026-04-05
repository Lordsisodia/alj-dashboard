'use client';

import { motion } from 'framer-motion';
import { REPORTS, containerVariants } from '../../constants';
import { ReportCard } from './ReportCard';

export function ReportsView() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {REPORTS.map(r => (
        <ReportCard key={r.id} report={r} />
      ))}
    </motion.div>
  );
}
