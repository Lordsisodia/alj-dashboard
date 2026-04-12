import type { Metadata } from "next";
import { AgencyStaffPage } from "@/features/agency/staff/AgencyStaffPage";

export const metadata: Metadata = { title: "Staff | Agency | ORACLE" };

export default function AgencyStaffPageRoute() {
  return <AgencyStaffPage />;
}
