'use client';

import { usePathname } from 'next/navigation';
import { useIssoNav } from './navigation-store';
import { ISSO_NAV_CONFIG } from './sidebar-config';
import { cn } from '@/lib/utils';

const SECTION_ROUTES: Record<string, string[]> = {
  home:         ['/content-gen'],
  hub:          ['/content-gen/approvals', '/content-gen/schedule', '/content-gen/community', '/content-gen/analytics'],
  briefs:       ['/content-gen/ideas', '/content-gen/content', '/content-gen/models'],
  intelligence: ['/content-gen/intelligence'],
  recon:        ['/content-gen/recon'],
  'content-gen':['/content-gen/content-gen'],
  agents:       ['/content-gen/agents'],
  team:         ['/content-gen/team', '/content-gen/settings'],
};

export function IssoIconNav() {
  const { activeSection, setActiveSection } = useIssoNav();
  const pathname = usePathname() ?? '';

  const derived = Object.entries(SECTION_ROUTES).find(([, routes]) =>
    routes.some(r => r === pathname || pathname.startsWith(r + '/'))
  )?.[0] ?? 'home';

  const active = activeSection ?? derived;

  return (
    <div className="flex flex-col items-center w-14 flex-shrink-0 py-4 px-2 border-r border-white/[0.06]">
      {/* Logo */}
      <div className="mb-5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
        >
          <span className="text-white font-bold text-xs tracking-tight select-none">IS</span>
        </div>
      </div>

      {/* Icons */}
      <nav className="flex flex-col items-center gap-1 flex-1 w-full">
        {ISSO_NAV_CONFIG.map((section) => {
          const isActive = active === section.id;
          return (
            <button
              key={section.id}
              type="button"
              title={section.label}
              onClick={() => setActiveSection(section.id as any)}
              className={cn(
                'flex items-center justify-center rounded-lg w-10 h-10 transition-all duration-150',
                isActive
                  ? 'text-[#ff0069]'
                  : 'text-neutral-500 hover:text-neutral-200 hover:bg-white/5'
              )}
              style={isActive ? { backgroundColor: 'rgba(255,0,105,0.1)' } : undefined}
            >
              {section.icon}
            </button>
          );
        })}
      </nav>

      {/* Avatar */}
      <div className="mt-auto">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold text-white select-none"
          style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
        >
          AX
        </div>
      </div>
    </div>
  );
}
