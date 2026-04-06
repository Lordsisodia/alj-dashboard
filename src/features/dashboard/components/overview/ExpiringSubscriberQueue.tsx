import { AlertTriangle, ArrowRight } from 'lucide-react';
import { EXPIRING_SUBSCRIBERS } from '../../constants';

function urgencyColor(hours: number) {
  if (hours <= 12) return '#ff0069';
  if (hours <= 24) return '#f59e0b';
  return '#a3a3a3';
}

function fmtHours(hours: number) {
  if (hours < 24) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}

export function ExpiringSubscriberQueue() {
  const critical = EXPIRING_SUBSCRIBERS.filter(s => s.expiresInHours <= 24).length;

  return (
    <div
      className="rounded-xl bg-white overflow-hidden"
      style={{ border: '1px solid rgba(0,0,0,0.07)' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2.5"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
      >
        <div className="flex items-center gap-2">
          <AlertTriangle size={13} style={{ color: critical > 0 ? '#ff0069' : '#a3a3a3' }} />
          <p className="text-xs font-semibold text-neutral-900">Expiring Soon</p>
          {critical > 0 && (
            <span
              className="text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full"
              style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
            >
              {critical} urgent
            </span>
          )}
        </div>
        <span className="text-[10px] text-neutral-400">72h window</span>
      </div>

      {/* List */}
      <div>
        {EXPIRING_SUBSCRIBERS.map((sub, i) => {
          const color = urgencyColor(sub.expiresInHours);
          return (
            <div
              key={sub.id}
              className="flex items-center gap-2.5 px-3 py-2 hover:bg-neutral-50 transition-colors cursor-pointer group"
              style={{ borderBottom: i < EXPIRING_SUBSCRIBERS.length - 1 ? '1px solid rgba(0,0,0,0.04)' : undefined }}
            >
              {/* Urgency dot */}
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />

              {/* Handle + tier */}
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-neutral-800 truncate">{sub.handle}</p>
                <p className="text-[10px] text-neutral-400">{sub.tier} · £{sub.spent} spent</p>
              </div>

              {/* Expiry time */}
              <span
                className="text-[10px] font-bold flex-shrink-0"
                style={{ color }}
              >
                {fmtHours(sub.expiresInHours)}
              </span>

              <ArrowRight size={11} className="text-neutral-300 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
