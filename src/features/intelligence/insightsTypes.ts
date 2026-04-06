export interface InsightsSummary {
  totalRatings: number;
  upCount:      number;
  downCount:    number;
  saveCount:    number;
}

export interface NichePreference {
  niche:    string;
  upRate:   number;  // 0-1
  saveRate: number;  // 0-1
  total:    number;
}

export interface FormatPreference {
  format:   string;
  upRate:   number;
  saveRate: number;
  total:    number;
}

export interface RaterStat {
  ratedBy:   string;
  total:     number;
  upCount:   number;
  saveCount: number;
}

export interface RatedPost {
  _id:            string;
  handle:         string;
  niche:          string;
  contentType:    string;
  thumbnailUrl:   string;
  caption?:       string;
  engagementRate: number;
  upCount:        number;
  saveCount:      number;
  downCount:      number;
}

export interface InsightsData {
  summary:           InsightsSummary;
  nichePreferences:  NichePreference[];
  formatPreferences: FormatPreference[];
  topRatedPosts:     RatedPost[];
  raterActivity:     RaterStat[];
}
