import { motion } from 'framer-motion';

export function PerformanceView() {
  const stats = [
    { model: 'Tyler', color: '#ff0069', reels: 12, complete: 9,  avgEngagement: '4.2%' },
    { model: 'Ren',   color: '#833ab4', reels: 9,  complete: 7,  avgEngagement: '5.1%' },
    { model: 'Ella',  color: '#22c55e', reels: 15, complete: 14, avgEngagement: '6.8%' },
    { model: 'Amam',  color: '#f59e0b', reels: 6,  complete: 4,  avgEngagement: '3.9%' },
  ];

  return (
    <div className="p-4 space-y-3">
      {stats.map((s, i) => (
        <motion.div
          key={s.model}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
          className="flex items-center gap-4 p-4 rounded-xl"
          style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}99)` }}
          >
            {s.model.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-neutral-900">{s.model}</p>
            <div className="flex items-center gap-3 mt-1">
              <div className="h-1.5 rounded-full flex-1" style={{ backgroundColor: 'rgba(0,0,0,0.07)' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${(s.complete / s.reels) * 100}%`, backgroundColor: s.color }}
                />
              </div>
              <span className="text-[11px] text-neutral-500 whitespace-nowrap">
                {s.complete}/{s.reels} reels
              </span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-bold" style={{ color: s.color }}>{s.avgEngagement}</p>
            <p className="text-[10px] text-neutral-400">avg engagement</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
