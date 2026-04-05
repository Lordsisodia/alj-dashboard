import type { Role } from '../../types';

const ROLE_STYLES: Record<Role, { bg: string; color: string; border: string }> = {
  Admin:  { bg: 'rgba(255,0,105,0.08)',  color: '#ff0069', border: 'rgba(255,0,105,0.2)'   },
  VA:     { bg: 'rgba(252,175,69,0.1)',  color: '#d97706', border: 'rgba(252,175,69,0.25)' },
  Editor: { bg: 'rgba(120,194,87,0.1)',  color: '#4d7c0f', border: 'rgba(120,194,87,0.25)' },
  Model:  { bg: 'rgba(131,58,180,0.08)', color: '#833ab4', border: 'rgba(131,58,180,0.2)'  },
};

export function RoleBadge({ role }: { role: Role }) {
  const s = ROLE_STYLES[role];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      {role}
    </span>
  );
}
