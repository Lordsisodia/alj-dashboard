import type { Id } from '@/convex/_generated/dataModel';

export type Niche = 'GFE' | 'Fitness' | 'Meme' | 'Thirst Trap' | 'Lifestyle';

/** Shape of a document from the `models` Convex table */
export interface ModelDoc {
  _id: Id<'models'>;
  name: string;
  niche: Niche;
  ofHandle?: string;
  igHandle?: string;
  avatarColor: string;
  active: boolean;
  bio?: string;
}

/** Local form state for the add/edit panel */
export interface PanelState {
  name: string;
  niche: Niche;
  ofHandle: string;
  igHandle: string;
  avatarColor: string;
  active: boolean;
  bio: string;
}
