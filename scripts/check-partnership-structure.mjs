import { promises as fs } from "node:fs"
import { join } from "node:path"

const root = join(process.cwd(), "src/domains/partnerships")
const required = ["domain", "application", "infrastructure", "ui"]
const ignore = new Set(["portal-architecture", ".DS_Store", "README.md"])

const features = []
const missing = []
for (const entry of await fs.readdir(root)) {
  if (ignore.has(entry) || entry.startsWith(".")) continue
  const featurePath = join(root, entry)
  const stats = await fs.stat(featurePath)
  if (!stats.isDirectory()) continue
  features.push(entry)
  for (const folder of required) {
    const candidate = join(featurePath, folder)
    try {
      const stat = await fs.stat(candidate)
      if (!stat.isDirectory()) {
        missing.push(`${entry}/${folder}`)
      }
    } catch (error) {
      missing.push(`${entry}/${folder}`)
    }
  }
}

const totalSlots = features.length * required.length
const healthySlots = totalSlots - missing.length
const healthPercent = totalSlots === 0 ? 100 : (healthySlots / totalSlots) * 100

if (missing.length) {
  console.error("Missing Clean Architecture folders:\n" + missing.join("\n"))
  console.error(`\nCoverage: ${healthySlots}/${totalSlots} (${healthPercent.toFixed(2)}%)`)
  if (process.env.CHECK_MODE === "strict" || process.env.CI === "true") {
    process.exit(1)
  } else {
    process.exitCode = 1
  }
}

console.log(`Partnership structure check passed (${healthySlots}/${totalSlots} = ${healthPercent.toFixed(2)}%)`)
