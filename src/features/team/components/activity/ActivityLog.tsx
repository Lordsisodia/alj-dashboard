import { Clock } from 'lucide-react';
import { ACTIVITY } from '../../constants';

export function ActivityLog() {
  return (
    <div className="mb-5">
      <p className="text-sm font-semibold text-neutral-900 mb-3">Activity</p>
      <div className="rounded-xl overflow-hidden bg-white" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
        {ACTIVITY.map((item, i) => (
          <div
            key={item.id}
            className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-neutral-50"
            style={{ borderBottom: i < ACTIVITY.length - 1 ? '1px solid rgba(0,0,0,0.05)' : undefined }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-0.5"
              style={{ backgroundColor: item.avatarColor }}
            >
              {item.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] leading-relaxed">
                <span className="font-semibold text-neutral-900">{item.actor}</span>{' '}
                <span className="text-neutral-500">{item.action}</span>{' '}
                <span style={{ color: '#ff0069' }}>{item.target}</span>
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <Clock className="w-2.5 h-2.5 text-neutral-300" />
                <span className="text-[10px] text-neutral-400">{item.timeAgo}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
