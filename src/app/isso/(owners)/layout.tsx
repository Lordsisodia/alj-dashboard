import { IssoSidebarShell } from '@/isso/layout/isso-sidebar';
import { OWNERS_NAV_CONFIG, OWNERS_PERSISTENT_NAV } from './sidebar-config';

export default function OwnersLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-black p-5 gap-5">
      <IssoSidebarShell
        config={{
          appName: 'Owners',
          navConfig: OWNERS_NAV_CONFIG,
          persistentNav: OWNERS_PERSISTENT_NAV,
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
