export type Spotlight = {
  title: string;
  lessonPath: string;
  assetPlaybook?: string;
  summary: string;
  whyNow: string;
  outcomes: string[];
  rationale: string[];
  durationMinutes: number;
  difficulty: string;
  progress: number;
  prerequisites: string[];
  proofAssets: { label: string; href: string }[];
};

export const spotlight: Spotlight = {
  title: "SISO Induction",
  lessonPath: "/partners/academy/courses/induction",
  assetPlaybook: "/partners/academy/portfolio/discovery-playbook",
  summary:
    "Shortcuts the first five discovery questions with direct scripts and research prompts that reflect current partner priorities.",
  whyNow:
    "High demand for consultative sales; trending deals are stuck in discovery, so this lesson shows how to level up the first call.",
  outcomes: [
    "Ask five discovery questions that uncover the real decision criteria",
    "Capture the story-based impact format so you can share it with your account team",
    "Close your next discovery call with a clear follow-up plan",
  ],
  rationale: [
    "Recent deals stalled in discovery for >10 days",
    "Matches your role (AE) and tier (Active)",
    "Highest lift on win-rate in last 30 days for peers",
  ],
  durationMinutes: 18,
  difficulty: "Intermediate",
  progress: 42,
  prerequisites: ["Complete Enterprise Sales 101 Course", "Watch the Prospect Intelligence checklist"],
  proofAssets: [
    { label: "Customer story: Discovery playbook", href: "/partners/academy/portfolio/discovery-playbook" },
    { label: "Pitch Kit deck: Discovery Sprint", href: "/partners/academy/pitch-kit/decks/discovery-sprint" },
  ],
};

