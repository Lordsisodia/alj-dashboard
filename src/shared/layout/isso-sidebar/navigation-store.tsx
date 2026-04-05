'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type IssoSection = 'home' | 'hub' | 'briefs' | 'intelligence' | 'recon' | 'agents' | 'team';

interface IssoNavState {
  activeSection: IssoSection;
  setActiveSection: (section: IssoSection) => void;
}

const IssoNavContext = createContext<IssoNavState>({
  activeSection: 'home',
  setActiveSection: () => {},
});

export function IssoNavProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<IssoSection>('home');
  return (
    <IssoNavContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </IssoNavContext.Provider>
  );
}

export function useIssoNav() {
  return useContext(IssoNavContext);
}
