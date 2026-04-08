import { Users, Download, Sparkles, Clapperboard, Send } from 'lucide-react';

export interface FunnelStage {
  id: string;
  label: string;
  sublabel: string;
  count: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  href?: string;
}

export const STAGES: FunnelStage[] = [
  { id: 'basket',    label: 'Basket',    sublabel: 'Creators tracked',     count: 8,   unit: 'creators', icon: <Users size={14} />,       color: '#6b7280' },
  { id: 'scraped',   label: 'Scraped',   sublabel: 'Posts captured today', count: 284, unit: 'posts',    icon: <Download size={14} />,    color: '#4a9eff', href: '/isso/recon' },
  { id: 'refined',   label: 'Refined',   sublabel: 'Saved to Hub',         count: 47,  unit: 'saved',    icon: <Sparkles size={14} />,    color: '#833ab4', href: '/isso' },
  { id: 'generated', label: 'Generated', sublabel: 'AI clips created',     count: 12,  unit: 'clips',    icon: <Clapperboard size={14} />, color: '#ff0069', href: '/isso/ideas' },
  { id: 'posted',    label: 'Posted',    sublabel: 'Live this week',        count: 8,   unit: 'live',     icon: <Send size={14} />,        color: '#78c257', href: '/isso/schedule' },
];
