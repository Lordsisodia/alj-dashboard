export const PITCH_KIT_ROUTES = {
  hub: "/partners/academy/pitch-kit",
  deck: (slug: string) => `/partners/academy/pitch-kit/decks/${slug}`,
} as const;

