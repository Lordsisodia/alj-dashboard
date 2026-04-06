export type SwipeDecision = 'like' | 'pass' | 'sent';

export interface SwipeReel {
  id: string;
  gradient: string;
  isVideo: boolean;
  creator: {
    handle: string;
    initials: string;
    color: string;
  };
  views: number;
  caption: string;
  type: string;
}

export type TagOption = string;

export interface TagCategory {
  id: string;
  label: string;
  options: TagOption[];
}

export type TagSelection = Partial<Record<string, string[]>>;

export interface RatingRecord {
  id: string;
  reel: SwipeReel;
  decision: SwipeDecision;
  tags: TagSelection;
  sentToModel?: string;
  note?: string;
  timestamp: Date;
  rater: string;
}

export interface SwipeSession {
  rated: number;
  passed: number;
  sent: number;
  startedAt: Date;
  log: RatingRecord[];
}
