export interface PartnerNavDropdownItem {
  id: string
  label: string
  path: string
  description?: string
}

export interface PartnerNavSubsection {
  id: string
  label: string
  path: string
  tierRequired?: string
  description?: string
  group?: string
  hidden?: boolean
  dropdown?: {
    id: string
    label: string
    items: PartnerNavDropdownItem[]
  }
}

export interface PartnerNavTopLevelIcon {
  id: string
  label: string
  icon: string
  order: number
  subsections: PartnerNavSubsection[]
}

export interface PartnerNavConfig {
  version: string
  lastUpdated: string
  description?: string
  icons: PartnerNavTopLevelIcon[]
}
