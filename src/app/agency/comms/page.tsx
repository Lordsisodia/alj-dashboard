import type { Metadata } from "next";
import { AgencyCommsPage } from '@/features/agency/comms/components';
export const metadata: Metadata = { title: "Comms | Agency | ORACLE" };
export default function AgencyCommsPageRoute() {
  return <AgencyCommsPage />;
}
