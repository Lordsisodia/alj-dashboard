"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, Flag, Inbox } from "lucide-react";

import { HighlightCard } from "@/components/ui/card-5-static";
import { NotificationsMenu } from "@/components/ui/notifications-menu";
import { Button } from "@/components/ui/button";
import { TierProgressBackdrop } from "@/domains/partnerships/_shared/ui/backgrounds/TierProgressBackdrop";
import { FloatingNavButton } from "@/domains/partnerships/_shared/ui/mobile/FloatingNavButton";
import { SettingsGroupCallout } from "@/domains/partnerships/settings/shared/components/SettingsGroupCallout";
import { getNotifications } from "@/domains/partnerships/notifications/application/notification-service";
import { useNotificationsBackground } from "./hooks/useNotificationsBackground";
import { cn } from "@/lib/utils";

export function NotificationsScreen() {
  const showBg = useNotificationsBackground();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>("all");

  useEffect(() => {
    let mounted = true;
    getNotifications().then((result) => {
      if (!mounted) return;
      if (result.error) {
        setError(result.error);
        setNotifications([]);
      } else {
        setNotifications(result.items);
      }
      setIsLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const unread = notifications.filter((n) => !n.isRead).length;
    return { total: notifications.length, unread };
  }, [notifications]);

  const filteredNotifications = useMemo(
    () =>
      notifications.filter((n) => {
        if (showUnreadOnly && n.isRead) return false;
        if (typeFilter !== "all" && n.type !== typeFilter) return false;
        return true;
      }),
    [notifications, showUnreadOnly, typeFilter],
  );

  const typeOptions = useMemo(() => {
    const types = Array.from(new Set(notifications.map((n) => n.type))).sort();
    return ["all", ...types];
  }, [notifications]);

  return (
    <section className="relative min-h-screen bg-siso-bg-primary text-siso-text-primary">
      {showBg ? <TierProgressBackdrop /> : null}
      <FloatingNavButton />

      <div className="space-y-6 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+96px)] pt-8 lg:px-8">
        <div className="relative">
          <HighlightCard
            color="orange"
            className="w-full max-w-none text-left"
            title="Notifications"
            description="Partner pulse-updates, invites, and shoutouts."
            hideDivider
            hideFooter
            titleClassName="uppercase tracking-[0.22em] font-semibold text-[20px] leading-tight"
            descriptionClassName="text-[11px]"
            icon={<Bell className="h-5 w-5 text-siso-orange" />}
            fullWidth
            showCornerIcon={false}
          />
          <div className="hidden md:flex absolute right-6 top-0 h-16 w-12 bg-white/95 backdrop-blur-sm shadow-lg [clip-path:polygon(0%_0%,100%_0%,100%_100%,50%_75%,0%_100%)]">
            <div className="absolute inset-0 flex items-center justify-center text-orange-500">
              <Flag className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 text-sm text-siso-text-secondary">
          <SettingsGroupCallout
            icon={<Inbox className="h-4 w-4" />}
            title="All activity"
            subtitle={`Latest partner shoutouts across the network • ${stats.total} updates • ${stats.unread} unread`}
            showChevron={false}
          >
            <div className="rounded-[20px] border border-white/10 bg-white/5 p-3 space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-siso-text-muted">
                <Button
                  size="sm"
                  variant={showUnreadOnly ? "secondary" : "ghost"}
                  className={cn(
                    "rounded-full border-white/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em]",
                    showUnreadOnly ? "text-white" : "text-white/70",
                  )}
                  onClick={() => setShowUnreadOnly((prev) => !prev)}
                >
                  Unread only
                </Button>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.2em]">
                  <span className="text-white/70">Type</span>
                  <select
                    className="bg-transparent text-white focus:outline-none"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    {typeOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="h-14 animate-pulse rounded-xl bg-white/5" />
                  ))}
                </div>
              ) : error ? (
                <div className="rounded-xl border border-amber-500/50 bg-amber-500/10 px-3 py-4 text-center text-amber-100">
                  {error}
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-4 text-center text-siso-text-muted">
                  No notifications yet.
                </div>
              ) : (
                <NotificationsMenu items={filteredNotifications} showFilters={false} />
              )}
            </div>
          </SettingsGroupCallout>
        </div>
      </div>
    </section>
  );
}
