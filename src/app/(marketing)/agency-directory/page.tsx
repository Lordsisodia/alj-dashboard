import AgencyDirectory from '@/features/marketing/components/AgencyDirectory';
import { agencyDirectoryData } from '@/features/marketing/components/AgencyDirectory/data/agencies';

export default function AgencyDirectoryPage() {
  return <AgencyDirectory data={agencyDirectoryData} />;
}
