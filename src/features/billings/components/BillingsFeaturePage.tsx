'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard, TrendingUp, DollarSign, Users,
  Calendar, CheckCircle2, Clock, AlertCircle,
} from 'lucide-react';
import { ContentPageShell } from '@/shared/layout/ContentPageShell';
import { cn } from '@/lib/utils';
import {
  CHATTER_PAY, VA_PAY, TEAM_PAYROLL, PAY_HISTORY,
  MODEL_PAY_HISTORY, OWNER_STATS,
  type UserRole, type EmployeePay, type PayRecord,
} from './constants';

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatCurrency(n: number) {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function PayStatusBadge({ status }: { status: PayRecord['status'] }) {
  const cfg = {
    paid:       { label: 'Paid',       color: '#16a34a', bg: '#dcfce7' },
    pending:    { label: 'Pending',    color: '#d97706', bg: '#fef3c7' },
    processing: { label: 'Processing', color: '#2563eb', bg: '#dbeafe' },
  }[status];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ backgroundColor: cfg.bg, color: cfg.color }}>
      {status === 'paid' ? <CheckCircle2 size={9} /> : status === 'pending' ? <Clock size={9} /> : null}
      {cfg.label}
    </span>
  );
}

function StatCard({ label, value, icon: Icon, color, subtitle }: {
  label: string; value: string; icon: React.ElementType; color: string; subtitle?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs text-white/50 font-medium">{label}</span>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}18`, color }}>
          <Icon size={15} style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
      {subtitle && <p className="text-[11px] text-white/30">{subtitle}</p>}
    </motion.div>
  );
}

function PayHistoryTable({ records }: { records: PayRecord[] }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
      <table className="w-full">
        <thead>
          <tr style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
            {['Period', 'Amount', 'Date Paid', 'Status'].map(h => (
              <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white/40 uppercase tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id} className="border-t" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
              <td className="px-4 py-3 text-sm text-white/70">{r.period}</td>
              <td className="px-4 py-3 text-sm font-semibold text-white">{formatCurrency(r.amount)}</td>
              <td className="px-4 py-3 text-sm text-white/40">
                {new Date(r.paidAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </td>
              <td className="px-4 py-3"><PayStatusBadge status={r.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TeamPayrollTable({ employees }: { employees: EmployeePay[] }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
      <table className="w-full">
        <thead>
          <tr style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
            {['Name', 'Role', 'Department', 'Base', 'Commission', 'Bonuses', 'Deductions', 'Total', 'Status'].map(h => (
              <th key={h} className="px-3 py-3 text-left text-[10px] font-semibold text-white/40 uppercase tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map((e) => {
            const total = e.basePay + (e.commission ?? 0) + e.bonuses - e.deductions;
            return (
              <tr key={e.id} className="border-t" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}>
                      {e.name[0]}
                    </div>
                    <span className="text-sm font-medium text-white/90">{e.name}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-xs text-white/50">{e.role}</td>
                <td className="px-3 py-3 text-xs text-white/50">{e.department}</td>
                <td className="px-3 py-3 text-sm text-white/70">{formatCurrency(e.basePay)}</td>
                <td className="px-3 py-3 text-sm text-white/70">{e.commission ? formatCurrency(e.commission) : ' - '}</td>
                <td className="px-3 py-3 text-sm text-green-400">{e.bonuses > 0 ? `+${formatCurrency(e.bonuses)}` : ' - '}</td>
                <td className="px-3 py-3 text-sm text-red-400">{e.deductions > 0 ? `-${formatCurrency(e.deductions)}` : ' - '}</td>
                <td className="px-3 py-3 text-sm font-semibold text-white">{formatCurrency(total)}</td>
                <td className="px-3 py-3"><PayStatusBadge status={e.status} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Owner view ───────────────────────────────────────────────────────────────

function OwnerPayView() {
  const { totalPayroll, modelEarnings, businessExpenses, netRevenue } = OWNER_STATS;

  return (
    <div className="p-6 space-y-5">
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="Total Payroll" value={formatCurrency(totalPayroll)} icon={DollarSign} color="#ff0069" subtitle="This month" />
        <StatCard label="Model Earnings" value={formatCurrency(modelEarnings)} icon={TrendingUp} color="#833ab4" subtitle="This month" />
        <StatCard label="Bus. Expenses" value={formatCurrency(businessExpenses)} icon={CreditCard} color="#6b7280" subtitle="This month" />
        <StatCard label="Net Revenue" value={formatCurrency(netRevenue)} icon={CheckCircle2} color="#16a34a" subtitle="This month" />
      </div>

      {/* Google Sheets placeholders */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(14,165,233,0.1)' }}>
              <TrendingUp size={15} style={{ color: '#0ea5e9' }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white/90">Model Earnings Sheet</p>
              <p className="text-[11px] text-white/30">Google Sheets</p>
            </div>
          </div>
          <div className="rounded-xl p-4 flex items-center justify-center text-xs text-white/25" style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.08)' }}>
            Connected to Google Sheets TBC
          </div>
        </div>

        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(14,165,233,0.1)' }}>
              <CreditCard size={15} style={{ color: '#0ea5e9' }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white/90">Business Expenses Sheet</p>
              <p className="text-[11px] text-white/30">Google Sheets</p>
            </div>
          </div>
          <div className="rounded-xl p-4 flex items-center justify-center text-xs text-white/25" style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.08)' }}>
            Connected to Google Sheets TBC
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-white/80 mb-3">Team Payroll</p>
        <TeamPayrollTable employees={TEAM_PAYROLL} />
      </div>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────────

export default function BillingsFeaturePage() {
  return (
    <ContentPageShell
      icon={
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
        >
          <CreditCard size={16} className="text-white" />
        </div>
      }
      title="Billings & Payouts"
      stat={{ label: 'April 2026', value: ' - ' }}
      searchPlaceholder="Search employees..."
    >
      <OwnerPayView />
    </ContentPageShell>
  );
}
