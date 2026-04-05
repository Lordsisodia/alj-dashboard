import { Clock } from 'lucide-react';
import { ACTIVITY_FEED } from '../../constants';

export function ActivityFeed() {
  return (
    <div className="col-span-2">
      <p className="text-sm font-semibold text-neutral-900 mb-3">Recent Activity</p>
      <div className="rounded-xl bg-white overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
        {ACTIVITY_FEED.map((item, i) => (
          <div
            key={item.id}
            className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors"
            style={{ borderBottom: i < ACTIVITY_FEED.length - 1 ? '1px solid rgba(0,0,0,0.05)' : undefined }}
          >
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-white"
              style={{ backgroundColor: item.color }}
            >
              {item.icon}
            </div>
            <p className="flex-1 text-[12px] text-neutral-700 min-w-0">
              {item.text}{' '}
              <span style={{ color: '#ff0069' }} className="font-medium">{item.target}</span>
            </p>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Clock size={10} className="text-neutral-300" />
              <span className="text-[10px] text-neutral-400">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
