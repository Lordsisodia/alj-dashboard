#!/usr/bin/env node
/**
 * Full-app page performance benchmark
 * Covers: isso/*, partners (home), marketing home
 * Outputs: console table + JSON report
 *
 * Usage:
 *   node scripts/perf/benchmark-all-pages.mjs
 *
 * Requires dev server running on PORT (default 3000).
 */

import puppeteer from 'puppeteer';
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE_URL = process.env.BENCHMARK_URL || 'http://localhost:3000';
const OUT_DIR = path.resolve('docs/perf/benchmarks');
const RUNS = Number(process.env.BENCH_RUNS || 2);          // runs per page (averaged)
const TIMEOUT = Number(process.env.BENCH_TIMEOUT || 30000); // ms per page load
const THROTTLE = process.env.BENCH_THROTTLE !== 'false';    // true = simulate mid-range device

const PAGES = [
  // Marketing home (fast baseline reference)
  { label: 'Marketing Home',    path: '/',                  group: 'marketing' },
  { label: 'Pricing',           path: '/pricing',           group: 'marketing' },

  // ISSO dashboard — all pages
  { label: 'ISSO Hub',          path: '/isso',              group: 'isso' },
  { label: 'ISSO Agents',       path: '/isso/agents',       group: 'isso' },
  { label: 'ISSO Analytics',    path: '/isso/analytics',    group: 'isso' },
  { label: 'ISSO Approvals',    path: '/isso/approvals',    group: 'isso' },
  { label: 'ISSO Community',    path: '/isso/community',    group: 'isso' },
  { label: 'ISSO Content',      path: '/isso/content',      group: 'isso' },
  { label: 'ISSO Ideas',        path: '/isso/ideas',        group: 'isso' },
  { label: 'ISSO Intelligence', path: '/isso/intelligence', group: 'isso' },
  { label: 'ISSO Models',       path: '/isso/models',       group: 'isso' },
  { label: 'ISSO Recon',        path: '/isso/recon',        group: 'isso' },
  { label: 'ISSO Schedule',     path: '/isso/schedule',     group: 'isso' },
  { label: 'ISSO Settings',     path: '/isso/settings',     group: 'isso' },
  { label: 'ISSO Team',         path: '/isso/team',         group: 'isso' },

  // Partners home (for comparison)
  { label: 'Partners Home',     path: '/partners',          group: 'partners' },
];

function rating(ms) {
  if (ms === null) return '—';
  if (ms < 800)  return '🟢 Fast';
  if (ms < 1500) return '🟡 OK';
  if (ms < 3000) return '🟠 Slow';
  return '🔴 Very Slow';
}

