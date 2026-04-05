import { describe, expect, it } from "vitest"
import { getPartnerNavConfig, getTopLevelIcons } from "./adapter"
import { getSidebarContent } from "@/domains/partnerships/_shared/ui/mobile/campus-sidebar/config/sidebarContent"

describe("navigation rendering parity", () => {
  const config = getPartnerNavConfig()
  const icons = getTopLevelIcons()

  it("has sidebar content for each top-level icon", () => {
    icons.forEach((icon) => {
      const content = getSidebarContent(icon.id)
      expect(content, `missing sidebar content for ${icon.id}`).toBeTruthy()
    })
  })

  it("contains all subsections defined in the nav config", () => {
    icons.forEach((icon) => {
      const desiredIds = icon.subsections.map((s) => s.id || s.label)
      const content = getSidebarContent(icon.id)
      if (!content) {
        throw new Error(`no sidebar content for ${icon.id}`)
      }
      const actualIds: string[] = []
      content.sections.forEach((section) => {
        section.items?.forEach((item) => {
          if (item.id) actualIds.push(item.id)
          else actualIds.push(item.label)
        })
      })
      desiredIds.forEach((id) => {
        expect(actualIds).toContain(id)
      })
    })
  })
})
