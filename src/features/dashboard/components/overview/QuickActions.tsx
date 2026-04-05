import { QUICK_ACTIONS } from '../../constants';

export function QuickActions() {
  return (
    <div>
      <p className="text-sm font-semibold text-neutral-900 mb-3">Quick Actions</p>
      <div className="grid grid-cols-4 gap-3">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.id}
            className="rounded-xl p-4 bg-white text-left transition-all hover:shadow-sm group"
            style={{ border: '1px solid rgba(0,0,0,0.07)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: action.iconBg, color: action.iconColor }}
              >
                {action.icon}
              </div>
              {action.badge && (
                <span
                  className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full"
                  style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
                >
                  {action.badge}
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-neutral-900 group-hover:text-neutral-700">{action.label}</p>
            <p className="text-[11px] text-neutral-400 mt-0.5">{action.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
