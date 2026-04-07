// -- Animation variants ----------------------------------------------------------

export const containerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.05 } },
};

export const fadeUp = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const } },
};

// -- Re-export from creatorData ------------------------------------------------

export { computeProfileHealth, COMPETITORS, DAILY_VOLUME, LOG_ENTRIES, type LogStatus } from './creatorData';

// -- Pre-approved seed list ----------------------------------------------------

export const PRE_APPROVED = [
  { handle: '@minaxash',              displayName: 'Mina Ash',            niche: 'GFE'       },
  { handle: '@tinaxkitsune',          displayName: 'Tina Kitsune',        niche: 'GFE'       },
  { handle: '@a55tr1d',               displayName: 'Astrid',              niche: 'Lifestyle' },
  { handle: '@amammyw',               displayName: 'Sasithon Miyawong',   niche: 'Lifestyle' },
  { handle: '@nerd_nattiyaseehanamm', displayName: 'Ñërd',               niche: 'Lifestyle' },
  { handle: '@tongohmm',              displayName: 'Tongohmm Klaatawan',  niche: 'Lifestyle' },
  { handle: '@kittygoofygirl',        displayName: 'kittygoofygirl',     niche: 'GFE'       },
  { handle: '@tootinytrina',          displayName: 'tootinytrina',        niche: 'GFE'       },
];
