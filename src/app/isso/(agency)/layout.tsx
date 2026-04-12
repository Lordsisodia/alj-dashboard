import { IssoSidebarShell } from '@/isso/layout/isso-sidebar';
import { AGENCY_NAV_CONFIG, AGENCY_PERSISTENT_NAV, AGENCY_PLATFORMS_NAV } from './sidebar-config';

export default function AgencyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-black p-5 gap-5">
      <IssoSidebarShell
        config={{
          appName: 'Agency',
          navConfig: AGENCY_NAV_CONFIG,
          persistentNav: AGENCY_PERSISTENT_NAV,
          platformsNav: AGENCY_PLATFORMS_NAV,
        }}
      />
      <main
        className="flex-1 flex flex-col overflow-hidden rounded-2xl my-0"
        style={{ backgroundColor: '#ffffff' }}
      >
        {children}
      </main>
    </div>
  );
}
