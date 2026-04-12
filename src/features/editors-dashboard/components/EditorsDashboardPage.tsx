'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  CheckSquare, Sparkles, Calendar, Upload,
  Layers, Clock, ChevronRight, Image, Video,
  Lightbulb, Users,
} from 'lucide-react';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';

// ── Seed data ────────────────────────────────────────────────────────────────

const EDITOR_KPIS = [
  { label: 'Pending Approvals', value: '5',   icon: CheckSquare, color: '#ff0069', urgent: true  },
  { label: 'Scheduled Today',   value: '8',   icon: Calendar,    color: '#833ab4', urgent: false },
  { label: 'Clips in Library',  value: '124', icon: Upload,      color: '#22c55e', urgent: false },
  { label: 'Briefs This Week',  value: '12',  icon: Lightbulb,   color: '#f59e0b', urgent: false },
];

const APPROVAL_QUEUE = [
  { id: 'a1', model: 'Tyler Rex',  initials: 'TR', color: '#ff0069', type: 'Reel',  title: 'GFE morning routine',       submitted: '2h ago' },
  { id: 'a2', model: 'Ella Mira',  initials: 'EM', color: '#f59e0b', type: 'Photo', title: 'Fitness shoot  -  gym set',   submitted: '4h ago' },
  { id: 'a3', model: 'Ren Rhinx',  initials: 'RR', color: '#833ab4', type: 'Reel',  title: 'Asian food vlog #12',       submitted: '6h ago' },
  { id: 'a4', model: 'Sam Chase',  initials: 'SC', color: '#22c55e', type: 'Story', title: 'Q&A tease for OF drop',     submitted: '1d ago' },
  { id: 'a5', model: 'Tyler Rex',  initials: 'TR', color: '#ff0069', type: 'PPV',   title: 'Exclusive poolside set',    submitted: '1d ago' },
];

const UPCOMING_SCHEDULE = [
  { id: 's1', account: '@abg.ricebunny', type: 'Reel',  time: 'Today, 7:00 PM',    color: '#833ab4' },
  { id: 's2', account: '@rhinxrenx',     type: 'Photo', time: 'Today, 9:00 PM',    color: '#f59e0b' },
  { id: 's3', account: '@ellamira',      type: 'Reel',  time: 'Tomorrow, 6:00 PM', color: '#833ab4' },
  { id: 's4', account: '@samchase',      type: 'Story', time: 'Tomorrow, 8:00 PM', color: '#22c55e' },
];

const CONTENT_TOOLS = [
  { label: 'Generate Brief',  href: '/models/ideas',               icon: Lightbulb, color: '#ff0069', desc: 'AI-powered content ideas' },
  { label: 'Generate Content', href: '/models/content-gen/generate', icon: Sparkles,  color: '#833ab4', desc: 'Create AI reels & images' },
  { label: 'Gallery',          href: '/models/content-gen/gallery',  icon: Image,     color: '#22c55e', desc: 'Browse generated content' },
  { label: 'Models',           href: '/models/models',               icon: Users,     color: '#f59e0b', desc: 'Model references & assets' },
];

const TYPE_ICON: Record<string, React.ReactNode> = {
  Reel:  <Video size={12} />,
  Photo: <Image size={12} />,
  Story: <Layers size={12} />,
  PPV:   <Sparkles size={12} />,
};

// ── Components ──────────────────────────────────────────────────────────────

function KpiCard({ label, value, icon: Icon, color, urgent }: typeof EDITOR_KPIS[0]) {
  return (
    <div className="rounded-xl p-4 bg-white" style={{ border: `1px solid ${urgent ? 'rgba(255,0,105,0.15)' : 'rgba(0,0,0,0.07)'}` }}>
      <div className="flex items-center justify-between mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}18`, color }}>
          <Icon size={16} />
        </div>
        {urgent && (
          <span className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full" style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}>
            {value}
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-neutral-900">{value}</p>
      <p className="text-xs text-neutral-400 mt-0.5">{label}</p>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function EditorsDashboardPage() {
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <ContentPageShell
      icon={
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}>
          <Layers size={16} className="text-white" />
        </div>
      }
      title="Editor Hub"
      stat={{ label: 'Pending', value: 5 }}
      searchPlaceholder="Search content, approvals..."
    >
      <div className="p-4 space-y-5">
        {/* Greeting */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <h2 className="text-xl font-bold text-neutral-900">Content Queue</h2>
          <p className="text-sm text-neutral-500 mt-0.5">{today}</p>
        </motion.div>

        {/* KPI Cards */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }} className="grid grid-cols-4 gap-3">
          {EDITOR_KPIS.map(kpi => <KpiCard key={kpi.label} {...kpi} />)}
        </motion.div>

        {/* Two-column: Approval Queue + Schedule */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} className="grid grid-cols-5 gap-4">
          {/* Approval Queue - 3 cols */}
          <div className="col-span-3 rounded-xl bg-white overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(255,0,105,0.1)', color: '#ff0069' }}>
                  <CheckSquare size={13} />
                </div>
                <p className="text-sm font-semibold text-neutral-900">Awaiting Review</p>
                <span className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full" style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}>
                  {APPROVAL_QUEUE.length}
                </span>
              </div>
              <Link href="/models/approvals" className="text-[11px] font-medium text-neutral-400 hover:text-neutral-700 flex items-center gap-0.5 transition-colors">
                View All <ChevronRight size={12} />
              </Link>
            </div>
            {APPROVAL_QUEUE.map(item => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ backgroundColor: item.color }}>
                  {item.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-900 truncate">{item.title}</p>
                  <p className="text-[10px] text-neutral-400">{item.model}</p>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(0,0,0,0.04)', color: '#737373' }}>
                  {TYPE_ICON[item.type]} {item.type}
                </span>
                <span className="text-[10px] text-neutral-400 flex items-center gap-0.5 flex-shrink-0">
                  <Clock size={10} /> {item.submitted}
                </span>
              </div>
            ))}
          </div>

          {/* Upcoming Schedule - 2 cols */}
          <div className="col-span-2 rounded-xl bg-white overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(131,58,180,0.1)', color: '#833ab4' }}>
                  <Calendar size={13} />
                </div>
                <p className="text-sm font-semibold text-neutral-900">Up Next</p>
              </div>
              <Link href="/models/schedule" className="text-[11px] font-medium text-neutral-400 hover:text-neutral-700 flex items-center gap-0.5 transition-colors">
                Calendar <ChevronRight size={12} />
              </Link>
            </div>
            <div className="p-3 space-y-2">
              {UPCOMING_SCHEDULE.map(item => (
                <div key={item.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg" style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
                  <span className="flex items-center justify-center w-6 h-6 rounded-md" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                    {TYPE_ICON[item.type]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">{item.account}</p>
                    <p className="text-[10px] text-neutral-400">{item.time}</p>
                  </div>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded text-neutral-500" style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}>
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Content Tools */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">Content Tools</p>
          <div className="grid grid-cols-4 gap-3">
            {CONTENT_TOOLS.map(tool => (
              <Link
                key={tool.label}
                href={tool.href}
                className="group rounded-xl p-4 bg-white hover:shadow-sm transition-all"
                style={{ border: '1px solid rgba(0,0,0,0.07)' }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: `${tool.color}15`, color: tool.color }}>
                  <tool.icon size={16} />
                </div>
                <p className="text-sm font-semibold text-neutral-900 group-hover:text-neutral-700">{tool.label}</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </ContentPageShell>
  );
}
