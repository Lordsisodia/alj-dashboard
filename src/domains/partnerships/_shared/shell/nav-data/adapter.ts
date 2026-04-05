import { partnerNavConfig } from "@/config/partner-nav-config"
import type { PartnerNavConfig, PartnerNavTopLevelIcon } from "./types"

export function getPartnerNavConfig(): PartnerNavConfig {
  return partnerNavConfig as unknown as PartnerNavConfig
}

export function getTopLevelIcons(): PartnerNavTopLevelIcon[] {
  return [...getPartnerNavConfig().icons].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}
