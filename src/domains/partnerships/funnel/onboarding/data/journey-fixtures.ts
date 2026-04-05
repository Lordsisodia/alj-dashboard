import { createJourney, type OnboardingStage } from "../domain/journey";

const stageData: OnboardingStage[] = [
  {
    id: "identity",
    title: "Identity & Contact",
    helper: "Lock in how we reach you",
    info: [
      "WhatsApp is our fast lane for deal support",
      "Preferred name personalizes coaching touchpoints",
      "Country helps us route leads in the right timezone"
    ],
    cta: "Lock in my contact info",
    icon: "message-circle"
  },
  {
    id: "snapshot",
    title: "Work Snapshot",
    helper: "Tell us how you prospect",
    info: [
      "You bring the clients, HQ closes the deals",
      "Your background shapes future training nudges",
      "Referral source lets us credit the right partner"
    ],
    cta: "Save my background",
    icon: "users"
  },
  {
    id: "revenue",
    title: "Revenue Goal",
    helper: "Model your first $10K month",
    info: [
      "Set a stretch goal up to $10K monthly",
      "Average project value slider keeps pricing real",
      "We’ll auto-calc how many clients you need"
    ],
    cta: "Calculate my path",
    icon: "line-chart"
  },
  {
    id: "vsl",
    title: "VSL & Recap",
    helper: "Watch the partner desk primer",
    info: [
      "Short video covers expectations + perks",
      "Recap card keeps your plan visible",
      "Finish here to unlock the dashboard"
    ],
    cta: "Finish onboarding",
    icon: "play-circle"
  }
];

export const defaultJourney = createJourney(stageData);
