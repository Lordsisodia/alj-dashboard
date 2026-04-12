import { IssoSidebarShell } from '@/isso/layout/isso-sidebar';
import { CHATTER_NAV_CONFIG, CHATTER_PERSISTENT_NAV } from './sidebar-config';

export default function ChatterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-black p-5 gap-5">
      <IssoSidebarShell
        config={{
          appName: 'Chatter',
          navConfig: CHATTER_NAV_CONFIG,
          persistentNav: CHATTER_PERSISTENT_NAV,
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
