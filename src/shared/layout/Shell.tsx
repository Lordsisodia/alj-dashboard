'use client';

import React from 'react';

interface ShellProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export function Shell({ children, sidebar }: ShellProps) {
  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {sidebar && (
        <aside className="flex-shrink-0">
          {sidebar}
        </aside>
      )}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
