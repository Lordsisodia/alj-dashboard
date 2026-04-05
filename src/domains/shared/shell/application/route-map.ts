import type { MobileTabId } from "../types/navigation";

type PathPrefix = string;

const PATH_TAB_MAP: Array<{ prefix: PathPrefix; tab: MobileTabId }> = [
  { prefix: "/partners/academy", tab: "learning" },
  { prefix: "/partners/community/messages", tab: "messages" },
  { prefix: "/partners/community", tab: "messages" },
  { prefix: "/partners/notifications", tab: "notifications" },
  { prefix: "/partners/settings", tab: "quick-actions" },
  { prefix: "/partners", tab: "campus" }, // fallback for all partners routes
];

const PATH_SECTION_MAP: Array<{ prefix: PathPrefix; section: string }> = [
  { prefix: "/partners/community", section: "community" },
  { prefix: "/partners/notifications", section: "notifications" },
  { prefix: "/partners/settings", section: "settings" },
  { prefix: "/partners/recruitment", section: "recruitment" },
  { prefix: "/partners/pipeline", section: "pipeline" },
  { prefix: "/partners/pipeline-ops", section: "pipeline" },
  { prefix: "/partners/tools", section: "pipeline" },
  { prefix: "/partners/workspace", section: "workspace" },
  { prefix: "/partners/academy", section: "learning" },
  { prefix: "/partners", section: "home" },
];

const normalize = (value: string) => {
  if (!value) return "/";
  return value.toLowerCase().split("?")[0];
};

export function getTabForPath(pathname: string): MobileTabId {
  const normalized = normalize(pathname);
  const match = PATH_TAB_MAP.find(({ prefix }) => normalized.startsWith(prefix));
  return match?.tab ?? "campus";
}

export function getDrawerSectionForPath(pathname: string): string {
  const normalized = normalize(pathname);
  const match = PATH_SECTION_MAP.find(({ prefix }) => normalized.startsWith(prefix));
  return match?.section ?? "home";
}

export const routeMap = {
  pathToTab: getTabForPath,
  pathToSection: getDrawerSectionForPath,
  entries: PATH_TAB_MAP,
} as const;
