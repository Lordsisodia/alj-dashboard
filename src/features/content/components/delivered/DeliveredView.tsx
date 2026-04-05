'use client';

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const DELIVERED_CLIPS = [
  { filename: 'tyler_gym_easter_final.mp4',     model: 'Tyler', deliveredAt: 'Apr 4', size: '97 MB'  },
  { filename: 'ren_chocolate_face_final.mp4',   model: 'Ren',   deliveredAt: 'Apr 4', size: '81 MB'  },
  { filename: 'ella_bunny_ears_final.mp4',      model: 'Ella',  deliveredAt: 'Apr 4', size: '203 MB' },
  { filename: 'amam_easter_bunny_final.mp4',    model: 'Amam',  deliveredAt: 'Apr 5', size: '118 MB' },
];

export function DeliveredView() {
  return (
    <div className="p-4 space-y-2">
      {DELIVERED_CLIPS.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center gap-3 p-3 rounded-xl"
          style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(34,197,94,0.1)' }}
          >
            <CheckCircle size={16} style={{ color: '#22c55e' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-800 truncate">{item.filename}</p>
            <p className="text-[11px] text-neutral-400">{item.model} · {item.size}</p>
          </div>
          <span className="text-[11px] text-neutral-400 flex-shrink-0">{item.deliveredAt}</span>
        </motion.div>
      ))}
    </div>
  );
}
