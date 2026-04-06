// @ts-nocheck
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Users,
  BarChart2,
  Calendar,
  FileText,
  Settings,
  Star,
  Folder,
  Search,
  Plus,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

type Module = {
  id: string
  label: string
  href: string
  icon: React.ReactNode
  hotkey?: string
  locked?: boolean
}

type NavItem = {
  label: string
  href: string
  icon: React.ReactNode
}

type FolderItem = {
  id: string
  label: string
  icon: 'star' | 'folder'
  children?: FolderItem[]
}

// ─── Config ───────────────────────────────────────────────────────────────────

const MODULES: Module[] = [
  { id: 'dashboard',   label: 'Dashboard',   href: '/isso',              icon: <Home size={20} />,     hotkey: '⌘1' },
  { id: 'models',      label: 'Models',      href: '/isso/models',       icon: <Users size={20} />,    hotkey: '⌘2' },
  { id: 'content',     label: 'Content',     href: '/isso/content',      icon: <FileText size={20} />, hotkey: '⌘3' },
  { id: 'analytics',   label: 'Analytics',   href: '/isso/analytics',    icon: <BarChart2 size={20} />,hotkey: '⌘4' },
  { id: 'schedule',    label: 'Schedule',    href: '/isso/schedule',     icon: <Calendar size={20} />, hotkey: '⌘5', locked: true },
]

const NAV_ITEMS: NavItem[] = [
  { label: 'Home',      href: '/isso',           icon: <Home size={20} /> },
  { label: 'Team',      href: '/isso/team',      icon: <Users size={20} /> },
  { label: 'Settings',  href: '/isso/settings',  icon: <Settings size={20} /> },
]

