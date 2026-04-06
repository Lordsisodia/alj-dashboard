import React from 'react';
import {
  FileText, Users, AlertCircle, TrendingUp,
  Calendar, Sparkles, Check, BarChart2,
  Video, Image, Clock,
} from 'lucide-react';

export const KPI_CARDS = [
  {
    label: 'Total Posts',
    value: '1,847',
    sub: '+12 this week',
    subPositive: true,
    icon: <FileText size={18} />,
    iconColor: '#833ab4',
    iconBg: 'rgba(131,58,180,0.1)',
  },
  {
    label: 'Active Models',
    value: '4',
    sub: 'All active',
    subPositive: true,
    icon: <Users size={18} />,
    iconColor: '#22c55e',
    iconBg: 'rgba(34,197,94,0.1)',
  },
  {
    label: 'Pending Approvals',
    value: '3',
    sub: 'Needs review',
    subPositive: false,
    badge: 3,
    icon: <AlertCircle size={18} />,
    iconColor: '#ff0069',
    iconBg: 'rgba(255,0,105,0.1)',
  },
  {
    label: 'Engagement Rate',
    value: '4.2%',
    sub: '+0.4% vs last week',
    subPositive: true,
    icon: <TrendingUp size={18} />,
    iconColor: '#f59e0b',
    iconBg: 'rgba(245,158,11,0.1)',
  },
];

export const QUICK_ACTIONS = [
  {
    id: 'schedule',
    label: 'Schedule Post',
    desc: 'Add to publishing queue',
    icon: <Calendar size={20} />,
    iconColor: '#833ab4',
    iconBg: 'rgba(131,58,180,0.1)',
  },
  {
    id: 'brief',
    label: 'New Brief',
    desc: 'Generate AI content brief',
    icon: <Sparkles size={20} />,
    iconColor: '#ff0069',
    iconBg: 'rgba(255,0,105,0.1)',
  },
  {
    id: 'approvals',
    label: 'Review Approvals',
    desc: '3 items waiting',
    badge: 3,
    icon: <Check size={20} />,
    iconColor: '#22c55e',
    iconBg: 'rgba(34,197,94,0.1)',
  },
  {
    id: 'analytics',
    label: 'View Analytics',
    desc: 'Performance overview',
    icon: <BarChart2 size={20} />,
    iconColor: '#f59e0b',
    iconBg: 'rgba(245,158,11,0.1)',
  },
];

export const ACTIVITY_FEED = [
  { id: 'f1', color: '#22c55e', icon: <Check size={12} />,    text: 'Mikee approved content for',   target: '@abg.ricebunny',   time: '2m ago'  },
  { id: 'f2', color: '#833ab4', icon: <Calendar size={12} />, text: '3 posts scheduled for',        target: '@rhinxrenx',       time: '18m ago' },
  { id: 'f3', color: '#ff0069', icon: <Sparkles size={12} />, text: 'Brief generated for',          target: 'Ella Mira',        time: '1h ago'  },
  { id: 'f4', color: '#f59e0b', icon: <Video size={12} />,    text: 'Reel exported by Raphael for', target: '@ellamira',        time: '2h ago'  },
  { id: 'f5', color: '#833ab4', icon: <Check size={12} />,    text: 'Yssa approved content for',   target: '@samchase',        time: '3h ago'  },
  { id: 'f6', color: '#22c55e', icon: <Image size={12} />,    text: '5 clips uploaded to',         target: 'Content Pipeline', time: '5h ago'  },
  { id: 'f7', color: '#ff0069', icon: <Sparkles size={12} />, text: 'Brief generated for',          target: 'Tyler Rex',        time: '1d ago'  },
  { id: 'f8', color: '#f59e0b', icon: <Calendar size={12} />, text: '7 posts scheduled for',        target: '@abg.ricebunny',   time: '1d ago'  },
];

export const UPCOMING_POSTS = [
  { id: 'p1', account: '@abg.ricebunny', type: 'Reel',    time: 'Today, 7:00 PM',    icon: <Video size={13} />,   typeColor: '#833ab4' },
  { id: 'p2', account: '@rhinxrenx',     type: 'Photo',   time: 'Today, 9:00 PM',    icon: <Image size={13} />,   typeColor: '#f59e0b' },
  { id: 'p3', account: '@ellamira',      type: 'Reel',    time: 'Tomorrow, 6:00 PM', icon: <Video size={13} />,   typeColor: '#833ab4' },
  { id: 'p4', account: '@samchase',      type: 'Story',   time: 'Tomorrow, 8:00 PM', icon: <FileText size={13} />,typeColor: '#22c55e' },
  { id: 'p5', account: '@abg.ricebunny', type: 'PPV',     time: 'Apr 8, 7:00 PM',    icon: <Sparkles size={13} />,typeColor: '#ff0069' },
];

export const MODELS = [
  { id: 'm1', name: 'Tyler Rex',  handle: '@abg.ricebunny', initials: 'TR', color: '#ff0069', step: 'Approved',  reels: 3 },
  { id: 'm2', name: 'Ren Rhinx',  handle: '@rhinxrenx',     initials: 'RR', color: '#833ab4', step: 'Editing',   reels: 2 },
  { id: 'm3', name: 'Ella Mira',  handle: '@ellamira',      initials: 'EM', color: '#f59e0b', step: 'Briefed',   reels: 1 },
  { id: 'm4', name: 'Sam Chase',  handle: '@samchase',      initials: 'SC', color: '#22c55e', step: 'Scheduled', reels: 4 },
];

export const PIPELINE_STEPS = ['Briefed', 'Filming', 'Editing', 'Approved', 'Scheduled'];

export const MODEL_PNL = [
  { id: 'm1', name: 'Tyler Rex',  initials: 'TR', color: '#ff0069', revenue: 4200, cost: 840,  ltv: 12400, chatCvr: 0.34 },
  { id: 'm2', name: 'Ren Rhinx',  initials: 'RR', color: '#833ab4', revenue: 3100, cost: 620,  ltv:  9800, chatCvr: 0.28 },
  { id: 'm3', name: 'Ella Mira',  initials: 'EM', color: '#f59e0b', revenue: 2800, cost: 560,  ltv:  7600, chatCvr: 0.22 },
  { id: 'm4', name: 'Sam Chase',  initials: 'SC', color: '#22c55e', revenue: 1900, cost: 380,  ltv:  5200, chatCvr: 0.19 },
];

export const EXPIRING_SUBSCRIBERS = [
  { id: 'sub1', handle: '@fan_mikee',   expiresInHours: 6,  tier: 'Premium', spent: 240 },
  { id: 'sub2', handle: '@fan_luxe99',  expiresInHours: 14, tier: 'VIP',     spent: 580 },
  { id: 'sub3', handle: '@fan_redbull', expiresInHours: 22, tier: 'Standard',spent: 90  },
  { id: 'sub4', handle: '@fan_ghost_x', expiresInHours: 31, tier: 'Premium', spent: 310 },
  { id: 'sub5', handle: '@fan_ace77',   expiresInHours: 48, tier: 'Standard',spent: 60  },
];
