"use client";

import { useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Check, X, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { daysBetween, formatDate, todayISO } from "@/lib/utils/date";
import {
  toggleTaxReminderComplete,
  deleteTaxReminder,
} from "@/lib/actions/tax-reminders";
import type { TaxReminder } from "@/types/database";

const TITLE_KEYS: Record<string, string> = {
  kdv: "tax.kdv",
  muhtasar: "tax.muhtasar",
  gecici_vergi: "tax.geciciVergi",
  gelir_vergisi: "tax.gelirVergisi",
  sgk: "tax.sgk",
  bagkur: "tax.bagkur",
  us_quarterly: "tax.usQuarterly",
};

export function ReminderCard({ reminder }: { reminder: TaxReminder }) {
  const t = useTranslations();
  const locale = useLocale() as "tr" | "en";
  const [pending, start] = useTransition();

  const days = daysBetween(todayISO(), reminder.due_date);
  const overdue = days < 0;
  const variant = reminder.is_completed
    ? "success"
    : overdue
      ? "danger"
      : days <= 3
        ? "warning"
        : "neutral";
  const titleKey = TITLE_KEYS[reminder.type];
  const title = titleKey ? t(titleKey) : reminder.title;

  function toggle() {
    start(async () => {
      try {
        await toggleTaxReminderComplete(reminder.id, !reminder.is_completed);
        toast.success(t("common.save"));
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  }

  function remove() {
    start(async () => {
      try {
        await deleteTaxReminder(reminder.id);
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  }

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4
              className={`text-sm font-semibold ${reminder.is_completed ? "text-text-tertiary line-through" : "text-text-primary"}`}
            >
              {title}
            </h4>
            {reminder.is_recurring && (
              <RefreshCw className="h-3 w-3 text-text-tertiary" aria-hidden />
            )}
          </div>
          <p className="mt-1 text-xs text-text-tertiary">
            {formatDate(reminder.due_date, "dd MMM yyyy", locale)}
          </p>
          {reminder.description && (
            <p className="mt-1.5 text-xs text-text-secondary">{reminder.description}</p>
          )}
        </div>
        <Badge variant={variant}>
          {reminder.is_completed
            ? t("tax.completed")
            : overdue
              ? `${Math.abs(days)} ${t("tax.daysLeft")}`
              : days === 0
                ? t("tax.today")
                : `${days} ${t("tax.daysLeft")}`}
        </Badge>
      </div>
      <div className="mt-3 flex justify-end gap-1">
        <button
          disabled={pending}
          onClick={toggle}
          className="inline-flex items-center gap-1 rounded-md bg-bg-tertiary px-2 py-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
        >
          <Check className="h-3 w-3" />
          {reminder.is_completed ? t("tax.markComplete") : t("tax.markComplete")}
        </button>
        <button
          disabled={pending}
          onClick={remove}
          className="rounded p-1.5 text-text-tertiary hover:bg-danger-muted hover:text-danger transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </Card>
  );
}
