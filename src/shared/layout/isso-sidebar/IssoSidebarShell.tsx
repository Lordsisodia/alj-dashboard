'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ISSO_NAV_CONFIG, PERSISTENT_NAV, PLATFORMS_NAV } from './sidebar-config';
import type { SectionConfig, NavItem, PlatformItem } from './sidebar-config';
import { cn } from '@/lib/utils';

export interface ChangelogEntry {
  date: string;
  tag: 'new' | 'update' | 'fix';
  title: string;
}

export interface SidebarConfig {
  navConfig?: SectionConfig[];
  persistentNav?: NavItem[];
  platformsNav?: PlatformItem[];
  appName?: string;
  changelog?: ChangelogEntry[];
  planLabel?: string;
}
import {
  Search, Plus, Zap, PanelLeftClose, PanelLeftOpen,
  Activity, LogOut, Settings, HelpCircle, ChevronRight,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

// ── Product icon sprites ──────────────────────────────────────────────────────
const PRODUCT_SPRITES: Record<string, string> = {
  hub:           '/sprites/nav-spritesheet-160x160-library.png',
  intelligence:  '/sprites/nav-spritesheet-160x160-discovery.png',
  recon:         '/sprites/nav-spritesheet-160x160-spyder.png',
  agents:        '/sprites/nav-spritesheet-160x160-lens.png',
  'content-gen': '/sprites/nav-spritesheet-160x160-briefs.png',
};

// ── Changelog entries ─────────────────────────────────────────────────────────
const DEFAULT_CHANGELOG: ChangelogEntry[] = [
  { date: 'Apr 2026', tag: 'new',     title: 'Intelligence v2 - Trend radar launched' },
  { date: 'Mar 2026', tag: 'update',  title: 'Schedule - bulk upload & CSV export' },
  { date: 'Mar 2026', tag: 'new',     title: 'Recon agent - competitor scraping live' },
  { date: 'Feb 2026', tag: 'fix',     title: 'Approvals - mobile review fixed' },
  { date: 'Feb 2026', tag: 'new',     title: 'Briefs AI - auto-generate from trends' },
  { date: 'Jan 2026', tag: 'update',  title: 'Dashboard - new analytics cards' },
];

const TAG_STYLE: Record<string, string> = {
  new:    'bg-emerald-500/15 text-emerald-400',
  update: 'bg-blue-500/15 text-blue-400',
  fix:    'bg-amber-500/15 text-amber-400',
};

// ── Foreplay-style logo icon (28×28 SVG, white on dark) ───────────────────────
function ForeplayLogoIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.875 4.375H9.625V9.625H4.375V7.875C4.375 5.94125 5.94125 4.375 7.875 4.375Z" fill="white"/>
      <path d="M18.375 4.375H11.375V9.625H18.375V4.375Z" fill="white" fillOpacity="0.85"/>
      <path d="M20.125 4.375C22.0588 4.375 23.625 5.94125 23.625 7.875V9.625H20.125V4.375Z" fill="white" fillOpacity="0.6"/>
      <path d="M9.625 11.375H4.375V16.625H9.625V11.375Z" fill="white" fillOpacity="0.85"/>
      <path d="M17.5 11.375H11.375V16.625H15.5C16.6046 16.625 17.5 15.7296 17.5 14.625V11.375Z" fill="white" fillOpacity="0.7"/>
      <path d="M23.625 11.375H19.25V14.625C19.25 15.7296 20.1454 16.625 21.25 16.625H23.625V11.375Z" fill="white" fillOpacity="0.2"/>
      <path d="M4.375 18.375H9.625V23.625H7.875C5.94125 23.625 4.375 22.0588 4.375 20.125V18.375Z" fill="white" fillOpacity="0.6"/>
      <path d="M14.625 18.375H11.375V23.625H16.625V20.375C16.625 19.2704 15.7296 18.375 14.625 18.375Z" fill="white" fillOpacity="0.2"/>
      <path d="M18.375 18.375H23.625V20.125C23.625 22.0588 22.0588 23.625 20.125 23.625H18.375V18.375Z" fill="white" fillOpacity="0.1"/>
    </svg>
  );
}

