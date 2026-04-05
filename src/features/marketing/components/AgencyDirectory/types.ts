// TypeScript interfaces for the AgencyDirectory page.

export interface DirectoryHero {
  subtitle: string;
  headline: string;
  paragraph: string;
}

export interface FilterOption {
  value: string;
  label: string;
  flagSrc?: string;
}

export interface FilterGroup {
  title: string;
  field: string;
  options: FilterOption[];
}

export interface AgencyCard {
  id: string;
  slug: string;
  name: string;
  logoSrc: string;
  logoAlt: string;
  country: string;
  countryFlagSrc: string;
  isVerified: boolean;
  services: string[];
  industries: string[];
}

export interface AgencyDirectoryData {
  hero: DirectoryHero;
  filterGroups: FilterGroup[];
  agencies: AgencyCard[];
}
