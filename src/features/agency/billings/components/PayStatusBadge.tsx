'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Clock, RefreshCw } from 'lucide-react';
import type { EmployeePay } from '../types';

function PayStatusBadge({ status }: { status: EmployeePay['status'] }) {
  if (status === 'paid') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">
        <CheckCircle2 size={9} />
        Paid
      </span>
    );
  }
  if (status === 'pending') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700">
        <Clock size={9} />
        Pending
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700">
      <RefreshCw size={9} />
      Processing
    </span>
  );
}

export { PayStatusBadge };
