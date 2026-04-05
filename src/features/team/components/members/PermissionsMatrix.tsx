import { Check, Minus } from 'lucide-react';
import { PERMISSIONS } from '../../constants';

const COLUMNS = ['', 'Schedule', 'Upload', 'Approve', 'Analytics', 'Manage Team', 'Settings'];

export function PermissionsMatrix() {
  return (
    <div>
      <p className="text-sm font-semibold text-neutral-900 mb-3">Permissions Matrix</p>
      <div className="rounded-xl overflow-hidden bg-white" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
        <div
          className="grid px-4 py-3"
          style={{
            gridTemplateColumns: '2fr repeat(6, 1fr)',
            borderBottom: '1px solid rgba(0,0,0,0.07)',
            backgroundColor: '#fafafa',
          }}
        >
          {COLUMNS.map(col => (
            <div key={col} className="text-[11px] font-semibold text-center text-neutral-400">{col}</div>
          ))}
        </div>
        {PERMISSIONS.map((row, i) => (
          <div
            key={row.member}
            className="grid px-4 py-3 items-center hover:bg-neutral-50 transition-colors"
            style={{
              gridTemplateColumns: '2fr repeat(6, 1fr)',
              borderBottom: i < PERMISSIONS.length - 1 ? '1px solid rgba(0,0,0,0.05)' : undefined,
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                style={{ backgroundColor: row.avatarColor }}
              >
                {row.initials}
              </div>
              <span className="text-sm font-medium text-neutral-900 truncate">{row.member}</span>
            </div>
            {[row.schedule, row.upload, row.approve, row.analytics, row.manageTeam, row.settings].map((val, j) => (
              <div key={j} className="flex justify-center">
                {val ? <Check className="w-4 h-4 text-emerald-500" /> : <Minus className="w-4 h-4 text-neutral-200" />}
              </div>
            ))}
          </div>
        ))}
        <div
          className="flex items-center gap-5 px-4 py-3"
          style={{ borderTop: '1px solid rgba(0,0,0,0.05)', backgroundColor: '#fafafa' }}
        >
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[10px] text-neutral-400">Allowed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Minus className="w-3.5 h-3.5 text-neutral-200" />
            <span className="text-[10px] text-neutral-400">No access</span>
          </div>
        </div>
      </div>
    </div>
  );
}
