'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { motion } from 'framer-motion';
import { containerVariants, fadeUp } from '../../constants';
import { RefreshCw, CheckCircle2, XCircle, AlertTriangle, Inbox, Clock } from 'lucide-react';

type InboxTab = 'all' | 'approvals' | 'failed';

function timeAgo(ts: number) {
  const d = Date.now() - ts;
  if (d < 3600000) return `${Math.floor(d / 60000)}m ago`;
  if (d < 86400000) return `${Math.floor(d / 3600000)}h ago`;
  return `${Math.floor(d / 86400000)}d ago`;
}

function urgencyColor(ts: number) {
  const hours = (Date.now() - ts) / 3600000;
  if (hours > 24) return { bg: 'rgba(255,0,105,0.08)', text: '#cc0054', label: 'Overdue' };
  if (hours > 8)  return { bg: 'rgba(249,115,22,0.08)', text: '#c2410c', label: 'Urgent' };
  return { bg: 'rgba(251,191,36,0.08)', text: '#b45309', label: 'Pending' };
}

export function InboxView() {
  const approvals = useQuery(api.approvals.getApprovals);
  const agentRuns = useQuery(api.agents.getAgentRuns);
  const retryRun = useMutation(api.agents.retryRun);
  const [tab, setTab] = useState<InboxTab>('all');

  const pendingApprovals = (approvals ?? []).filter(a => a.status === 'pending');
  const failedRuns = (agentRuns ?? []).filter(r => r.status === 'failed');
  const totalItems = pendingApprovals.length + failedRuns.length;

  const tabs = [
    { id: 'all' as InboxTab,       label: 'All',        count: totalItems },
    { id: 'approvals' as InboxTab, label: 'Approvals',  count: pendingApprovals.length },
    { id: 'failed' as InboxTab,    label: 'Failed Runs', count: failedRuns.length },
  ];

  const showApprovals = tab === 'all' || tab === 'approvals';
  const showFailed = tab === 'all' || tab === 'failed';

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center relative"
            style={{ background: 'linear-gradient(135deg,rgba(251,191,36,0.1),rgba(249,115,22,0.12))', border: '1px solid rgba(251,191,36,0.25)' }}>
            <Inbox size={15} style={{ color: '#b45309' }} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                style={{ background: 'linear-gradient(135deg,#ff0069,#833ab4)' }}>
                {totalItems}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900">Inbox</h3>
            <p className="text-[11px] text-neutral-400">
              {totalItems === 0 ? 'All clear' : `${totalItems} item${totalItems !== 1 ? 's' : ''} need attention`}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeUp} className="flex items-center gap-1.5">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all"
            style={tab === t.id
              ? { background: 'linear-gradient(135deg,#ff0069,#833ab4)', color: '#fff', boxShadow: '0 2px 8px rgba(255,0,105,0.25)' }
              : { backgroundColor: 'rgba(0,0,0,0.04)', color: '#888', border: '1px solid rgba(0,0,0,0.08)' }}>
            {t.label}
            {t.count > 0 && (
              <span className="text-[9px] px-1 rounded-full"
                style={{ backgroundColor: tab === t.id ? 'rgba(255,255,255,0.25)' : 'rgba(255,0,105,0.1)', color: tab === t.id ? '#fff' : '#ff0069' }}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </motion.div>

      {/* Empty state */}
      {totalItems === 0 && (
        <motion.div variants={fadeUp} className="rounded-2xl py-16 flex flex-col items-center gap-4"
          style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,rgba(120,194,87,0.12),rgba(74,158,255,0.12))', border: '1px solid rgba(120,194,87,0.2)' }}>
            <CheckCircle2 size={22} style={{ color: '#78c257' }} />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-neutral-800">Inbox is clear</p>
            <p className="text-xs text-neutral-400 mt-1">No pending approvals or failed runs.</p>
          </div>
        </motion.div>
      )}

      {/* Approvals */}
      {showApprovals && pendingApprovals.length > 0 && (
        <motion.div variants={fadeUp} className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 px-1">
            Pending Approvals · {pendingApprovals.length}
          </p>
          {pendingApprovals.map(a => {
            const urgency = urgencyColor(a._creationTime ?? Date.now() - 3600000);
            return (
              <div key={a._id} className="rounded-2xl overflow-hidden"
                style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                {/* Urgency bar */}
                <div className="h-1" style={{ background: 'linear-gradient(90deg,#fbbf24,#f97316)' }} />
                <div className="px-5 py-4 flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: urgency.bg }}>
                    <AlertTriangle size={15} style={{ color: urgency.text }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-neutral-900">{a.contentType} - {a.accountHandle}</p>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: urgency.bg, color: urgency.text }}>
                        {urgency.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2">{a.caption}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-[10px] text-neutral-400">
                        <Clock size={9} /> Submitted by {a.submittedBy}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-bold text-white transition-all hover:brightness-110"
                      style={{ background: 'linear-gradient(135deg,#78c257,#4a9eff)' }}>
                      <CheckCircle2 size={10} /> Approve
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all hover:bg-neutral-100"
                      style={{ border: '1px solid rgba(0,0,0,0.1)', color: '#888' }}>
                      <XCircle size={10} /> Revise
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Failed runs */}
      {showFailed && failedRuns.length > 0 && (
        <motion.div variants={fadeUp} className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 px-1">
            Failed Runs · {failedRuns.length}
          </p>
          {failedRuns.map(r => (
            <div key={r._id} className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: '#fff', border: '1px solid rgba(220,38,38,0.15)', boxShadow: '0 1px 4px rgba(220,38,38,0.06)' }}>
              <div className="h-1" style={{ background: 'linear-gradient(90deg,#ff0069,#dc2626)' }} />
              <div className="px-5 py-4 flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(220,38,38,0.08)' }}>
                  <XCircle size={15} style={{ color: '#dc2626' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-neutral-900">{r.agentName}</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5 truncate">{r.description}</p>
                  {r.outputPreview && (
                    <p className="text-[10px] font-mono text-red-400 mt-1.5 bg-red-50 px-2 py-1 rounded-lg truncate">
                      {r.outputPreview}
                    </p>
                  )}
                </div>
                <button onClick={() => retryRun({ id: r._id as Id<'agentRuns'> })}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold text-white flex-shrink-0 transition-all hover:brightness-110 active:scale-95"
                  style={{ background: 'linear-gradient(135deg,#ff0069,#833ab4)', boxShadow: '0 2px 6px rgba(255,0,105,0.25)' }}>
                  <RefreshCw size={10} /> Retry
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
