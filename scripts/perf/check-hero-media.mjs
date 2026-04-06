#!/usr/bin/env node
import { globby } from 'globby';
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), 'src/app/partners');
const TARGET_EXT = ['.tsx', '.jsx'];

const files = await globby(['**/*.tsx', '**/*.jsx'], { cwd: ROOT, absolute: true });

let errors = [];
for (const file of files) {
  const content = await fs.readFile(file, 'utf8');
  const highCount = (content.match(/fetchpriority\s*=\s*"high"/g) || []).length;
  if (highCount > 1) {
    errors.push(`Multiple fetchpriority="high" in ${path.relative(process.cwd(), file)} (${highCount})`);
  }
}

if (errors.length) {
  console.error('\nHero media rule failed:');
  for (const err of errors) console.error(' -', err);
  process.exit(1);
}

console.log(`Hero media rule passed for ${files.length} partner app files.`);
