#!/usr/bin/env node
import { promises as fsp } from 'node:fs';
import path from 'node:path';

const partnersDir = path.resolve('src/app/partners');
const outputPath = path.resolve('docs/partners/perf/route-metrics.tsv');
const routeGroupPattern = /^\(.*\)$/;

// Order matters: most specific → least specific
const clusterBudgets = [
  { cluster: 'Earnings & PayPal', prefixes: ['/partners/earnings', '/partners/wallet'], load: 2000, fcp: 1200 },
  { cluster: 'Pipeline & Recruitment', prefixes: ['/partners/pipeline-ops', '/partners/recruitment'], load: 1200, fcp: 1000 },
  { cluster: 'Community & Messaging', prefixes: ['/partners/community', '/partners/messages'], load: 3000, fcp: 2000 },
  { cluster: 'Academy & Learning', prefixes: ['/partners/academy', '/partners/learning'], load: 1500, fcp: 1200 },
  { cluster: 'Workspace & Tools', prefixes: ['/partners/workspace', '/partners/tools'], load: 1500, fcp: 1200 },
  { cluster: 'Legal/Privacy & Misc', prefixes: ['/partners/privacy-policy', '/partners/settings/legal'], load: 1000, fcp: 800 },
  { cluster: 'Shell & Mobile Core', prefixes: ['/partners', '/partners/campus', '/partners/checklist'], load: 2000, fcp: 1500 },
];

function classify(pathname) {
  for (const entry of clusterBudgets) {
    if (entry.prefixes.some((p) => pathname.startsWith(p))) {
      return entry;
    }
  }
  return { cluster: 'Unmapped', load: 2000, fcp: 1500 };
}

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

function toTSV(rows) {
  const header = ['path', 'cluster', 'load_budget_ms', 'fcp_budget_ms', 'js_budget_kb'];
  const lines = [header.join('\t')];
  for (const row of rows) {
    lines.push([row.path, row.cluster, row.load, row.fcp, row.jsBudget].join('\t'));
  }
  return lines.join('\n');
}

(async () => {
  const routes = Array.from(await collectRoutes(partnersDir)).sort((a, b) => a.localeCompare(b));
  const rows = routes.map((route) => {
    const { cluster, load, fcp } = classify(route);
    return { path: route, cluster, load, fcp, jsBudget: 120 };
  });
  await fsp.mkdir(path.dirname(outputPath), { recursive: true });
  await fsp.writeFile(outputPath, toTSV(rows));
  console.log(`[route-inventory] wrote ${rows.length} routes -> ${outputPath}`);
})();
