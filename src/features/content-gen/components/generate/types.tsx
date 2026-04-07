'use client';

import { Zap, Film, Waves } from 'lucide-react';
import type { Id } from '@/convex/_generated/dataModel';

export type Generator = 'flux' | 'kling' | 'higgsfield';
export type Style = 'cinematic' | 'vlog' | 'aesthetic' | 'trending';

export type ConvexModel = {
  _id: Id<'models'>;
  name: string;
  niche: string;
  avatarColor: string;
  igHandle?: string;
};

export type ConvexJob = {
  _id: Id<'ideas'>;
  hook: string;
  style: string;
  campaign?: string;
  status: 'draft' | 'generating' | 'ready' | 'sent';
  _creationTime: number;
  modelId: Id<'models'>;
};

export const GENERATORS = [
  { id: 'flux'       as Generator, label: 'FLUX',       eta: 45,  icon: <Zap size={12} />,   description: 'Face transfer. Fastest.' },
  { id: 'kling'      as Generator, label: 'Kling',      eta: 240, icon: <Film size={12} />,  description: 'Text-to-video. Most realistic.' },
  { id: 'higgsfield' as Generator, label: 'Higgsfield', eta: 180, icon: <Waves size={12} />, description: 'Scene-aware motion.' },
];

export const STYLES = [
  { id: 'cinematic'  as Style, label: 'Cinematic'  },
  { id: 'vlog'       as Style, label: 'Vlog'       },
  { id: 'aesthetic'  as Style, label: 'Aesthetic'  },
  { id: 'trending'   as Style, label: 'Trending'   },
];

export function initials(name: string) { return name.slice(0, 2).toUpperCase(); }
export function fmtEta(secs: number)   { return secs >= 60 ? `~${Math.ceil(secs / 60)}m` : `~${secs}s`; }

export function jobGenerator(job: ConvexJob): Generator {
  return (job.campaign?.replace('gen:', '') ?? 'flux') as Generator;
}

export function generatorMeta(g: Generator) {
  return GENERATORS.find(x => x.id === g) ?? GENERATORS[0];
}
