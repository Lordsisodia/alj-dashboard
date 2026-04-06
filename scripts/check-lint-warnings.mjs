#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const result = spawnSync("pnpm", ["lint"], { encoding: "utf-8" });
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
const hasErrors = /\d+ errors/.test(result.stdout ?? "");
const warningsMatch = result.stdout?.match(/(\d+ warnings?)/);
const warningSummary = warningsMatch ? warningsMatch[1] : "0 warnings";
if (hasErrors) {
  console.error("Lint errors detected; aborting warning summary.");
  process.exit(1);
}
console.log(`Lint warnings: ${warningSummary}`);
console.log("Work with the feature owners to resolve the warnings when time permits.");
