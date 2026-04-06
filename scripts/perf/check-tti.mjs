#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Prefer prod trace metrics; fall back to Lighthouse JSON dir
const baselineDir = process.env.BASELINE_DIR || 'docs/partners/perf/baselines/2025-11-25-prod';
const metricsPath = process.env.TTI_METRICS_PATH || path.join(baselineDir, 'trace-metrics.json');
const lighthouseDir = process.env.LIGHTHOUSE_DIR || 'lighthouse';
const budget = {
  fcp: Number(process.env.TTI_MAX_FCP_MS || 1500), // ms
  tti: Number(process.env.TTI_MAX_LOAD_MS || 2000), // ms (use loadEventEnd proxy when using traces; interactive when using Lighthouse)
};

function checkTraceMetrics() {
  if (!fs.existsSync(metricsPath)) return null;
  const data = JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
  const failures = [];
  for (const [slug, entry] of Object.entries(data.metrics || {})) {
    const fcp = entry.firstContentfulPaint;
    const load = entry.loadEventEnd;
    if (typeof fcp === 'number' && fcp > budget.fcp) failures.push(`${slug}: FCP ${fcp.toFixed(0)}ms > ${budget.fcp}ms`);
    if (typeof load === 'number' && load > budget.tti) failures.push(`${slug}: load ${load.toFixed(0)}ms > ${budget.tti}ms`);
  }
  return { source: metricsPath, failures };
}

function readLighthouseReports(dir) {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
  if (!files.length) return null;
  const failures = [];
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    const audits = data.audits || {};
    const fcp = audits['first-contentful-paint']?.numericValue;
    const tti = audits.interactive?.numericValue;
    const url = data.finalUrl || file;
    if (typeof fcp === 'number' && fcp > budget.fcp) failures.push(`${url}: FCP ${(fcp/1000).toFixed(2)}s > ${(budget.fcp/1000).toFixed(2)}s`);
    if (typeof tti === 'number' && tti > budget.tti) failures.push(`${url}: TTI ${(tti/1000).toFixed(2)}s > ${(budget.tti/1000).toFixed(2)}s`);
  }
  return { source: dir, failures };
}

function main() {
  const traceResult = checkTraceMetrics();
  const lhResult = readLighthouseReports(lighthouseDir);

  const failures = [traceResult, lhResult]
    .filter(Boolean)
    .flatMap((r) => r.failures.map((f) => `${r.source}: ${f}`));

  if (failures.length) {
    console.error('[perf:tti] FAIL');
    failures.forEach((f) => console.error(' -', f));
    process.exit(1);
  }

  if (!traceResult && !lhResult) {
    console.warn('[perf:tti] No metrics found (trace-metrics.json or lighthouse/*.json).');
    process.exit(1);
  }

  console.log('[perf:tti] PASS');
}

main();
