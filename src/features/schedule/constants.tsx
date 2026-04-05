import React from 'react';
import { Film, Image, BookOpen, LayoutGrid, Video } from 'lucide-react';
import type { ContentType, FilterType, ScheduledPost, TopPost } from './types';

export const SCHEDULED_POSTS: ScheduledPost[] = [
  { day: 3,  type: 'reel',     handle: '@abg.ricebunny' },
  { day: 3,  type: 'post',     handle: '@rhinxrenx' },
  { day: 5,  type: 'reel',     handle: '@ellamira' },
  { day: 5,  type: 'story',    handle: '@abg.ricebunny' },
  { day: 7,  type: 'post',     handle: '@rhinxrenx' },
  { day: 7,  type: 'carousel', handle: '@ellamira' },
  { day: 10, type: 'reel',     handle: '@abg.ricebunny' },
  { day: 12, type: 'video',    handle: '@rhinxrenx' },
  { day: 12, type: 'post',     handle: '@ellamira' },
  { day: 14, type: 'reel',     handle: '@abg.ricebunny' },
  { day: 14, type: 'story',    handle: '@rhinxrenx' },
  { day: 17, type: 'post',     handle: '@ellamira' },
  { day: 19, type: 'reel',     handle: '@rhinxrenx' },
  { day: 19, type: 'carousel', handle: '@abg.ricebunny' },
  { day: 21, type: 'post',     handle: '@ellamira' },
  { day: 24, type: 'reel',     handle: '@abg.ricebunny' },
  { day: 24, type: 'video',    handle: '@rhinxrenx' },
  { day: 26, type: 'story',    handle: '@ellamira' },
  { day: 28, type: 'reel',     handle: '@abg.ricebunny' },
  { day: 28, type: 'post',     handle: '@rhinxrenx' },
];

export const ENGAGEMENT_DATA = [
  { label: 'Mon', value: 42 },
  { label: 'Tue', value: 38 },
  { label: 'Wed', value: 65 },
  { label: 'Thu', value: 71 },
  { label: 'Fri', value: 58 },
  { label: 'Sat', value: 83 },
  { label: 'Sun', value: 76 },
];

export const TOP_POSTS: TopPost[] = [
  { rank: 1, gradientFrom: '#ff0069', gradientTo: '#833ab4', likes: 892, comments: 124, saves: 67 },
  { rank: 2, gradientFrom: '#833ab4', gradientTo: '#fcaf45', likes: 743, comments: 89,  saves: 41 },
  { rank: 3, gradientFrom: '#fcaf45', gradientTo: '#ff0069', likes: 612, comments: 67,  saves: 38 },
];

export const APRIL_START_OFFSET = 3;
export const APRIL_DAYS = 30;
export const TODAY = 5;

export const TYPE_COLOR: Record<ContentType, string> = {
  reel:     '#ff0069',
  post:     '#833ab4',
  story:    '#fcaf45',
  carousel: '#78c257',
  video:    '#4a9eff',
};

export const TYPE_ICON: Record<ContentType, React.ReactNode> = {
  reel:     <Film className="w-2.5 h-2.5 text-white/80" />,
  post:     <Image className="w-2.5 h-2.5 text-white/80" />,
  story:    <BookOpen className="w-2.5 h-2.5 text-white/80" />,
  carousel: <LayoutGrid className="w-2.5 h-2.5 text-white/80" />,
  video:    <Video className="w-2.5 h-2.5 text-white/80" />,
};

export const FILTER_TO_TYPE: Record<Exclude<FilterType, 'All'>, ContentType> = {
  Reels:     'reel',
  Stories:   'story',
  Posts:     'post',
  Carousels: 'carousel',
  Videos:    'video',
};

export const RANK_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];
export const RANK_LABELS = ['Gold', 'Silver', 'Bronze'];

export const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

export const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const } },
};
