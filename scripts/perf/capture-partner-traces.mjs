import fs from 'node:fs';
import { promises as fsp } from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const baseUrl = process.env.PARTNERS_BASE_URL || 'http://localhost:3003';
const baselineSlug = process.env.BASELINE_DIR || '2025-11-19';
const outputDir = path.resolve(`docs/partners/perf/baselines/${baselineSlug}`);
const partnersDir = path.resolve('src/app/partners');

const dynamicPathSamples = new Map([
  ['/partners/messages/[threadId]', '/partners/messages/sample-thread'],
  ['/partners/settings/[...slug]', '/partners/settings/general'],
  ['/partners/academy/courses/[courseId]/[lessonId]', '/partners/academy/courses/siso-introduction/intro-1'],
  ['/partners/academy/courses/[courseId]', '/partners/academy/courses/siso-essentials-program'],
  ['/partners/academy/industry/[slug]', '/partners/academy/industry/commerce'],
  ['/partners/academy/pitch-kit/[type]/[slug]', '/partners/academy/pitch-kit/decks/standard'],
  ['/partners/community/help/[collection]/[article]', '/partners/community/help/academy/academy-dashboard'],
  ['/partners/community/help/[collection]', '/partners/community/help/academy'],
  ['/partners/community/messages/[threadId]', '/partners/community/messages/general-thread'],
  ['/partners/community/profile/[profileId]', '/partners/community/profile/nova-carter'],
  ['/partners/earnings/challenges/[challengeId]', '/partners/earnings/challenges/momentum-sprint'],
  ['/partners/pipeline-ops/prospects/[id]', '/partners/pipeline-ops/prospects/prospect_brookstone'],
  ['/partners/recruitment/prospects/[id]', '/partners/recruitment/prospects/prospect-luca-ramirez'],
  ['/partners/recruitment/team/[id]', '/partners/recruitment/team/avery-diaz']
]);

const routeGroupPattern = /^\(.*\)$/;

async function collectRoutes(dir, segments = [], acc = new Set()) {
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const nextSegments = segments.concat(entry.name);
      await collectRoutes(path.join(dir, entry.name), nextSegments, acc);
    } else if (entry.isFile() && entry.name === 'page.tsx') {
      const filtered = segments.filter((seg) => !routeGroupPattern.test(seg));
      const routePath = '/partners' + (filtered.length ? `/${filtered.join('/')}` : '');
      acc.add(routePath);
    }
  }
  return acc;
}

function slugifyRoute(routePath) {
  const normalized = routePath.replace(/^\/+/, '') || 'root';
  return normalized
    .replace(/[^a-zA-Z0-9/]+/g, '-')
    .replace(/\//g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

async function discoverRoutes() {
  const collected = await collectRoutes(partnersDir);
  const uniqueRoutes = Array.from(collected).sort((a, b) => a.localeCompare(b));
  return uniqueRoutes.map((pattern, index) => {
    const actualPath = dynamicPathSamples.get(pattern) ?? pattern;
    const slugBase = slugifyRoute(actualPath);
    const slug = `${String(index + 1).padStart(3, '0')}-${slugBase || 'partners'}`;
    return {
      index: index + 1,
      pattern,
      path: actualPath,
      slug,
    };
  });
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  const routes = await discoverRoutes();
  console.log(`[trace] Capturing ${routes.length} partner routes from ${partnersDir}`);
  const limit = Number(process.env.ROUTE_LIMIT || process.env.ROUTE_COUNT || 0);
  const selected = limit > 0 ? routes.slice(0, limit) : routes;
  if (limit > 0) {
    console.log(`[trace] Route limit enabled (${limit}); capturing first ${selected.length} routes only.`);
  }
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const metrics = {};
  try {
    for (const route of selected) {
      const page = await browser.newPage();
      const tracePath = path.join(outputDir, `trace-${route.slug}.json`);
      console.log(`[trace] (${route.index}/${routes.length}) ${route.path} -> ${tracePath}`);
      await page.tracing.start({
        path: tracePath,
        screenshots: true,
        categories: [
          'devtools.timeline',
          'v8.execute',
          'blink.user_timing',
          'loading',
          'disabled-by-default-v8.cpu_profiler',
          'disabled-by-default-devtools.screenshot',
        ],
      });
      try {
        await page.goto(`${baseUrl}${route.path}`, {
          waitUntil: 'networkidle0',
          timeout: Number(process.env.ROUTE_TIMEOUT_MS || 45000),
        });
        await new Promise((resolve) => setTimeout(resolve, Number(process.env.POST_LOAD_DELAY_MS || 1000)));
      } catch (error) {
        console.error(`[trace] Failed to load ${route.path}: ${error.message}`);
      } finally {
        await page.tracing.stop();
      }
      try {
        const perf = await page.evaluate(() => {
          const nav = performance.getEntriesByType('navigation')[0];
          const paintEntries = performance.getEntriesByType('paint');
          const paintMap = Object.fromEntries(paintEntries.map((entry) => [entry.name, entry.startTime]));
          return {
            url: location.href,
            domContentLoaded: nav ? nav.domContentLoadedEventEnd : null,
            loadEventEnd: nav ? nav.loadEventEnd : null,
            firstPaint: paintMap['first-paint'] ?? null,
            firstContentfulPaint: paintMap['first-contentful-paint'] ?? null,
            timestamp: new Date().toISOString(),
          };
        });
        metrics[route.slug] = {
          ...perf,
          pattern: route.pattern,
          path: route.path,
          index: route.index,
        };
      } catch (metricError) {
        console.error(`[trace] Failed to read metrics for ${route.path}: ${metricError.message}`);
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }
  const metricsPath = path.join(outputDir, 'trace-metrics.json');
  fs.writeFileSync(
    metricsPath,
    JSON.stringify(
      {
        capturedAt: new Date().toISOString(),
        baseUrl,
        routes,
        metrics,
      },
      null,
      2,
    ),
  );
  console.log(`[trace] Saved metrics -> ${metricsPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
