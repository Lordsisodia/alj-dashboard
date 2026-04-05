import { Sparkles } from 'lucide-react';

export function AIAnalysisTab() {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, rgba(255,0,105,0.1), rgba(131,58,180,0.1))' }}
      >
        <Sparkles size={20} style={{ color: '#833ab4' }} />
      </div>
      <div>
        <p className="text-sm font-semibold text-neutral-800">AI Analysis</p>
        <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
          Hook score, emotion analysis, and<br />content breakdown coming soon.
        </p>
      </div>
      <div className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: 'rgba(131,58,180,0.08)', color: '#833ab4' }}>
        Coming Soon
      </div>
    </div>
  );
}
