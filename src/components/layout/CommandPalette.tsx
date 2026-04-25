"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Command } from "cmdk";
import {
  LayoutDashboard, TrendingUp, TrendingDown, FolderOpen, FileText,
  Users, Calendar, BarChart3, Settings, Plus, Search,
} from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, labelKey: "nav.dashboard", href: "/dashboard" },
  { icon: TrendingUp,       labelKey: "nav.income",    href: "/income" },
  { icon: TrendingDown,     labelKey: "nav.expenses",  href: "/expenses" },
  { icon: FolderOpen,       labelKey: "nav.projects",  href: "/projects" },
  { icon: FileText,         labelKey: "nav.invoices",  href: "/invoices" },
  { icon: Users,            labelKey: "nav.clients",   href: "/clients" },
  { icon: Calendar,         labelKey: "nav.calendar",  href: "/calendar" },
  { icon: BarChart3,        labelKey: "nav.reports",   href: "/reports" },
  { icon: Settings,         labelKey: "nav.settings",  href: "/settings" },
];

const ACTION_ITEMS = [
  { icon: Plus, labelKey: "transaction.addIncome",   href: "/income" },
  { icon: Plus, labelKey: "transaction.addExpense",  href: "/expenses" },
  { icon: Plus, labelKey: "invoice.newInvoice",      href: "/invoices/new" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations();

  const toggle = useCallback(() => setOpen((o) => !o), []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggle();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [toggle]);

  function navigate(href: string) {
    setOpen(false);
    router.push(href as never);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
      onClick={() => setOpen(false)}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg rounded-xl border border-border-default bg-bg-secondary shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="[&_[cmdk-input-wrapper]]:border-b [&_[cmdk-input-wrapper]]:border-border-subtle">
          <div className="flex items-center gap-2 px-4 py-3">
            <Search className="h-4 w-4 shrink-0 text-text-tertiary" />
            <Command.Input
              autoFocus
              placeholder={t("nav.search")}
              className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
            />
            <kbd className="rounded bg-bg-tertiary px-1.5 py-0.5 font-mono text-xs text-text-muted">Esc</kbd>
          </div>
          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-text-tertiary">
              {t("common.noData")}
            </Command.Empty>

            <Command.Group heading={<span className="px-2 text-xs font-medium text-text-muted uppercase tracking-wide">{t("common.actions")}</span>}>
              {ACTION_ITEMS.map((item) => (
                <Command.Item
                  key={item.href + item.labelKey}
                  onSelect={() => navigate(item.href)}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-secondary hover:bg-bg-tertiary hover:text-text-primary aria-selected:bg-bg-tertiary aria-selected:text-text-primary"
                >
                  <item.icon className="h-4 w-4 text-accent" />
                  {t(item.labelKey as never)}
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Separator className="my-1 h-px bg-border-subtle" />

            <Command.Group heading={<span className="px-2 text-xs font-medium text-text-muted uppercase tracking-wide">{t("common.navigation") ?? "Navigate"}</span>}>
              {NAV_ITEMS.map((item) => (
                <Command.Item
                  key={item.href}
                  onSelect={() => navigate(item.href)}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-secondary hover:bg-bg-tertiary hover:text-text-primary aria-selected:bg-bg-tertiary aria-selected:text-text-primary"
                >
                  <item.icon className="h-4 w-4 text-text-tertiary" />
                  {t(item.labelKey as never)}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
