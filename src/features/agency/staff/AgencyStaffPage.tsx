'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, CalendarDays, AlertTriangle } from 'lucide-react';
import { ContentPageShell } from '@/shared/layout/ContentPageShell';
import { StaffProvider } from './context/StaffContext';
import { ShiftStatusBanner } from './components/ShiftStatusBanner';
import { ShiftControlPanel } from './components/ShiftControlPanel';
import { ShiftActivityFeed } from './components/ShiftActivityFeed';
import { AgencyCalendar } from './components/AgencyCalendar';
import { LateEscalationDisplay } from './components/LateEscalationDisplay';

type TabId = 'active-shifts' | 'calendar' | 'escalations';

const TABS = [
  { id: 'active-shifts' as TabId, label: 'Active Shifts', icon: <Users className="w-3.5 h-3.5" /> },
  { id: 'calendar' as TabId, label: 'Calendar', icon: <CalendarDays className="w-3.5 h-3.5" /> },
  { id: 'escalations' as TabId, label: 'Escalations', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
];

function ActiveShiftsTab() {
  return (
    <motion.div
      key="active-shifts"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="flex-1 overflow-auto p-6 space-y-4"
    >
      <ShiftStatusBanner />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ShiftControlPanel />
        <ShiftActivityFeed />
      </div>
    </motion.div>
  );
}

function CalendarTab() {
  return (
    <motion.div
      key="calendar"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="flex-1 overflow-auto p-6"
    >
      <AgencyCalendar />
    </motion.div>
  );
}

function EscalationsTab() {
  return (
    <motion.div
      key="escalations"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="flex-1 overflow-auto p-6"
    >
      <LateEscalationDisplay />
    </motion.div>
  );
}

export function AgencyStaffPage() {
  const [activeTab, setActiveTab] = useState<TabId>('active-shifts');

  return (
    <StaffProvider>
      <ContentPageShell
        title="Staff"
        icon={<Users className="w-4 h-4 text-neutral-500" />}
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as TabId)}
        accentGradient="linear-gradient(135deg, #ec4899, #8b5cf6)"
      >
        <AnimatePresence mode="wait">
          {activeTab === 'active-shifts' && <ActiveShiftsTab key="active-shifts" />}
          {activeTab === 'calendar' && <CalendarTab key="calendar" />}
          {activeTab === 'escalations' && <EscalationsTab key="escalations" />}
        </AnimatePresence>
      </ContentPageShell>
    </StaffProvider>
  );
}
