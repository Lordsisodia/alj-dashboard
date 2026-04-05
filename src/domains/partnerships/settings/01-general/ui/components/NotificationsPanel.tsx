// @ts-nocheck
import { useMemo } from "react";
import { InfoButton } from "@/components/ui/info-button";
import { SettingsGroupCallout } from "@/domains/partnerships/settings/shared/navigation/menu/SettingsGroupCallout";
import { Bell } from "lucide-react";
import { notificationInfoData } from "./notification-info";

type InfoContent = {
  title: string;
  description: string;
  items: string[];
} | null;

type Props = {
  notificationsMaster: boolean;
  setNotificationsMaster: (value: boolean) => void;
  notificationTypes: Record<string, boolean>;
  setNotificationTypes: (value: Record<string, boolean>) => void;
  quietHours: { enabled: boolean; startTime: string; endTime: string; timezone: string };
  setQuietHours: (value: typeof notificationTypes) => void;
  priorityLevels: Record<string, boolean>;
  setPriorityLevels: (value: Record<string, boolean>) => void;
  infoContent: InfoContent;
  setInfoContent: (value: InfoContent) => void;
};

export function NotificationsPanel({
  notificationsMaster,
  setNotificationsMaster,
  notificationTypes,
  setNotificationTypes,
  quietHours,
  setQuietHours,
  priorityLevels,
  setPriorityLevels,
  infoContent,
  setInfoContent,
}: Props) {
  const infoKeys = useMemo(() => Object.keys(notificationInfoData), []);

  return (
    <SettingsGroupCallout
      icon={<Bell className="h-4 w-4" />}
      title="Notifications"
      subtitle="Email, push, and in-app notification preferences"
      showChevron={false}
    >
      <div className="space-y-2">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-siso-text-bold">Master toggle</h3>
            <InfoButton label="About notifications" content="Turn all notifications on or off. You can still fine-tune categories below." />
          </div>
          <div className="flex items-center gap-3 text-sm text-siso-text-muted">
            <input
              type="checkbox"
              checked={notificationsMaster}
              onChange={(e) => setNotificationsMaster(e.target.checked)}
              aria-label="Master notifications toggle"
            />
            <span>{notificationsMaster ? "Notifications enabled" : "Notifications disabled"}</span>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-siso-text-bold">Categories</h3>
            <InfoButton label="About categories" content="Choose which categories you want to receive." />
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm text-siso-text-muted">
            {Object.keys(notificationTypes).map((key) => (
              <label key={key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={notificationTypes[key]}
                  onChange={(e) => setNotificationTypes({ ...notificationTypes, [key]: e.target.checked })}
                />
                <span className="capitalize">{key}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-siso-text-bold">Quiet hours</h3>
            <InfoButton label="About quiet hours" content="Pause non-critical notifications during selected hours." />
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm text-siso-text-muted">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={quietHours.enabled}
                onChange={(e) => setQuietHours({ ...quietHours, enabled: e.target.checked })}
              />
              Enable quiet hours
            </label>
            <input
              type="time"
              value={quietHours.startTime}
              onChange={(e) => setQuietHours({ ...quietHours, startTime: e.target.value })}
              aria-label="Quiet hours start"
            />
            <input
              type="time"
              value={quietHours.endTime}
              onChange={(e) => setQuietHours({ ...quietHours, endTime: e.target.value })}
              aria-label="Quiet hours end"
            />
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-siso-text-bold">Priority levels</h3>
            <InfoButton label="About priority" content="Control which urgency levels you receive." />
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm text-siso-text-muted">
            {Object.keys(priorityLevels).map((key) => (
              <label key={key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={priorityLevels[key]}
                  onChange={(e) => setPriorityLevels({ ...priorityLevels, [key]: e.target.checked })}
                />
                <span className="capitalize">{key}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-siso-text-bold">Learn more</h3>
            <InfoButton label="About notification details" content="Hover a category to learn what we send." />
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-siso-text-muted">
            {infoKeys.map((key) => (
              <button
                key={key}
                className="rounded-full border border-white/10 px-3 py-1"
                onMouseEnter={() => setInfoContent(notificationInfoData[key])}
                onFocus={() => setInfoContent(notificationInfoData[key])}
              >
                {notificationInfoData[key].title}
              </button>
            ))}
          </div>
          {infoContent ? (
            <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-siso-text-primary">
              <h4 className="text-xs uppercase tracking-[0.2em] text-siso-text-muted">{infoContent.title}</h4>
              <p className="text-sm text-siso-text-primary">{infoContent.description}</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-siso-text-muted">
                {infoContent.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      </div>
    </SettingsGroupCallout>
  );
}
