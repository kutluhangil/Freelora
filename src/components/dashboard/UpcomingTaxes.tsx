"use client";

import { useTranslations, useLocale } from "next-intl";
import { Calendar } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { daysBetween, formatDate, todayISO } from "@/lib/utils/date";
import type { TaxReminder } from "@/types/database";

const TYPE_TITLE_MAP: Record<string, string> = {
  kdv: "tax.kdv",
  muhtasar: "tax.muhtasar",
  gecici_vergi: "tax.geciciVergi",
  gelir_vergisi: "tax.gelirVergisi",
  sgk: "tax.sgk",
  bagkur: "tax.bagkur",
  us_quarterly: "tax.usQuarterly",
};

export function UpcomingTaxes({ reminders }: { reminders: TaxReminder[] }) {
  const t = useTranslations();
  const locale = useLocale() as "tr" | "en";

  if (!reminders.length) {
    return <EmptyState icon={Calendar} title={t("dashboard.noTaxes")} />;
  }

  return (
    <ul className="divide-y divide-border-subtle">
      {reminders.map((r) => {
        const days = daysBetween(todayISO(), r.due_date);
        const variant = days <= 1 ? "danger" : days <= 7 ? "warning" : "neutral";
        const title = TYPE_TITLE_MAP[r.type] ? t(TYPE_TITLE_MAP[r.type]) : r.title;
        return (
          <li key={r.id} className="flex items-center justify-between py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-text-primary">{title}</p>
              <p className="text-xs text-text-tertiary">{formatDate(r.due_date, "dd MMM yyyy", locale)}</p>
            </div>
            <Badge variant={variant}>
              {days === 0 ? t("tax.today") : `${days} ${t("tax.daysLeft")}`}
            </Badge>
          </li>
        );
      })}
    </ul>
  );
}
