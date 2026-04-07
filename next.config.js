const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
  analyzerMode: "static",
  reportFilename: ({ isServer }) =>
    isServer ? "../analyze/server.html" : "analyze/client.html",
  statsFilename: ({ isServer }) =>
    isServer ? "../analyze/server.json" : "analyze/client.json",
});
const withPWA = process.env.NODE_ENV === "development"
  ? (config) => config
  : require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: false,
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: true,
  workboxOptions: {
    runtimeCaching: [
      {
        // API calls served network-first with fallback cache.
        urlPattern: /^https?:\/\/[^/]*siso[^/]*\/api\/.*$/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "api-cache",
          networkTimeoutSeconds: 5,
          expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
        },
      },
      {
        // Images get a fast SWR cache.
        urlPattern: ({ request }) => request.destination === "image",
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "image-cache",
          expiration: {
            maxEntries: 150,
            maxAgeSeconds: 60 * 60 * 24 * 14,
          },
        },
      },
    ],
  },
});

// end ternary (dev passthrough vs PWA)

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
  webpack(config, { dev }) {
    if (dev) {
      // Filesystem cache spills to disk instead of hoarding RAM.
      // buildDependencies busts the cache when next.config.js changes.
      config.cache = {
        type: 'filesystem',
        buildDependencies: { config: [__filename] },
        maxAge: 60 * 60 * 1000, // 1 hour
      };
    }
    return config;
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.cdninstagram.com' },
      { protocol: 'https', hostname: '**.fbcdn.net' },
      { protocol: 'https', hostname: 'instagram.com' },
      { protocol: 'https', hostname: '**.instagram.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'randomuser.me' },
      { protocol: 'https', hostname: '**.randomuser.me' },
      { protocol: 'https', hostname: 'cdn.prod.website-files.com' },
      { protocol: 'https', hostname: '**.website-files.com' },
      { protocol: 'https', hostname: 'img.clerk.com' },
    ],
  },
  async headers() {
    return [
      {
        // Serve .mov files as video/mp4 so Chrome plays them (H.264 codec inside QuickTime container)
        source: '/assets/:path*.mov',
        headers: [{ key: 'Content-Type', value: 'video/mp4' }],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.instagram.com https://*.clerk.accounts.dev https://clerk.accounts.dev https://*.clerk.com https://challenges.cloudflare.com",
              "frame-src 'self' https://www.instagram.com https://*.clerk.accounts.dev https://clerk.accounts.dev https://challenges.cloudflare.com",
              "img-src 'self' data: blob: https://*.cdninstagram.com https://*.fbcdn.net https://www.instagram.com https://images.unsplash.com https://randomuser.me https://*.randomuser.me https://cdn.prod.website-files.com https://*.website-files.com https://img.clerk.com https://*.clerk.com",
              "connect-src 'self' https://*.convex.cloud wss://*.convex.cloud https://www.instagram.com https://*.clerk.accounts.dev https://clerk.accounts.dev https://*.clerk.com wss://*.clerk.accounts.dev https://pub-6c398617211c499ea00c44c3d18564bc.r2.dev",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' data: https://fonts.gstatic.com https://fonts.googleapis.com https://cdn.prod.website-files.com https://*.website-files.com",
              "media-src 'self' blob: https://cdn.prod.website-files.com https://*.website-files.com https://publicassets.foreplay.co https://pub-6c398617211c499ea00c44c3d18564bc.r2.dev",
              "worker-src 'self' blob:",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(withPWA(nextConfig));
