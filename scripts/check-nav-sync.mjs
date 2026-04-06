import { promises as fs } from "node:fs"
import path from "node:path"

const raw = JSON.parse(await fs.readFile("public/data/partner-nav-config.json", "utf8"))
const adapterModulePath = path.join(process.cwd(), "src/domains/partnerships/_shared/navigation/adapter.ts")
const adapterSource = await fs.readFile(adapterModulePath, "utf8")

if (!adapterSource) {
  console.error("Cannot load adapter source")
  process.exit(1)
}

const adapterIcons = raw.icons.map((icon) => icon.id)
const rawIcons = raw.icons.map((icon) => icon.id)

const missingInAdapter = rawIcons.filter((id) => !adapterIcons.includes(id))
const missingInConfig = adapterIcons.filter((id) => !rawIcons.includes(id))

if (missingInAdapter.length || missingInConfig.length) {
  console.error("Nav adapter/config mismatch:")
  if (missingInAdapter.length) {
    console.error("Missing in adapter:", missingInAdapter.join(", "))
  }
  if (missingInConfig.length) {
    console.error("Missing in config:", missingInConfig.join(", "))
  }
  process.exit(1)
}

console.log("Navigation adapter matches config")