async function measurePage(browser, url, runs) {
  const results = [];
  for (let i = 0; i < runs; i++) {
    const page = await browser.newPage();

    if (THROTTLE) {
      // Simulate mid-range Android (4x CPU slowdown, 10 Mbps download)
      await page.emulate({
        viewport: { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
        userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36',
      });
      const client = await page.createCDPSession();
      await client.send('Network.emulateNetworkConditions', {
        offline: false,
        downloadThroughput: (10 * 1024 * 1024) / 8,
        uploadThroughput: (2 * 1024 * 1024) / 8,
        latency: 20,
      });
      await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    }

    let timedOut = false;
    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: TIMEOUT });
    } catch (err) {
      if (err.name === 'TimeoutError') {
        timedOut = true;
      } else {
        await page.close();
        throw err;
      }
    }

    const metrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      const paints = performance.getEntriesByType('paint');
      const paintMap = Object.fromEntries(paints.map(e => [e.name, Math.round(e.startTime)]));

      // LCP via PerformanceObserver — read last entry if available
      const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
      const lcp = lcpEntries.length ? Math.round(lcpEntries[lcpEntries.length - 1].startTime) : null;

      return {
        fcp: paintMap['first-contentful-paint'] ?? null,
        fp:  paintMap['first-paint'] ?? null,
        dcl: nav ? Math.round(nav.domContentLoadedEventEnd) : null,
        load: nav ? Math.round(nav.loadEventEnd) : null,
        lcp,
        url: location.href,
        timedOut: false,
      };
    }).catch(() => ({ fcp: null, fp: null, dcl: null, load: null, lcp: null, timedOut }));

    if (timedOut) metrics.timedOut = true;
    results.push(metrics);
    await page.close();
  }

  // Average across runs (ignoring nulls)
  const avg = (key) => {
    const vals = results.map(r => r[key]).filter(v => typeof v === 'number');
    return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
  };

  return {
    fcp:  avg('fcp'),
    fp:   avg('fp'),
    dcl:  avg('dcl'),
    load: avg('load'),
    lcp:  avg('lcp'),
    timedOut: results.some(r => r.timedOut),
    runs: results.length,
  };
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  console.log(`\n${'='.repeat(68)}`);
  console.log(`  ISSO Dashboard — Page Performance Benchmark`);
  console.log(`  Base URL : ${BASE_URL}`);
  console.log(`  Runs     : ${RUNS} per page`);
  console.log(`  Throttle : ${THROTTLE ? 'ON (4× CPU, 10 Mbps)' : 'OFF (native)'}`);
  console.log(`${'='.repeat(68)}\n`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const report = { capturedAt: new Date().toISOString(), baseUrl: BASE_URL, throttle: THROTTLE, runs: RUNS, pages: [] };
  const rows = [];

  try {
    for (const page of PAGES) {
      const url = `${BASE_URL}${page.path}`;
      process.stdout.write(`  Benchmarking ${page.label.padEnd(24)} `);
      try {
        const m = await measurePage(browser, url, RUNS);
        const row = { ...page, ...m };
        rows.push(row);
        report.pages.push(row);
        const fcpStr = m.fcp !== null ? `${m.fcp}ms` : 'N/A';
        const loadStr = m.load !== null ? `${m.load}ms` : 'N/A';
        const status = m.timedOut ? '⏱ TIMEOUT' : rating(m.fcp);
        console.log(`FCP=${fcpStr.padStart(7)}  Load=${loadStr.padStart(7)}  ${status}`);
      } catch (err) {
        console.log(`ERROR: ${err.message}`);
        rows.push({ ...page, error: err.message });
        report.pages.push({ ...page, error: err.message });
      }
    }
  } finally {
    await browser.close();
  }

  // ── Summary table ──────────────────────────────────────────────────────────
  console.log(`\n${'─'.repeat(68)}`);
  console.log('  RESULTS SUMMARY (averaged across runs)');
  console.log(`${'─'.repeat(68)}`);
  console.log(
    '  ' +
    'Page'.padEnd(28) +
    'FCP'.padStart(7) +
    'LCP'.padStart(7) +
    'DCL'.padStart(7) +
    'Load'.padStart(8) +
    '  Rating'
  );
  console.log('  ' + '─'.repeat(64));

  for (const g of ['marketing', 'isso', 'partners']) {
    const group = rows.filter(r => r.group === g);
    if (!group.length) continue;
    const groupLabel = g === 'isso' ? 'ISSO Dashboard' : g === 'marketing' ? 'Marketing' : 'Partners';
    console.log(`\n  ── ${groupLabel} ──`);
    for (const r of group) {
      const fcp  = r.fcp  != null ? `${r.fcp}ms`  : 'N/A';
      const lcp  = r.lcp  != null ? `${r.lcp}ms`  : 'N/A';
      const dcl  = r.dcl  != null ? `${r.dcl}ms`  : 'N/A';
      const load = r.load != null ? `${r.load}ms` : 'N/A';
      const star = r.timedOut ? '⏱' : rating(r.fcp).split(' ')[0];
      console.log(
        '  ' +
        r.label.padEnd(28) +
        fcp.padStart(7) +
        lcp.padStart(7) +
        dcl.padStart(7) +
        load.padStart(8) +
        `  ${star}`
      );
    }
  }

  // ── Issues flagged ─────────────────────────────────────────────────────────
  const issues = rows.filter(r => r.fcp != null && r.fcp >= 1500);
  if (issues.length) {
    console.log(`\n${'─'.repeat(68)}`);
    console.log('  PAGES NEEDING ATTENTION (FCP ≥ 1500ms)');
    console.log(`${'─'.repeat(68)}`);
    for (const r of issues.sort((a, b) => (b.fcp || 0) - (a.fcp || 0))) {
      console.log(`  🔴 ${r.label}: FCP ${r.fcp}ms, Load ${r.load ?? 'N/A'}ms`);
    }
  }

  // ── Write JSON ─────────────────────────────────────────────────────────────
  const slug = new Date().toISOString().slice(0, 16).replace('T', '_').replace(':', '-');
  const outFile = path.join(OUT_DIR, `benchmark-${slug}.json`);
  await fs.writeFile(outFile, JSON.stringify(report, null, 2));
  console.log(`\n  Report saved → ${outFile}\n`);
}

main().catch(err => {
  console.error('\nBenchmark failed:', err.message);
  process.exit(1);
});
