#!/usr/bin/env node
import { promises as fs } from "node:fs"
import path from "node:path"

const partnershipsRoot = path.join(process.cwd(), "src/domains/partnerships")
const allowedExt = new Set([".md"])
const offenders = []
const checkedArchives = []

async function directoryExists(dir) {
  try {
    const stats = await fs.stat(dir)
    return stats.isDirectory()
  } catch {
    return false
  }
}

async function walk(dir, feature) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      await walk(fullPath, feature)
    } else {
      const ext = path.extname(entry.name)
      if (!allowedExt.has(ext)) {
        offenders.push({ feature, file: fullPath })
      }
    }
  }
}

const featureDirs = await fs.readdir(partnershipsRoot, { withFileTypes: true })
for (const entry of featureDirs) {
  if (!entry.isDirectory() || entry.name.startsWith(".")) continue
  const archivePath = path.join(partnershipsRoot, entry.name, "docs", "portal-archive")
  if (!(await directoryExists(archivePath))) continue
  checkedArchives.push(path.relative(process.cwd(), archivePath))
  await walk(archivePath, entry.name)
}

if (!checkedArchives.length) {
  console.error("No docs/portal-archive folders found under src/domains/partnerships")
  process.exit(1)
}

if (offenders.length) {
  const formatted = offenders
    .map(({ feature, file }) => `- ${feature}: ${path.relative(process.cwd(), file)}`)
    .join("\n")
  console.error("Non-doc files detected inside portal archives:\n" + formatted)
  process.exit(1)
}

console.log(
  `Checked ${checkedArchives.length} portal archives ("${checkedArchives.join(", ")}") — md-only ✅`
)
