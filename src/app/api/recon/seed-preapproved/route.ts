import { NextResponse } from 'next/server';

// The 8 pre-approved OFM accounts
export const PRE_APPROVED = [
  { handle: '@minaxash',              displayName: 'Mina Ash',            niche: 'GFE'       },
  { handle: '@tinaxkitsune',          displayName: 'Tina Kitsune',        niche: 'GFE'       },
  { handle: '@a55tr1d',               displayName: 'Astrid',              niche: 'Lifestyle' },
  { handle: '@amammyw',               displayName: 'Sasithon Miyawong',   niche: 'Lifestyle' },
  { handle: '@nerd_nattiyaseehanamm', displayName: 'Ñërd',               niche: 'Lifestyle' },
  { handle: '@tongohmm',              displayName: 'Tongohmm Klaatawan',  niche: 'Lifestyle' },
  { handle: '@kittygoofygirl',        displayName: 'kittygoofygirl',      niche: 'GFE'       },
  { handle: '@tootinytrina',          displayName: 'tootinytrina',        niche: 'GFE'       },
];

// This route just returns the list - seeding is done client-side via Convex mutation
export async function GET() {
  return NextResponse.json(PRE_APPROVED);
}
