"use client";

import { useState } from "react";
import { Bell, CheckCheck, ExternalLink } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { markNotificationRead, markAllNotificationsRead } from "@/lib/actions/notifications";
import type { Notification } from "@/types/database";

const TYPE_ICON: Record<string, string> = {
  invoice_paid: "💰",
  invoice_overdue: "⚠️",
  tax_reminder: "📅",
  invoice_generated: "🧾",
  general: "🔔",
};

interface Props {
  notifications: Notification[];
}

export function NotificationBell({ notifications: initial }: Props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>(initial);
  const router = useRouter();

  const unread = items.filter((n) => !n.read).length;

  async function handleRead(id: string) {
    await markNotificationRead(id);
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  async function handleReadAll() {
    await markAllNotificationsRead();
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-md p-2 text-text-tertiary hover:bg-bg-tertiary hover:text-text-primary transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white leading-none">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-1 w-80 rounded-lg border border-border-default bg-bg-elevated shadow-xl">
            <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
              <span className="text-sm font-medium text-text-primary">Bildirimler</span>
              {unread > 0 && (
                <button
                  onClick={handleReadAll}
                  className="flex items-center gap-1 text-xs text-text-muted hover:text-accent transition-colors"
                >
                  <CheckCheck className="h-3 w-3" />
                  Tümünü okundu işaretle
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-border-subtle">
              {items.length === 0 ? (
                <div className="px-4 py-8 text-center text-xs text-text-muted">
                  Bildirim yok
                </div>
              ) : (
                items.map((n) => (
                  <div
                    key={n.id}
                    className={`flex gap-3 px-4 py-3 transition-colors hover:bg-bg-tertiary ${
                      !n.read ? "bg-accent/[0.04]" : ""
                    }`}
                  >
                    <span className="mt-0.5 shrink-0 text-base leading-none">
                      {TYPE_ICON[n.type] ?? "🔔"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-medium leading-snug ${
                          !n.read ? "text-text-primary" : "text-text-secondary"
                        }`}
                      >
                        {n.title}
                      </p>
                      {n.message && (
                        <p className="mt-0.5 text-xs text-text-tertiary line-clamp-2">
                          {n.message}
                        </p>
                      )}
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <span className="text-[10px] text-text-muted">
                          {new Date(n.created_at).toLocaleDateString("tr-TR")}
                        </span>
                        {n.href && (
                          <button
                            onClick={() => {
                              if (!n.read) handleRead(n.id);
                              setOpen(false);
                              router.push(n.href as "/");
                            }}
                            className="flex items-center gap-0.5 text-[10px] text-accent hover:underline"
                          >
                            <ExternalLink className="h-2.5 w-2.5" />
                            Görüntüle
                          </button>
                        )}
                        {!n.read && !n.href && (
                          <button
                            onClick={() => handleRead(n.id)}
                            className="text-[10px] text-text-muted hover:text-accent transition-colors"
                          >
                            Okundu işaretle
                          </button>
                        )}
                      </div>
                    </div>
                    {!n.read && (
                      <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
