import { IssoSidebarShell } from '@/isso/layout/isso-sidebar';

export default function IssoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-black p-5 gap-5">
      <IssoSidebarShell />
      <main
        className="flex-1 flex flex-col overflow-hidden rounded-2xl my-0"
        style={{ backgroundColor: '#ffffff' }}
      >
        {children}
      </main>
    </div>
  );
}
