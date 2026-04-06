import { ReactNode } from "react";
import { Sparkles, GraduationCap, Briefcase, Presentation, LayoutGrid } from "lucide-react";
import { ACADEMY_ROUTES } from "../constants/routes";

export type DashboardCard = {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
  stat?: string;
  widget?:
    | { type: "progress"; tier: string; percent: number; ptsToNext: number; nextTier: string }
    | { type: "courses"; available: number; inProgress: number; completed: number }
    | { type: "spotlight"; lesson: string; duration: string };
  ctaLabel?: string;
};

export const dashboardCards: DashboardCard[] = [
  {
    title: "My Progress",
    description: "Track tiers, XP, and certificates. See exactly how to level up.",
    href: ACADEMY_ROUTES.myProgress,
    icon: <Sparkles className="h-4 w-4" />,
    stat: "Builder • 71% to next tier",
    widget: {
      type: "progress",
      tier: "Builder",
      percent: 71,
      ptsToNext: 500,
      nextTier: "Vanguard",
    },
  },
  {
    title: "Courses",
    description: "Full catalog with filters; resume where you left off.",
    href: ACADEMY_ROUTES.courses,
    icon: <GraduationCap className="h-4 w-4" />,
    stat: "3 in progress • 12 available",
    widget: {
      type: "courses",
      available: 12,
      inProgress: 3,
      completed: 1,
    },
  },
  {
    title: "Portfolio",
    description: "Proofs and case studies to share with prospects.",
    href: ACADEMY_ROUTES.portfolio,
    icon: <Briefcase className="h-4 w-4" />,
    stat: "12 proofs live",
  },
  {
    title: "Training Spotlight",
    description: "This week's high-impact lesson picked for you.",
    href: ACADEMY_ROUTES.spotlight,
    icon: <Sparkles className="h-4 w-4" />,
    stat: "18 min to complete",
    widget: {
      type: "spotlight",
      lesson: "ORACLE Induction",
      duration: "18 min",
    },
  },
  {
    title: "Pitch Kit",
    description: "Industry-ready decks and scripts. Share or download instantly.",
    href: ACADEMY_ROUTES.pitchKit,
    icon: <Presentation className="h-4 w-4" />,
    stat: "4 kits live",
  },
];

export const dashboardHero = {
  title: "Academy dashboard",
  description: "Your learning, proofs, and pitches in one place.",
  icon: <LayoutGrid className="h-5 w-5 text-siso-orange" />,
};
