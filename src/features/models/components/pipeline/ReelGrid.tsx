import { Play } from 'lucide-react';
import { THUMB_GRADIENTS } from '../../constants';

export function ReelGrid({ color }: { color: string }) {
  return (
    <div className="grid grid-cols-4 gap-2 mt-3">
      {THUMB_GRADIENTS.map((grad, i) => (
        <div
          key={i}
          className="aspect-[9/16] rounded-lg relative overflow-hidden flex items-center justify-center"
          style={{ background: grad }}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
          >
            <Play size={10} className="text-white" fill="white" />
          </div>
        </div>
      ))}
    </div>
  );
}
