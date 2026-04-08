'use client';

import { motion } from 'framer-motion';

export function ApprovalRatioWidget({ approved, rejected }: { approved: number; rejected: number }) {
  const total        = approved + rejected;
  const approvalPct  = total === 0 ? 50 : Math.round((approved / total) * 100);
  const rejectPct   = 100 - approvalPct;

  return (
    <div className="rounded-xl p-4 bg-white" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
      <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: '#7f1d1d' }}>Approval Rate</p>
      <div className="h-2 rounded-full overflow-hidden flex mb-3" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}>
        <motion.div
          className="h-full"
          style={{ backgroundColor: '#991b1b', borderRadius: '9999px' }}
          animate={{ width: `${approvalPct}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xl font-bold leading-none tabular-nums" style={{ color: '#991b1b' }}>{approvalPct}%</p>
          <p className="text-[9px] text-neutral-400 mt-0.5">{approved} approved</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold leading-none tabular-nums text-neutral-300">{rejectPct}%</p>
          <p className="text-[9px] text-neutral-400 mt-0.5">{rejected} rejected</p>
        </div>
      </div>
      <p className="text-[9px] text-neutral-300 mt-2">
        {total === 0 ? 'No data yet' : `${total} evaluated total`}
      </p>
    </div>
  );
}
