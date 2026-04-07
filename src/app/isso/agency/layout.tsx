import { IssoSidebarShell } from '@/shared/layout/isso-sidebar/IssoSidebarShell';
import { AGENCY_SIDEBAR_CONFIG } from '@/features/agency/sidebar-config';

export default function AgencyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-black p-5 gap-5">
      <IssoSidebarShell config={AGENCY_SIDEBAR_CONFIG} />
      <main
        className="flex-1 flex flex-col overflow-hidden rounded-2xl"
        style={{ backgroundColor: '#ffffff' }}
      >
        {children}
      </main>
    </div>
  );
}
