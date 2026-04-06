#!/usr/bin/env node
import { promises as fs } from "node:fs"
import path from "node:path"
import process from "node:process"

const templateDir = path.join(process.cwd(), "docs/partners/bmad/templates/feature-skeleton")
const targetName = process.argv[2]
if (!targetName) {
  console.error("Usage: pnpm generate:partner-feature <name>")
  process.exit(1)
}
const targetDir = path.join(process.cwd(), "src/domains/partnerships", targetName)
await fs.mkdir(targetDir, { recursive: true })
const entries = await fs.readdir(templateDir)
for (const entry of entries) {
  const src = path.join(templateDir, entry)
  const dest = path.join(targetDir, entry)
  const stat = await fs.stat(src)
  if (stat.isDirectory()) {
    await copyDir(src, dest)
  } else {
    await fs.copyFile(src, dest)
  }
}
console.log(`Feature skeleton created at ${targetDir}`)

const featureIndexPath = path.join(process.cwd(), "docs/partners/architecture/feature-index.md")
try {
  const content = await fs.readFile(featureIndexPath, "utf8")
  if (!content.includes(`- ${targetName}`)) {
    const updated = content.trimEnd() + `\n- ${targetName}\n`
    await fs.writeFile(featureIndexPath, updated)
    console.log(`Registered ${targetName} in feature-index.md`)
  }
} catch (error) {
  console.warn("Could not update feature-index.md", error)
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true })
  const entries = await fs.readdir(src)
  for (const entry of entries) {
    const from = path.join(src, entry)
    const to = path.join(dest, entry)
    const stat = await fs.stat(from)
    if (stat.isDirectory()) {
      await copyDir(from, to)
    } else {
      await fs.copyFile(from, to)
    }
  }
}
