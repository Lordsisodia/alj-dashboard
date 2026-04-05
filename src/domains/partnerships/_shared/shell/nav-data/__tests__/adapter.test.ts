import { describe, expect, it } from "vitest"
import { getPartnerNavConfig, getTopLevelIcons } from "./adapter"
import { partnerNavConfig } from "@/config/partner-nav-config"

describe("navigation adapter", () => {
  it("mirrors raw nav config", () => {
    const adapterConfig = getPartnerNavConfig()
    expect(adapterConfig.version).toEqual(partnerNavConfig.version)
    expect(adapterConfig.icons.length).toEqual(partnerNavConfig.icons.length)
  })

  it("returns icons in sorted order", () => {
    const expectedOrder = [...partnerNavConfig.icons]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((icon) => icon.id)

    const adapterIds = getTopLevelIcons().map((icon) => icon.id)
    expect(adapterIds).toEqual(expectedOrder)
  })
})
