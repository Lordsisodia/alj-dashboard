#!/usr/bin/env node
if (process.env.ALLOW_NODE_ANY === '1') {
  process.exit(0);
}

const version = process.versions.node || '0.0.0';
const major = parseInt(version.split('.')[0], 10);
if (Number.isNaN(major) || major < 20 || major >= 21) {
  console.error(`\n❌ Unsupported Node version ${version}. Please use Node 20.x (>=20 <21) for this repo.\n`);
  process.exit(1);
}