// ── Outside-click hook ────────────────────────────────────────────────────────
function useOnClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

// ── Tooltip wrapper ───────────────────────────────────────────────────────────
function IconTooltip({
  label, hotkey, children,
}: {
  label: string; hotkey: string; description: string; children: React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute top-[calc(100%+6px)] left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 whitespace-nowrap"
            style={{ backgroundColor: '#1c1c1c', border: '1px solid rgba(255,255,255,0.09)', boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}
          >
            <span className="text-xs font-semibold text-white">{label}</span>
            <span
              className="text-[10px] font-mono text-neutral-500 px-1 py-0.5 rounded"
              style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
            >
              {hotkey}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main sidebar ──────────────────────────────────────────────────────────────
export function IssoSidebarShell({ config }: { config?: SidebarConfig }) {
  const pathname = usePathname() ?? '';
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);

  const changelogRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(changelogRef, () => setShowChangelog(false));
  useOnClickOutside(avatarRef, () => setShowAvatar(false));

  const navConfig = config?.navConfig ?? ISSO_NAV_CONFIG;
  const persistentNav = config?.persistentNav ?? PERSISTENT_NAV;
  const platformsNav = config?.platformsNav ?? PLATFORMS_NAV;
  const appName = config?.appName ?? 'oracle';
  const planLabel = config?.planLabel ?? 'Upgrade ORACLE';
  const changelog = config?.changelog ?? DEFAULT_CHANGELOG;

  // Derive active section from nav items
  const activeSection = navConfig.find(section =>
    section.sections.some(s =>
      s.items.some(item =>
        pathname === item.href ||
        (item.href !== '/isso' && pathname.startsWith(item.href + '/'))
      )
    )
  )?.id ?? (navConfig[0]?.id ?? 'hub');

  const activeConfig = navConfig.find(s => s.id === activeSection);

  return (
    <aside className="flex flex-col flex-shrink-0 h-full" style={{ width: collapsed ? '76px' : '288px', transition: 'width 200ms ease' }}>

      {/* ── Logo + collapse button ── */}
      <div className={cn('flex flex-shrink-0 pt-4 pb-3', collapsed ? 'flex-col items-center gap-2 px-2' : 'flex-row items-center justify-between px-3')}>
        {!collapsed ? (
          <>
            <div className="flex items-center gap-2.5 px-1">
              <ForeplayLogoIcon size={28} />
              <span className="text-white font-semibold text-sm tracking-tight select-none">{appName}</span>
            </div>
            <button
              onClick={() => setCollapsed(true)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-neutral-600 hover:text-neutral-300 hover:bg-white/5 transition-all flex-shrink-0"
              title="Collapse sidebar"
            >
              <PanelLeftClose size={20} />
            </button>
          </>
        ) : (
          <>
            <ForeplayLogoIcon size={28} />
            <button
              onClick={() => setCollapsed(false)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-neutral-600 hover:text-neutral-300 hover:bg-white/5 transition-all"
              title="Expand sidebar"
            >
              <PanelLeftOpen size={20} />
            </button>
          </>
        )}
      </div>

      {/* ── Product icon row ── */}
      <div className={cn('flex flex-shrink-0', collapsed ? 'flex-col items-center gap-1 px-2' : 'flex-row items-center justify-between px-3 mb-1')}>
        {navConfig.map((section) => {
          const isActive = activeSection === section.id;
          const sprite = PRODUCT_SPRITES[section.id];
          const btn = (
            <Link
              key={section.id}
              href={section.sections[0]?.items[0]?.href ?? '/isso'}
              className={cn(
                'relative flex items-center justify-center rounded-[10px] transition-all duration-150 flex-shrink-0 overflow-hidden',
                'w-12 h-12',
                isActive ? 'opacity-100' : 'opacity-40 hover:opacity-100'
              )}
              style={isActive
                ? { backgroundColor: 'rgba(255,255,255,0.12)' }
                : undefined
              }
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.12)'; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = ''; }}
            >
              {sprite ? (
                <div
                  className="w-10 h-10 bg-no-repeat bg-left flex-shrink-0"
                  style={{ backgroundImage: `url('${sprite}')`, backgroundSize: 'auto 100%' }}
                />
              ) : (
                <span className="text-white/60">{section.icon}</span>
              )}
            </Link>
          );
          return (
            <IconTooltip key={section.id} label={section.label} hotkey={section.hotkey} description={section.description}>
              {btn}
            </IconTooltip>
          );
        })}

      </div>

      {/* ── Detail panel (hidden when collapsed) ── */}
      {!collapsed && (
        <>
          {/* Persistent nav links */}
          <div className="px-3 mb-1 flex-shrink-0">
            <div className="h-px w-full mb-3" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
            <p className="px-2 pb-1.5 text-[10px] uppercase tracking-[0.2em] text-neutral-600 select-none">Pages</p>
            <nav className="flex flex-col gap-0.5">
              {persistentNav.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'group flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-150',
                      isActive
                        ? 'text-white bg-white/[0.08]'
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
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Search */}
          <div className="flex items-center gap-1 mt-3 px-3 flex-shrink-0">
            <div className="flex-1 flex items-center gap-2 px-2.5 py-2 rounded-lg bg-white/5 hover:bg-white/[0.08] transition-colors min-w-0">
              <Search size={14} className="text-neutral-600 flex-shrink-0" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
                className="flex-1 bg-transparent text-sm text-neutral-300 placeholder-neutral-600 outline-none min-w-0"
              />
            </div>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-neutral-600 hover:text-neutral-300 transition-colors flex-shrink-0">
              <Plus size={16} />
            </button>
          </div>

          {/* Platforms */}
          <div className="px-3 mt-4 flex-shrink-0">
            <div className="h-px w-full mb-3" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
            <p className="px-2 pb-1.5 text-[10px] uppercase tracking-[0.2em] text-neutral-600 select-none">Platforms</p>
            <nav className="flex flex-col gap-0.5">
              {platformsNav.map((platform) => {
                const isActive = pathname.startsWith(platform.href);
                const Icon = platform.icon;
                return (
                  <Link
                    key={platform.id}
                    href={platform.comingSoon ? '#' : platform.href}
                    className={cn(
                      'group flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-150',
                      isActive
                        ? 'text-white bg-white/[0.08]'
                        : platform.comingSoon
                        ? 'text-neutral-700 cursor-default'
                        : 'text-neutral-500 hover:text-neutral-200 hover:bg-white/5'
                    )}
                    onClick={e => { if (platform.comingSoon) e.preventDefault(); }}
                  >
                    <span className={cn(
                      'flex-shrink-0 transition-colors',
                      isActive ? 'text-[#ff0069]' : platform.comingSoon ? 'text-neutral-700' : 'text-neutral-600 group-hover:text-neutral-400'
                    )}>
                      <Icon size={16} />
                    </span>
                    <span className="truncate font-normal flex-1">{platform.label}</span>
                    {platform.comingSoon && (
                      <span
                        className="text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded flex-shrink-0"
                        style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: '#525252' }}
                      >
                        Soon
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Plan CTA */}
          <div className="px-3 flex-shrink-0 mb-3">
            <div
              className="rounded-2xl p-4"
              style={{ backgroundColor: '#1c1c1e', border: '1px solid rgba(255,255,255,0.10)' }}
            >
              <p className="text-sm text-white leading-snug mb-3">
                <span className="font-bold">7 days left</span>
                <span className="text-neutral-400"> on your trial. Get in touch with us if you have any questions.</span>
              </p>
              <button
                className="w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-80 flex items-center justify-center gap-2"
                style={{ backgroundColor: '#2a2a2e', border: '1px solid rgba(255,255,255,0.10)' }}
              >
                <Zap size={14} />
                {planLabel}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Bottom row: avatar LEFT, changelog RIGHT (or stacked when collapsed) ── */}
      <div className={cn(
        'flex items-center flex-shrink-0 pb-4',
        collapsed ? 'flex-col-reverse gap-2 px-2' : 'flex-row items-center justify-between px-3'
      )}>

        {/* Avatar - icon only, no label */}
        <div ref={avatarRef} className="relative">
          <button
            onClick={() => { setShowAvatar(v => !v); setShowChangelog(false); }}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:ring-2 hover:ring-white/20 transition-all"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold text-white select-none"
              style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
            >
              AX
            </div>
          </button>

          {showAvatar && (
            <div
              className="absolute bottom-[calc(100%+8px)] left-0 z-50 w-64 rounded-2xl overflow-hidden"
              style={{ backgroundColor: '#161616', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 24px 48px rgba(0,0,0,0.5)' }}
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
                >
                  AX
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">Agency Account</p>
                  <p className="text-xs text-neutral-500 truncate">agency@oracle.co</p>
                </div>
              </div>
              <div
                className="mx-3 my-2 px-3 py-2 rounded-xl"
                style={{ backgroundColor: 'rgba(255,0,105,0.08)', border: '1px solid rgba(255,0,105,0.15)' }}
              >
                <p className="text-xs font-semibold text-white">ORACLE Agency Plan</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">$79 / month · Active</p>
              </div>
              <div className="py-1 px-2">
                {[
                  { icon: <Settings size={14} />, label: 'Settings' },
                  { icon: <HelpCircle size={14} />, label: 'Help & Support' },
                  { icon: <ChevronRight size={14} />, label: 'Knowledge Base' },
                ].map(item => (
                  <button key={item.label} className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-all text-left">
                    <span className="text-neutral-600">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="border-t border-white/[0.06] py-1 px-2 mb-1">
                <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-neutral-400 hover:text-red-400 hover:bg-red-500/5 transition-all text-left">
                  <LogOut size={14} className="text-neutral-600" />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Changelog RIGHT */}
        <div ref={changelogRef} className="relative">
          <button
            onClick={() => { setShowChangelog(v => !v); setShowAvatar(false); }}
            className={cn(
              'w-8 h-8 flex items-center justify-center rounded-lg transition-all',
              showChangelog ? 'text-white bg-white/10' : 'text-neutral-600 hover:text-neutral-300 hover:bg-white/5'
            )}
            title="What's new"
          >
            <Activity size={15} />
          </button>

          {showChangelog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setShowChangelog(false)}>
              <div
                className="w-[480px] rounded-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
                style={{ backgroundColor: '#161616', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 32px 64px rgba(0,0,0,0.6)' }}
              >
                {/* Header */}
                <div className="flex items-start justify-between px-6 py-5 border-b border-white/[0.06]">
                  <div>
                    <p className="text-base font-semibold text-white">What's new</p>
                    <p className="text-xs text-neutral-500 mt-0.5">Feature releases & updates</p>
                  </div>
                  <button
                    onClick={() => setShowChangelog(false)}
                    className="text-neutral-600 hover:text-neutral-300 transition-colors mt-0.5"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </button>
                </div>
                {/* Entries */}
                <div className="py-2 max-h-[480px] overflow-y-auto">
                  {changelog.map((entry, i) => (
                    <div key={i} className="flex items-start gap-4 px-6 py-3.5 hover:bg-white/[0.03] transition-colors">
                      <span className="text-[11px] text-neutral-600 mt-0.5 w-16 flex-shrink-0">{entry.date}</span>
                      <div className="flex-1 min-w-0 flex items-start gap-3">
                        <span className={cn('text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded mt-0.5 flex-shrink-0', TAG_STYLE[entry.tag])}>
                          {entry.tag}
                        </span>
                        <p className="text-sm text-neutral-300 leading-snug">{entry.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

    </aside>
  );
}
