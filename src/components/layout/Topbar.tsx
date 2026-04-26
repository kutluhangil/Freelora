"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search, LogOut, User as UserIcon, Plus } from "lucide-react";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useRouter, Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Notification, Profile } from "@/types/database";
import { Button } from "@/components/ui/Button";
import { NotificationBell } from "@/components/notifications/NotificationBell";

interface Props {
  profile: Profile | null;
  notifications: Notification[];
}

export function Topbar({ profile, notifications }: Props) {
  const t = useTranslations("nav");
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const initials = (profile?.full_name ?? profile?.email ?? "?")
    .split(/\s+/)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border-subtle bg-bg-primary/70 px-4 backdrop-blur-md">
      <div className="relative max-w-md flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
        <input
          placeholder={t("search")}
          className="h-9 w-full rounded-md border border-border-subtle bg-bg-secondary pl-9 pr-12 text-sm text-text-primary placeholder:text-text-muted focus:border-border-default focus:outline-none"
        />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-border-subtle bg-bg-tertiary px-1.5 py-0.5 font-mono text-[10px] text-text-tertiary">
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/invoices/new">
          <Button size="sm" className="hidden sm:inline-flex">
            <Plus className="h-3.5 w-3.5" />
            {t("invoices")}
          </Button>
        </Link>

        <LanguageSwitcher />

        <NotificationBell notifications={notifications} />

        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 rounded-md p-1 pr-2 text-sm hover:bg-bg-tertiary transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-muted text-[10px] font-semibold uppercase text-accent">
              {initials}
            </div>
            <span className="hidden text-xs text-text-secondary md:inline">
              {profile?.full_name ?? profile?.email ?? ""}
            </span>
          </button>
          {open && (
            <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-md border border-border-default bg-bg-elevated p-1 shadow-lg">
              <Link
                href="/settings/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded px-3 py-2 text-sm text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
              >
                <UserIcon className="h-3.5 w-3.5" />
                Profile
              </Link>
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
              >
                <LogOut className="h-3.5 w-3.5" />
                {t("logout")}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
