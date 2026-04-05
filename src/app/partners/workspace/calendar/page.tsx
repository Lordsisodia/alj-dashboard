import type { Metadata } from "next";
import { CalendarWorkspaceHydrator } from "./CalendarWorkspaceHydrator.client";

export const metadata: Metadata = {
  title: 'Calendar • SISO Partners',
  description:
    'Unified calendar for office hours, webinars, tasks, and deal deadlines. Color-coded by event type with tier-aware filters.',
};

export default function PartnersCalendarPage() {
  return (
    <CalendarWorkspaceHydrator />
  );
}
