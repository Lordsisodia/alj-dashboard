#!/usr/bin/env node
import { spawnSync } from "node:child_process"
import { appendFileSync, mkdirSync } from "node:fs"
import { dirname, join } from "node:path"

const checks = [
  { cmd: "pnpm", args: ["check:partners-structure"] },
  { cmd: "pnpm", args: ["lint"] },
  { cmd: "pnpm", args: ["check:nav-sync"] },
]

const results = []
let failure = false

for (const { cmd, args } of checks) {
  const result = spawnSync(cmd, args, { encoding: "utf-8" })
  if (result.stdout) process.stdout.write(result.stdout)
  if (result.stderr) process.stderr.write(result.stderr)
  const metric = extractMetric(cmd, args, result.stdout ?? "")
  results.push({ cmd, args, status: result.status, metric })
  if (result.status !== 0) {
    if (process.env.CHECK_MODE === "strict") {
      logResults(results)
      process.exit(result.status)
    }
    failure = true
  }
}

logResults(results)
process.exit(failure ? 1 : 0)

function extractMetric(cmd, args, output) {
  if (cmd === "pnpm" && args[0] === "check:partners-structure") {
    const match = output?.match(/check passed \(([^)]+)\)/i)
    if (match) return `structure=${match[1]}`
  }
  return null
}

function logResults(entries) {
  const timestamp = new Date().toISOString()
  const summary = entries
    .map(({ cmd, args, status, metric }) => {
      const base = `${cmd} ${args.join(" ")}`
      return `${base} -> ${status === 0 ? "ok" : "fail"}${metric ? ` (${metric})` : ""}`
    })
    .join("; ")
  const line = `[${timestamp}] CHECK_MODE=${process.env.CHECK_MODE ?? "warn"} ${summary}\n`
  const targets = ["/var/log/partners-structure.log", join(process.cwd(), "logs/partners-structure.log")]
  for (const target of targets) {
    try {
      mkdirSync(dirname(target), { recursive: true })
      appendFileSync(target, line, { encoding: "utf-8" })
      break
    } catch (error) {
      // fall through to next target
    }
  }
}
