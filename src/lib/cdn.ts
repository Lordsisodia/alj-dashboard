/**
 * CDN base URL constants.
 * All remote image/video assets come from one of these two hosts.
 * Use these instead of hardcoding URLs so future CDN migrations
 * only need a one-line change here.
 */

/** Primary asset CDN (product screenshots, logos, page images). */
export const CDN = 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4';

/** Secondary asset CDN (agency directory flags, some blog imagery). */
export const CDN2 = 'https://cdn.prod.website-files.com/62a4f1b9ff17080082bbb71e';

/** Public video/animation assets (product demo videos). */
export const ASSETS = 'https://publicassets.foreplay.co';
