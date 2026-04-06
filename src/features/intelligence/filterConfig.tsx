// Filter category definitions for the Intelligence Add Filter pill.
// Kept in a .tsx file because options contain JSX icon nodes.
import {
  Film, Video, Image, GalleryHorizontal, Layers,
  Tag, Heart, Dumbbell, Sun, Star, Flame, Laugh,
  Globe, Languages, Paintbrush2, Clock,
  Clapperboard, BookOpen, Music2, BookmarkCheck,
} from 'lucide-react';
import type { FilterCategory } from '@/isso/layout/ContentPageShell';

function IgIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="ig-fc" x1="0" y1="24" x2="24" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#f09433"/>
          <stop offset="25%"  stopColor="#e6683c"/>
          <stop offset="50%"  stopColor="#dc2743"/>
          <stop offset="75%"  stopColor="#cc2366"/>
          <stop offset="100%" stopColor="#bc1888"/>
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#ig-fc)"/>
      <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8" fill="none"/>
      <circle cx="17.2" cy="6.8" r="1.2" fill="white"/>
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.89a8.18 8.18 0 004.78 1.52V7.0a4.85 4.85 0 01-1.01-.31z"/>
    </svg>
  );
}

export const FILTER_CATEGORIES: FilterCategory[] = [
  { id: 'saved', label: 'Saved Filters', icon: <BookmarkCheck size={13} /> },
  {
    id: 'format', label: 'Format', icon: <Film size={13} />,
    options: [
      { value: 'Reel',     icon: <Video             size={12} className="text-neutral-400" /> },
      { value: 'Post',     icon: <Image             size={12} className="text-neutral-400" /> },
      { value: 'Carousel', icon: <GalleryHorizontal size={12} className="text-neutral-400" /> },
      { value: 'Story',    icon: <Layers            size={12} className="text-neutral-400" /> },
    ],
  },
  {
    id: 'niche', label: 'Niche', icon: <Tag size={13} />,
    options: [
      { value: 'GFE',         icon: <Heart   size={12} className="text-neutral-400" /> },
      { value: 'Fitness',     icon: <Dumbbell size={12} className="text-neutral-400" /> },
      { value: 'Lifestyle',   icon: <Sun     size={12} className="text-neutral-400" /> },
      { value: 'ABG',         icon: <Star    size={12} className="text-neutral-400" /> },
      { value: 'Thirst Trap', icon: <Flame   size={12} className="text-neutral-400" /> },
      { value: 'Meme',        icon: <Laugh   size={12} className="text-neutral-400" /> },
    ],
  },
  {
    id: 'platform', label: 'Platform', icon: <Globe size={13} />,
    options: [
      { value: 'Instagram', icon: <IgIcon /> },
      { value: 'TikTok',    icon: <TikTokIcon /> },
    ],
  },
  {
    id: 'language', label: 'Language', icon: <Languages size={13} />,
    options: [
      { value: 'English' }, { value: 'Spanish' }, { value: 'Filipino' },
      { value: 'Portuguese' }, { value: 'French' },
    ],
  },
  {
    id: 'content-style', label: 'Content Style', icon: <Paintbrush2 size={13} />,
    options: [
      { value: 'Raw',       icon: <Clapperboard size={12} className="text-neutral-400" /> },
      { value: 'Cinematic', icon: <Film         size={12} className="text-neutral-400" /> },
      { value: 'Tutorial',  icon: <BookOpen     size={12} className="text-neutral-400" /> },
      { value: 'Vlog',      icon: <Video        size={12} className="text-neutral-400" /> },
      { value: 'Music',     icon: <Music2       size={12} className="text-neutral-400" /> },
    ],
  },
  {
    id: 'video-length', label: 'Video Length', icon: <Clock size={13} />,
    options: [
      { value: 'Under 15s' }, { value: '15-30s' }, { value: '30-60s' },
      { value: '1-3 min' }, { value: '3+ min' },
    ],
  },
];
