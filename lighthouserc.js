/** @type {import('@lhci/cli').LHCIConfig} */
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'pnpm start',
      startServerReadyPattern: 'Ready on|started server on',
      startServerReadyTimeout: 30000,
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/isso',
        'http://localhost:3000/isso/recon',
        'http://localhost:3000/isso/intelligence',
        'http://localhost:3000/isso/analytics',
        'http://localhost:3000/isso/models',
      ],
      numberOfRuns: 3,
      settings: {
        // Simulate mid-range mobile (matches our Puppeteer benchmark config)
        emulatedFormFactor: 'mobile',
        throttlingMethod: 'simulate',
        throttling: {
          cpuSlowdownMultiplier: 4,
          downloadThroughputKbps: 10240,
          uploadThroughputKbps: 2048,
          rttMs: 20,
        },
      },
    },
    assert: {
      assertions: {
        // Core Web Vitals — Yellow threshold = warn, Red threshold = error
        'first-contentful-paint':    ['warn',  { maxNumericValue: 1500 }],
        'largest-contentful-paint':  ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift':   ['error', { maxNumericValue: 0.1  }],
        'total-blocking-time':       ['warn',  { maxNumericValue: 300  }],
        'interactive':               ['warn',  { maxNumericValue: 3500 }],
        // Accessibility + best practices minimums
        'categories:accessibility':  ['warn',  { minScore: 0.85 }],
        'categories:best-practices': ['warn',  { minScore: 0.90 }],
      },
    },
    upload: {
      // Store reports locally — no external service required
      target: 'filesystem',
      outputDir: 'docs/perf/lhci',
      reportFilenamePattern: '%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%',
    },
  },
};
