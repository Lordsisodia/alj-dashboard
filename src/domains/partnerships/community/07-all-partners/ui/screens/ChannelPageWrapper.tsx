import { AllPartnersScreen } from "./AllPartnersScreen";
import { partnerDirectory } from "@/domains/partnerships/community/shared/data/partnerDirectory";

export function AllPartnersChannelPage() {
  return <AllPartnersScreen partners={partnerDirectory} withShell />;
}
