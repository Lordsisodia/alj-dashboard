export interface FormatStat {
  format:   string;
  count:    number;
  avgER:    number;
  avgViews: number;
}

export interface NicheStat {
  niche:    string;
  count:    number;
  avgER:    number;
  avgViews: number;
  avgSaves: number;
}

export interface HookRow {
  _id:            string;
  hook:           string;
  handle:         string;
  niche:          string;
  contentType:    string;
  engagementRate: number;
  likes:          number;
  views:          number;
  saves:          number;
}

export interface OutlierPost {
  _id:            string;
  handle:         string;
  niche:          string;
  contentType:    string;
  hook:           string;
  thumbnailUrl:   string;
  likes:          number;
  views:          number;
  saves:          number;
  engagementRate: number;
  outlierRatio:   number;
  postedAt:       number;
}

export interface PatternCluster {
  theme:      string;
  postCount:  number;
  handles:    string[];
  avgER:      number;
  baselineER: number;
  multiplier: number;
  posts:      HookRow[];
}

export interface TrendsData {
  totalPosts:   number;
  avgER:        number;
  formatStats:  FormatStat[];
  nicheStats:   NicheStat[];
  topHooks:     HookRow[];
  outlierPosts: OutlierPost[];
}