const DEFAULT_FOLDERS: FolderItem[] = [
  { id: 'starred',  label: 'Starred',        icon: 'star' },
  { id: 'default',  label: 'Default Folder', icon: 'folder' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function ModuleButton({ module, isActive }: { module: Module; isActive: boolean }) {
  return (
    <Link
      href={module.locked ? '#' : module.href}
      className={cn(
        'relative flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-100',
        isActive ? 'bg-white/10' : 'hover:bg-white/5',
        module.locked && 'cursor-not-allowed',
      )}
      title={module.label}
    >
      {module.locked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg z-10" style={{ opacity: 0.44 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
            <path d="M16.25 9.75V7.25C16.25 4.90279 14.3472 3 12 3C9.65279 3 7.75 4.90279 7.75 7.25V9.75M12 14V17M6.75 21.25H17.25C18.3546 21.25 19.25 20.3546 19.25 19.25V11.75C19.25 10.6454 18.3546 9.75 17.25 9.75H6.75C5.64543 9.75 4.75 10.6454 4.75 11.75V19.25C4.75 20.3546 5.64543 21.25 6.75 21.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
      <span className={cn('text-white/60', module.locked && 'opacity-20', isActive && 'text-white')}>
        {module.icon}
      </span>
    </Link>
  )
}

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname()
  const isActive = pathname === item.href

  return (
    <Link
      href={item.href}
      className={cn(
        'group relative flex items-center gap-2 px-1.5 py-1.5 rounded-md transition-colors duration-100 flex-shrink-0',
        isActive
          ? 'bg-white/10 text-white'
          : 'text-white/60 hover:bg-white/5 hover:text-white/80',
      )}
    >
      <span className="relative w-5 h-5 flex items-center justify-center flex-shrink-0">
        {item.icon}
      </span>
      <span className="text-sm font-normal">{item.label}</span>
    </Link>
  )
}

function FolderRow({ folder }: { folder: FolderItem }) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="group w-full flex items-center gap-2 pl-1.5 py-1.5 pr-2.5 rounded-md h-8 flex-shrink-0 text-left select-none transition-colors duration-100 hover:bg-white/5 text-white/60 hover:text-white/80"
      >
        {folder.icon === 'star' ? <Star size={18} /> : <Folder size={18} />}
        <span className="flex-1 truncate text-sm font-normal">{folder.label}</span>
        {folder.children && folder.children.length > 0 && (
          <ChevronRight
            size={14}
            className={cn('transition-transform duration-150', open && 'rotate-90')}
          />
        )}
      </button>
      {open && folder.children && (
        <div className="pl-3">
          {folder.children.map(child => (
            <FolderRow key={child.id} folder={child} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [search, setSearch] = useState('')

  const activeModule = MODULES.find(m => pathname.startsWith(m.href) && m.href !== '/isso')
    ?? MODULES[0]

  return (
    <div
      className={cn(
        'relative flex flex-col h-screen flex-shrink-0 transition-all duration-[250ms]',
        collapsed ? 'w-16' : 'w-[288px]',
      )}
      style={{
        padding: collapsed ? '20px 12px' : '20px',
        background:
          'radial-gradient(100% 50% at 100% 50%, rgba(0,107,255,0.16) 0px, rgba(15,16,25,0.2) 100%)',
        backgroundColor: '#0f1019',
      }}
    >
      {/* Header: logo + collapse */}
      <div className="flex items-center justify-between flex-shrink-0 mb-3">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Zap size={20} className="text-white" />
            <span className="text-white font-semibold text-sm">isso</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'p-1 text-white/50 hover:text-white transition-colors duration-100 rounded',
            collapsed && 'mx-auto',
          )}
        >
          {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>

      {/* Module switcher */}
      <div className="flex flex-col flex-shrink-0 gap-1">
        <div className="flex items-center gap-0.5">
          {MODULES.map(module => (
            <ModuleButton
              key={module.id}
              module={module}
              isActive={activeModule.id === module.id}
            />
          ))}
        </div>

        {/* Active module label */}
        {!collapsed && (
          <div className="relative w-full h-8 overflow-hidden">
            <div className="flex items-center gap-1 w-fit">
              <div className="flex items-center gap-1 pl-2 py-0.5 pr-0.5 rounded-lg bg-white/10">
                <span className="text-white whitespace-nowrap text-xs font-medium">
                  {activeModule.label}
                </span>
                {activeModule.hotkey && (
                  <div className="bg-[#0f1019] rounded-md px-1.5 py-0.5">
                    <span className="text-white text-xs font-medium">{activeModule.hotkey}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nav links */}
      {!collapsed && (
        <div className="flex flex-col flex-shrink-0 mt-1">
          {NAV_ITEMS.map(item => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>
      )}

      {/* Search + create */}
      {!collapsed && (
        <div className="flex items-center gap-1 flex-shrink-0 mt-2">
          <div className="flex-grow flex items-center gap-2 p-1.5 rounded-lg bg-white/5 hover:bg-white/8 transition-colors min-w-0">
            <Search size={16} className="text-white/40 flex-shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="flex-grow bg-transparent text-white/70 placeholder-white/30 text-sm outline-none min-w-0"
            />
          </div>
          <button className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-white/10 transition-colors text-white/50 hover:text-white flex-shrink-0">
            <Plus size={18} />
          </button>
        </div>
      )}

      {/* Folders */}
      {!collapsed && (
        <div className="flex-grow flex flex-col pt-2 min-h-0 overflow-y-auto scrollbar-hide">
          <div className="flex flex-col gap-0.5 pb-12">
            {DEFAULT_FOLDERS.map(folder => (
              <FolderRow key={folder.id} folder={folder} />
            ))}
          </div>
        </div>
      )}

      {/* Trial / upgrade CTA */}
      {!collapsed && (
        <div className="flex-shrink-0 mt-2">
          <div className="flex flex-col p-1 rounded-xl bg-white/5">
            <p className="text-white/50 px-2 pb-2 pt-1 text-xs font-normal">
              <span className="font-medium text-white">Pro plan</span> - AI pipeline active
            </p>
            <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 transition-colors">
              <Zap size={16} className="text-white" />
              <span className="text-white text-xs font-medium">Upgrade Plan</span>
            </button>
          </div>
        </div>
      )}

      {/* Footer: avatar + changelog */}
      <div className="flex items-center mt-3 flex-shrink-0">
        <button className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
          S
        </button>
        {!collapsed && (
          <button className="ml-auto group cursor-pointer p-1.5 rounded-md transition-colors hover:bg-white/10 text-white/50 hover:text-white">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M6 13.25L3.97812 10.015C3.76998 9.68198 4.00941 9.25 4.40212 9.25H15.691C16.0627 9.25 16.3044 9.64116 16.1382 9.97361L15 12.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 15.75C5.48572 16.9386 7.57319 17.0183 9.14522 15.9464L9.37651 15.7887C10.9621 14.7076 13.0452 14.6968 14.642 15.7613L16.5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 8.875L10.2158 4.29493C10.4965 3.89514 11.125 4.09376 11.125 4.58225V8.875" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
