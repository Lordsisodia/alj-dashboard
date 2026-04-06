'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertTriangle, Timer } from 'lucide-react';
import { PRIORITY_CONFIG, fadeUp } from '../../constants';
import { type DisplayRequest, STATUS_CFG, getSla, resolveTs, fmtDate } from './lib';

function StatusBadge({ status }: { status: DisplayRequest['status'] }) {
  const cfg = STATUS_CFG[status];
  return (
    <span
      className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold"
      style={{ backgroundColor: cfg.bg, color: cfg.color }}
    >
      {cfg.pulse ? (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
        </span>
      ) : status === 'Delivered' ? (
        <CheckCircle2 size={10} />
      ) : (
        <Clock size={10} />
      )}
      {status}
    </span>
  );
}

function SlaPill({ submittedAt }: { submittedAt: number }) {
  const sla = getSla(submittedAt);
  return (
    <span
      className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold"
      style={{ backgroundColor: sla.bg, color: sla.color }}
    >
      {sla.overdue || sla.urgent ? <AlertTriangle size={10} /> : <Timer size={10} />}
      {sla.label}
    </span>
  );
}

export function RequestCard({ request }: { request: DisplayRequest }) {
  const priCfg      = PRIORITY_CONFIG[request.priority];
  const isQueued    = request.status === 'Queued';
  const isDelivered = request.status === 'Delivered';
  const ts          = resolveTs(request);
  const displayDate = request.date ?? fmtDate(ts);

  return (
    <motion.div
      variants={fadeUp}
      whileHover={isDelivered ? undefined : { y: -2, boxShadow: '0 6px 16px rgba(0,0,0,0.09)', transition: { duration: 0.18 } }}
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: '#fff',
        border:     '1px solid rgba(0,0,0,0.08)',
        borderLeft: `3px solid ${priCfg.color}`,
        boxShadow:  '0 1px 4px rgba(0,0,0,0.05)',
        opacity: isDelivered ? 0.82 : 1,
      }}
    >
      <div className="px-4 py-4 space-y-2.5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-bold text-neutral-900 leading-snug flex-1">{request.title}</p>
          <div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold"
              style={{ backgroundColor: priCfg.bg, color: priCfg.color }}>
              {request.priority}
            </span>
            <StatusBadge status={request.status} />
          </div>
        </div>

        <p className="text-xs text-neutral-500 leading-relaxed">{request.description}</p>

        <div className="flex items-center justify-between pt-1.5" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <span className="text-[11px] text-neutral-400">{request.requestedBy} · {displayDate}</span>
          {isQueued ? (
            <SlaPill submittedAt={ts} />
          ) : (
            <span className="flex items-center gap-1 text-[11px] text-neutral-400">
              <Clock size={10} />{request.eta}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
