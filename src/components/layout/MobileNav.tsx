"use client";

import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  Receipt,
  FileText,
  Timer,
  Settings,
} from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";

const ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, key: "dashboard" },
  { href: "/invoices", icon: Receipt, key: "invoices" },
  { href: "/proposals", icon: FileText, key: "proposals" },
  { href: "/time-tracker", icon: Timer, key: "timeTracker" },
  { href: "/settings", icon: Settings, key: "settings" },
];

export function MobileNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 border-t border-border-subtle bg-bg-secondary/90 backdrop-blur-md md:hidden">
      {ITEMS.map((item) => {
        const Icon = item.icon;
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 py-2 text-[10px]",
              active ? "text-accent" : "text-text-tertiary"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{t(item.key)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
