import type { Metadata } from "next";
import { AgencyStaffTasksPage } from "@/features/agency/staff-tasks/components/AgencyStaffTasksPage";

export const metadata: Metadata = { title: "Tasks | Agency Staff | ORACLE" };

export default function Page() {
  return <AgencyStaffTasksPage />;
}
