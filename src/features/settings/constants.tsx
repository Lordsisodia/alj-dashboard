'use client';

import { User, Link2, Puzzle, Sliders, CreditCard } from 'lucide-react';
import type { SettingsTab } from './types';

export const TABS: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: 'profile',       label: 'Profile',            icon: <User size={15} /> },
  { id: 'accounts',     label: 'Connected Accounts', icon: <Link2 size={15} /> },
  { id: 'integrations', label: 'Integrations',       icon: <Puzzle size={15} /> },
  { id: 'content',      label: 'Content Defaults',   icon: <Sliders size={15} /> },
  { id: 'billing',      label: 'Billing',            icon: <CreditCard size={15} /> },
];

export const TAB_TRANSITION = {
  initial:    { opacity: 0, x: 12 },
  animate:    { opacity: 1, x: 0 },
  exit:       { opacity: 0, x: -12 },
  transition: { duration: 0.2 },
};
