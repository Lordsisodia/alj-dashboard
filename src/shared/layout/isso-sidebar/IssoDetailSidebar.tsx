'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useIssoNav } from './navigation-store';
import { getSectionConfig } from './sidebar-config';
import { cn } from '@/lib/utils';

export function IssoDetailSidebar() {
  const { activeSection } = useIssoNav();
  const pathname = usePathname() ?? '';
  const config = getSectionConfig(activeSection);

  if (!config) return null;

  return (
    <div className="flex flex-col w-[196px] flex-shrink-0 h-full overflow-y-auto overflow-x-hidden py-4 px-3">
      {/* Nav items - no section title here, that lives in the page */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {config.sections.map((section, si) => (
          <div key={si} className="flex flex-col gap-0.5">
            {!section.hideTitle && (
              <p className="px-2 pt-3 pb-1 text-[10px] uppercase tracking-[0.2em] text-neutral-600 select-none">
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/isso' && pathname.startsWith(item.href + '/'));
              return (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-all duration-150 group',
                    isActive
                      ? 'bg-white/8 text-white'
                      : 'text-neutral-500 hover:text-neutral-200 hover:bg-white/5'
                  )}
                >
                  <span className={cn(
                    'flex-shrink-0 transition-colors',
                    isActive ? 'text-[#ff0069]' : 'text-neutral-600 group-hover:text-neutral-400'
                  )}>
                    {item.icon}
                  </span>
                  <span className="truncate font-normal">{item.label}</span>
                  {item.badge && item.badge !== 'dot' && (
                    <span
                      className="ml-auto text-[10px] font-semibold text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
                      style={{ backgroundColor: '#ff0069' }}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.badge === 'dot' && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#ff0069] flex-shrink-0" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Plan CTA - pinned to bottom */}
      <div className="mt-auto pt-4">
        <div
          className="rounded-xl border border-white/8 p-3"
          style={{ background: 'rgba(255,0,105,0.05)' }}
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-0.5 select-none">Plan</p>
          <p className="text-sm font-semibold text-white leading-tight">ORACLE Agency</p>
          <p className="text-xs text-white/40 mt-0.5">$79 / month</p>
          <button
            className="mt-2.5 w-full rounded-lg py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-80"
            style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
          >
            Upgrade Plan
          </button>
        </div>
      </div>
    </div>
  );
}
