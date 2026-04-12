'use client';

import { motion } from 'framer-motion';
import type { EmployeePay } from '../types';
import { PayStatusBadge } from './PayStatusBadge';

function formatCurrency(n: number) {
  return `£${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function TeamPayrollTable({ employees }: { employees: EmployeePay[] }) {
  return (
    <div className="rounded-2xl overflow-hidden bg-white" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
      <table className="w-full">
        <thead>
          <tr style={{ backgroundColor: '#fafafa', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
            {['Name', 'Role', 'Department', 'Base', 'Commission', 'Bonuses', 'Deductions', 'Total', 'Status'].map(h => (
              <th
                key={h}
                className="px-3 py-3 text-left text-[10px] font-semibold text-neutral-400 uppercase tracking-wide"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map((e, i) => {
            const total = e.basePay + (e.commission ?? 0) + e.bonuses - e.deductions;
            return (
              <motion.tr
                key={e.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-t"
                style={{ borderColor: 'rgba(0,0,0,0.05)' }}
              >
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
                    >
                      {e.name[0]}
                    </div>
                    <span className="text-sm font-medium text-neutral-900">{e.name}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-xs text-neutral-500">{e.role}</td>
                <td className="px-3 py-3 text-xs text-neutral-500">{e.department}</td>
                <td className="px-3 py-3 text-sm text-neutral-700">{formatCurrency(e.basePay)}</td>
                <td className="px-3 py-3 text-sm text-neutral-700">
                  {e.commission ? formatCurrency(e.commission) : '—'}
                </td>
                <td className="px-3 py-3 text-sm text-green-600">
                  {e.bonuses > 0 ? `+${formatCurrency(e.bonuses)}` : '—'}
                </td>
                <td className="px-3 py-3 text-sm text-red-500">
                  {e.deductions > 0 ? `-${formatCurrency(e.deductions)}` : '—'}
                </td>
                <td className="px-3 py-3 text-sm font-semibold text-neutral-900">{formatCurrency(total)}</td>
                <td className="px-3 py-3">
                  <PayStatusBadge status={e.status} />
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export { TeamPayrollTable };
