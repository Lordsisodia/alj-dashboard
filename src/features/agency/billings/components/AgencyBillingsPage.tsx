'use client';

import { motion } from 'framer-motion';
import { CreditCard, DollarSign, Users, Clock, CheckCircle2 } from 'lucide-react';
import { ContentPageShell } from '@/shared/layout/ContentPageShell';
import { StatCard } from './StatCard';
import { TeamPayrollTable } from './TeamPayrollTable';
import { ModelEarningsBreakdown } from './ModelEarningsBreakdown';
import { TEAM_PAYROLL, MODEL_EARNINGS } from '../constants';

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35 },
};

export default function AgencyBillingsPage() {
  const totalPayroll = TEAM_PAYROLL.reduce((sum, e) => {
    return sum + e.basePay + (e.commission ?? 0) + e.bonuses - e.deductions;
  }, 0);

  const pendingPayouts = TEAM_PAYROLL.filter(e => e.status === 'pending').reduce((sum, e) => {
    return sum + e.basePay + (e.commission ?? 0) + e.bonuses - e.deductions;
  }, 0);

  const paidOut = TEAM_PAYROLL.filter(e => e.status === 'paid').reduce((sum, e) => {
    return sum + e.basePay + (e.commission ?? 0) + e.bonuses - e.deductions;
  }, 0);

  return (
    <ContentPageShell
      icon={
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}>
          <CreditCard size={16} className="text-white" />
        </div>
      }
      title="Billings & Payouts"
      stat={{ label: 'April 2026', value: '£3,520' }}
      searchPlaceholder="Search employees..."
    >
      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-3">
          <StatCard
            label="Total Payroll"
            value={`£${totalPayroll.toLocaleString()}`}
            icon={DollarSign}
            color="#ff0069"
            subtitle="This month"
            index={0}
          />
          <StatCard
            label="Team Members"
            value={TEAM_PAYROLL.length.toString()}
            icon={Users}
            color="#833ab4"
            subtitle="Active"
            index={1}
          />
          <StatCard
            label="Pending Payouts"
            value={`£${pendingPayouts.toLocaleString()}`}
            icon={Clock}
            color="#d97706"
            subtitle="Awaiting payment"
            index={2}
          />
          <StatCard
            label="Paid Out"
            value={`£${paidOut.toLocaleString()}`}
            icon={CheckCircle2}
            color="#16a34a"
            subtitle="This month"
            index={3}
          />
        </div>

        {/* Team Payroll Table */}
        <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-neutral-900">Team Payroll</p>
            <span className="text-[11px] text-neutral-400">Payday: April 30, 2026</span>
          </div>
          <TeamPayrollTable employees={TEAM_PAYROLL} />
        </motion.div>

        {/* Model Earnings Breakdown */}
        <motion.div {...fadeUp} transition={{ delay: 0.35 }}>
          <p className="text-sm font-semibold text-neutral-900 mb-3">Model Earnings Breakdown</p>
          <ModelEarningsBreakdown models={MODEL_EARNINGS} />
        </motion.div>
      </div>
    </ContentPageShell>
  );
}
