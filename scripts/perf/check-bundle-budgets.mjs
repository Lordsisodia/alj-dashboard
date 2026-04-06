import fs from 'node:fs';
import path from 'node:path';

function readStats() {
  const jsonPath = path.join('.next', 'static', 'analyze', 'client.json');
  if (fs.existsSync(jsonPath)) {
    return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  }

  const htmlPath = path.join('.next', 'analyze', 'client.html');
  if (fs.existsSync(htmlPath)) {
    const html = fs.readFileSync(htmlPath, 'utf8');
    const match = html.match(/window\.chartData\s*=\s*(\[[^;]+\])/);
    if (match) {
      return { chunks: JSON.parse(match[1]) };
    }
  }

  console.error('[bundle-budget] Missing .next/analyze client stats. Run with ANALYZE=true first.');
  process.exit(1);
}

const stats = readStats();
const hardBudget = 120 * 1024; // 120 KB parsed (fail)
const stretchBudget = 80 * 1024; // 80 KB parsed (warn only)

const oversized = [];
const warnings = [];
for (const chunk of stats.chunks || []) {
  if (!chunk.names) continue;
  const route = chunk.names.find((name) => name.startsWith('app/partners'));
  if (!route) continue;
  const size = chunk.stats?.parsedSize ?? chunk.parsedSize ?? chunk.size;
  if (size > hardBudget) {
    oversized.push({ route, size });
  } else if (size > stretchBudget) {
    warnings.push({ route, size });
  }
}

if (warnings.length) {
  console.warn('[bundle-budget] routes over 80 KB parsed (stretch goal):');
  warnings.forEach(({ route, size }) =>
    console.warn(`  • ${route}: ${(size / 1024).toFixed(1)} KB`));
}

if (oversized.length) {
  console.error('[bundle-budget] routes exceeded 120 KB parsed:');
  oversized.forEach(({ route, size }) =>
    console.error(`  • ${route}: ${(size / 1024).toFixed(1)} KB`) );
  process.exit(1);
}

// JSON payload guard: fail if any public data feed exceeds 200 KB.
const jsonBudget = 200 * 1024; // 200 KB
const dataDir = path.join('public', 'data');
let jsonViolations = [];
if (fs.existsSync(dataDir)) {
  const stack = [dataDir];
  while (stack.length) {
    const dir = stack.pop();
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        const size = fs.statSync(fullPath).size;
        if (size > jsonBudget) {
          jsonViolations.push({ file: fullPath, size });
        }
      }
    }
  }
}

if (jsonViolations.length) {
  console.error('[bundle-budget] JSON feeds exceed 200 KB:');
  jsonViolations.forEach(({ file, size }) =>
    console.error(`  • ${file}: ${(size / 1024).toFixed(1)} KB`) );
  process.exit(1);
}

console.log('[bundle-budget] all partner routes and JSON feeds within budget');
