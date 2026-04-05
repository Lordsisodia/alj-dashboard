import { KPI_CARDS } from '../../constants';

export function KpiCards() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {KPI_CARDS.map((kpi) => (
        <div
          key={kpi.label}
          className="rounded-xl p-4 bg-white relative overflow-hidden"
          style={{ border: '1px solid rgba(0,0,0,0.07)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: kpi.iconBg, color: kpi.iconColor }}
            >
              {kpi.icon}
            </div>
            {kpi.badge && (
              <span
                className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full"
                style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
              >
                {kpi.badge}
              </span>
            )}
          </div>
          <p className="text-2xl font-black text-neutral-900">{kpi.value}</p>
          <p className="text-xs text-neutral-400 mt-0.5">{kpi.label}</p>
          <p
            className="text-[10px] font-medium mt-1"
            style={{ color: kpi.subPositive ? '#22c55e' : '#f59e0b' }}
          >
            {kpi.sub}
          </p>
        </div>
      ))}
    </div>
  );
}
