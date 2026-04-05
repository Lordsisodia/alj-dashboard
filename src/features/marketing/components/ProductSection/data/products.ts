// Tab configs and image maps for each product card in ProductSection.

export const LENS_TABS = [
  { id: 'creative-test', label: 'Agent Activity', icon: 'brain' },
  { id: 'build-reports', label: 'Performance Reports', icon: 'chart' },
  { id: 'compare-themes', label: 'Insights & Requests', icon: 'compare' },
] as const;

export const BRIEFS_TABS = [
  { id: 'storyboard', label: 'AI Script & Storyboard', icon: 'edit' },
  { id: 'brand-profiles', label: 'Model Profiles', icon: 'building' },
  { id: 'modular-brief', label: 'Batch Generation', icon: 'grid' },
] as const;

export const SWIPE_FILE_TABS = [
  { id: 'save-organize', label: 'Browse Reels', icon: 'folder' },
  { id: 'automate-transcription', label: 'Approve Content', icon: 'auto' },
  { id: 'share-collaborate', label: 'Track Performance', icon: 'share' },
] as const;

export const SPYDER_TABS = [
  { id: 'ad-scraper', label: '24/7 Scraping', icon: 'scraper' },
  { id: 'analyze-tests', label: 'Competitor Breakdowns', icon: 'personChart' },
  { id: 'top-hooks', label: 'Top Hooks & Trends', icon: 'eye' },
] as const;

export const DISCOVERY_TABS = [
  { id: 'smart-search', label: 'Trend Search', icon: 'searchRound' },
  { id: 'ai-analysis', label: 'AI Reel Analysis', icon: 'target' },
  { id: 'advanced-filters', label: 'Niche Filters', icon: 'cube' },
] as const;

const CDN = 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4';

export const LENS_IMAGES: Record<string, string> = {
  'creative-test': `${CDN}/6818f4abf647a12cb791df19_build-and-share-reports.webp`,
  'build-reports': `${CDN}/6818f4ab1be4acb01b76b457_creative-test-analysis.webp`,
  'compare-themes': `${CDN}/6818f4abb4e886135485759a_compare-segments.webp`,
};

export const BRIEFS_IMAGES: Record<string, string> = {
  'storyboard': `${CDN}/6818f77a3cb4900456b65643_brand-profiles.webp`,
  'brand-profiles': `${CDN}/68191db8d6fd3e791a16b485_briefs-storyboard-2.webp`,
  'modular-brief': `${CDN}/681b51296ef70672be45e334_brief-editor.webp`,
};

export const SWIPE_FILE_IMAGES: Record<string, string> = {
  'save-organize': `${CDN}/682e079a4aaf06e2b30921cd_swipe-file-slide-1.webp`,
  'automate-transcription': `${CDN}/68192291514c5eb42a2b307d_spyder-transcription-new.webp`,
  'share-collaborate': `${CDN}/6810ff44263ea947f36b6c18_Swipefile-3.webp`,
};

export const SPYDER_IMAGES: Record<string, string> = {
  'ad-scraper': `${CDN}/6810ff44da8facf8efaa1529_Spyder-1.webp`,
  'analyze-tests': `${CDN}/6810ff441a17fded3a5d9e33_Spyder-2.webp`,
  'top-hooks': `${CDN}/6810ff493741dd270180d33a_Spyder-3.webp`,
};

export const DISCOVERY_IMAGES: Record<string, string> = {
  'smart-search': `${CDN}/6810ff44c9b7dbd2a13d4157_Discoverty-1.webp`,
  'ai-analysis': `${CDN}/681922ba61ce305541bf6b10_discovery-ai-new.webp`,
  'advanced-filters': `${CDN}/6810ff444d53cd2c23b1643a_Discovery-3.webp`,
};
