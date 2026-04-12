'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  DollarSign, TrendingUp, Users, CreditCard,
  BarChart2, FileText, Calendar, ChevronRight,
  ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';

// ── Seed data ────────────────────────────���─────────────────────────���─────────

const OWNER_KPIS = [
  { label: 'Net Revenue',     value: '£6,030',  change: '+18%', positive: true,  icon: DollarSign,  color: '#22c55e' },
  { label: 'Model Earnings',  value: '£12,400', change: '+12%', positive: true,  icon: TrendingUp,  color: '#833ab4' },
  { label: 'Total Payroll',   value: '£3,520',  change: '+3%',  positive: false, icon: Users,       color: '#ff0069' },
  { label: 'Expenses',        value: '£3,850',  change: '-5%',  positive: true,  icon: CreditCard,  color: '#f59e0b' },
];

const MODEL_PERFORMANCE = [
  { name: 'Tyler Rex',  initials: 'TR', color: '#ff0069', revenue: 4200, margin: 0.80, trend: 'up'   as const },
  { name: 'Ren Rhinx',  initials: 'RR', color: '#833ab4', revenue: 3100, margin: 0.80, trend: 'up'   as const },
  { name: 'Ella Mira',  initials: 'EM', color: '#f59e0b', revenue: 2800, margin: 0.80, trend: 'down' as const },
  { name: 'Sam Chase',  initials: 'SC', color: '#22c55e', revenue: 1900, margin: 0.80, trend: 'up'   as const },
];

const TEAM_SUMMARY = [
  { role: 'Chatters',     count: 3, status: 'All active',     color: '#22c55e' },
  { role: 'Social VAs',   count: 2, status: 'All active',     color: '#833ab4' },
  { role: 'Managers',     count: 2, status: '1 pending setup', color: '#f59e0b' },
];

const QUICK_LINKS = [
  { label: 'Billings & Payroll', href: '/agency/billings', icon: CreditCard, color: '#ff0069' },
  { label: 'P&L Reports',        href: '/agency/reports',  icon: FileText,   color: '#833ab4' },
  { label: 'Team Management',    href: '/agency/team',     icon: Users,      color: '#22c55e' },
  { label: 'Schedule Overview',  href: '/agency/schedule', icon: Calendar,   color: '#f59e0b' },
];

// ── Components ──────────────────────────────────────────────────────────────���

function KpiCard({ label, value, change, positive, icon: Icon, color }: typeof OWNER_KPIS[0]) {
  return (
    <div className="rounded-xl p-4 bg-white" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}18`, color }}>
          <Icon size={16} />
        </div>
        <span className={`text-[11px] font-semibold flex items-center gap-0.5 ${positive ? 'text-green-600' : 'text-red-500'}`}>
          {positive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
          {change}
        </span>
      </div>
      <p className="text-2xl font-black text-neutral-900">{value}</p>
      <p className="text-xs text-neutral-400 mt-0.5">{label}</p>
    </div>
  );
}

function ModelRow({ name, initials, color, revenue, margin, trend }: typeof MODEL_PERFORMANCE[0]) {
  return (
    <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0" style={{ backgroundColor: color }}>
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-neutral-900">{name}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-neutral-900">£{revenue.toLocaleString()}</p>
        <p className="text-[10px] text-neutral-400">{Math.round(margin * 100)}% margin</p>
      </div>
      <span className={`text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
      </span>
    </div>
  );
}

// ── Main ──────────────────────────────���──────────────────────────────────────

export default function OwnersDashboardPage() {
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <ContentPageShell
      icon={
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}>
          <BarChart2 size={16} className="text-white" />
        </div>
      }
      title="Owner Dashboard"
      stat={{ label: 'Models', value: 4 }}
      searchPlaceholder="Search reports, team..."
    >
      <div className="p-4 space-y-5">
        {/* Greeting */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <h2 className="text-xl font-bold text-neutral-900">Business Overview</h2>
          <p className="text-sm text-neutral-500 mt-0.5">{today}</p>
        </motion.div>

        {/* KPI Cards */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }} className="grid grid-cols-4 gap-3">
          {OWNER_KPIS.map(kpi => <KpiCard key={kpi.label} {...kpi} />)}
        </motion.div>

        {/* Two-column: Model Performance + Team Summary */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} className="grid grid-cols-5 gap-4">
          {/* Model Performance - 3 cols */}
          <div className="col-span-3 rounded-xl bg-white overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(255,0,105,0.1)', color: '#ff0069' }}>
                  <TrendingUp size={13} />
                </div>
                <p className="text-sm font-semibold text-neutral-900">Model Revenue</p>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full text-neutral-500" style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}>
                  This Month
                </span>
              </div>
              <Link href="/agency/reports" className="text-[11px] font-medium text-neutral-400 hover:text-neutral-700 flex items-center gap-0.5 transition-colors">
                Full Report <ChevronRight size={12} />
              </Link>
            </div>
            {MODEL_PERFORMANCE.map(m => <ModelRow key={m.name} {...m} />)}
          </div>

          {/* Team Summary - 2 cols */}
          <div className="col-span-2 rounded-xl bg-white overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
                  <Users size={13} />
                </div>
                <p className="text-sm font-semibold text-neutral-900">Team</p>
              </div>
              <Link href="/agency/team" className="text-[11px] font-medium text-neutral-400 hover:text-neutral-700 flex items-center gap-0.5 transition-colors">
                Manage <ChevronRight size={12} />
              </Link>
            </div>
            <div className="p-4 space-y-3">
              {TEAM_SUMMARY.map(t => (
                <div key={t.role} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                    <span className="text-sm text-neutral-700">{t.role}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-neutral-900">{t.count}</span>
                    <p className="text-[10px] text-neutral-400">{t.status}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Total payroll summary */}
            <div className="mx-4 mb-4 rounded-xl p-3" style={{ backgroundColor: 'rgba(255,0,105,0.04)', border: '1px solid rgba(255,0,105,0.1)' }}>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500">Monthly Payroll</span>
                <span className="text-sm font-bold text-neutral-900">£3,520</span>
              </div>
              <Link href="/agency/billings" className="text-[11px] font-medium text-[#ff0069] mt-1 flex items-center gap-0.5">
                View Billings <ChevronRight size={11} />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">Quick Actions</p>
          <div className="grid grid-cols-4 gap-3">
            {QUICK_LINKS.map(link => (
              <Link
                key={link.label}
                href={link.href}
                className="group rounded-xl p-4 bg-white hover:shadow-sm transition-all"
                style={{ border: '1px solid rgba(0,0,0,0.07)' }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: `${link.color}15`, color: link.color }}>
                  <link.icon size={16} />
                </div>
                <p className="text-sm font-semibold text-neutral-900 group-hover:text-neutral-700">{link.label}</p>
                <ChevronRight size={13} className="text-neutral-300 group-hover:text-neutral-500 mt-1 transition-colors" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </ContentPageShell>
  );
}
