"use client";

import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  ArrowDownToLine,
  ArrowUpFromLine,
  Briefcase,
  Receipt,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Coins,
  ChevronsLeft,
  Sparkles,
  Timer,
  FileText,
} from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { useUIStore } from "@/stores/uiStore";
import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";

interface NavItem {
  href: string;
  icon: typeof LayoutDashboard;
  labelKey: string;
}

const NAV: NavItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, labelKey: "dashboard" },
  { href: "/income", icon: ArrowDownToLine, labelKey: "income" },
  { href: "/expenses", icon: ArrowUpFromLine, labelKey: "expenses" },
  { href: "/projects", icon: Briefcase, labelKey: "projects" },
  { href: "/invoices", icon: Receipt, labelKey: "invoices" },
  { href: "/proposals", icon: FileText, labelKey: "proposals" },
  { href: "/clients", icon: Users, labelKey: "clients" },
  { href: "/time-tracker", icon: Timer, labelKey: "timeTracker" },
  { href: "/calendar", icon: Calendar, labelKey: "calendar" },
  { href: "/reports", icon: BarChart3, labelKey: "reports" },
  { href: "/currency", icon: Coins, labelKey: "currency" },
  { href: "/settings", icon: Settings, labelKey: "settings" },
];

export function Sidebar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="hidden h-full shrink-0 border-r border-border-subtle bg-bg-secondary/70 backdrop-blur-md md:flex md:flex-col"
    >
      {/* Brand */}
      <div className="flex h-14 items-center gap-2 border-b border-border-subtle px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-text">
          <Sparkles className="h-4 w-4" strokeWidth={2.5} />
        </div>
        {!sidebarCollapsed && (
          <span className="font-display text-base font-bold tracking-tight">Freelora</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 p-3">
        {NAV.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-bg-tertiary text-text-primary"
                  : "text-text-secondary hover:bg-bg-tertiary/60 hover:text-text-primary"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-accent" />
              )}
              <Icon className="h-4 w-4 shrink-0" />
              {!sidebarCollapsed && <span className="truncate">{t(item.labelKey)}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse */}
      <div className="border-t border-border-subtle p-3">
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-xs text-text-tertiary transition-colors hover:bg-bg-tertiary/60 hover:text-text-primary"
        >
          <ChevronsLeft
            className={cn("h-4 w-4 transition-transform", sidebarCollapsed && "rotate-180")}
          />
          {!sidebarCollapsed && <span>{t("collapseSidebar")}</span>}
        </button>
      </div>
    </motion.aside>
  );
}
