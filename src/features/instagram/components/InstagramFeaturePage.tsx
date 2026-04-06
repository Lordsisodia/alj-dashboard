'use client';

import { useState } from 'react';
import { Instagram, Plus, GitBranch, Layers, Calendar, CheckSquare, BarChart2 } from 'lucide-react';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { AccountsTab }   from './tabs/AccountsTab';
import { ApprovalsTab }  from './tabs/ApprovalsTab';
import { QueueTab }      from './tabs/QueueTab';
import { ScheduleTab }   from './tabs/ScheduleTab';
import { AnalyticsTab }  from './tabs/AnalyticsTab';

type Tab = 'accounts' | 'approvals' | 'queue' | 'schedule' | 'analytics';

const CONNECTED_COUNT = 3;

export default function InstagramFeaturePage() {
  const [activeTab, setActiveTab] = useState<Tab>('accounts');

  return (
    <ContentPageShell
      icon={
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}
        >
          <Instagram size={15} className="text-white" />
        </div>
      }
      title="Instagram"
      stat={{ label: 'Connected', value: CONNECTED_COUNT }}
      searchPlaceholder="Search accounts..."
      actionLabel="Add Account"
      actionIcon={<Plus size={14} />}
      tabs={[
        { id: 'accounts',  label: 'Accounts',  icon: <GitBranch size={13} /> },
        { id: 'approvals', label: 'Approvals', icon: <CheckSquare size={13} /> },
        { id: 'queue',     label: 'Queue',     icon: <Layers size={13} /> },
        { id: 'schedule',  label: 'Schedule',  icon: <Calendar size={13} /> },
        { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={13} /> },
      ]}
      activeTab={activeTab}
      onTabChange={(id: string) => setActiveTab(id as Tab)}
    >
      {activeTab === 'accounts'  && <AccountsTab />}
      {activeTab === 'approvals' && <ApprovalsTab />}
      {activeTab === 'queue'     && <QueueTab />}
      {activeTab === 'schedule'  && <ScheduleTab />}
      {activeTab === 'analytics' && <AnalyticsTab />}
    </ContentPageShell>
  );
}
