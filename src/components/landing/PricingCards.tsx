"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { PLANS } from "@/lib/constants/plans";
import { cn } from "@/lib/utils/cn";

const FEATURE_KEYS = [
  "projects",
  "clients",
  "invoicesPerMonth",
  "transactionsPerMonth",
  "currencies",
  "pdfInvoice",
  "taxCalendar",
  "csvExport",
  "emailReminders",
  "customCategories",
  "receiptUpload",
  "reports",
  "multiCurrencyDashboard",
  "exchangeRateHistory",
  "advancedReports",
  "prioritySupport",
] as const;

export function PricingCards() {
  const t = useTranslations("pricing");
  const locale = useLocale() as "tr" | "en";
  const [period, setPeriod] = useState<"monthly" | "yearly">("yearly");
  const cur = locale === "tr" ? "₺" : "$";

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{t("title")}</h2>
        <p className="mt-3 text-sm text-text-secondary">{t("subtitle")}</p>

        {/* Toggle */}
        <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-border-subtle bg-bg-secondary p-1">
          <button
            onClick={() => setPeriod("monthly")}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
              period === "monthly" ? "bg-bg-tertiary text-text-primary" : "text-text-tertiary"
            )}
          >
            {t("monthly")}
          </button>
          <button
            onClick={() => setPeriod("yearly")}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
              period === "yearly" ? "bg-bg-tertiary text-text-primary" : "text-text-tertiary"
            )}
          >
            {t("yearly")}
            <span className="rounded-full bg-accent-muted px-1.5 py-0.5 text-[10px] text-accent">
              {t("save20")}
            </span>
          </button>
        </div>
      </div>

      <div className="mt-12 grid gap-4 lg:grid-cols-3">
        {Object.values(PLANS).map((plan, idx) => {
          const featured = plan.id === "pro";
          const price = plan.price[period][locale];
          const monthly = period === "yearly" ? price / 12 : price;
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className={cn(
                "relative flex flex-col rounded-xl border p-6",
                featured
                  ? "border-accent/40 bg-bg-secondary shadow-glow"
                  : "border-border-subtle bg-bg-secondary"
              )}
            >
              {featured && (
                <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full border border-accent/40 bg-bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-accent">
                  <Sparkles className="h-2.5 w-2.5" />
                  {t("recommended")}
                </span>
              )}
              <h3 className="font-display text-lg font-semibold">{t(`plans.${plan.id}`)}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                {price === 0 ? (
                  <span className="font-display text-4xl font-bold tracking-tight">{cur}0</span>
                ) : (
                  <>
                    <span className="font-display text-4xl font-bold tracking-tight" data-tabular>
                      {cur}
                      {Math.round(monthly)}
                    </span>
                    <span className="text-xs text-text-tertiary">{t("perMonth")}</span>
                  </>
                )}
              </div>
              {price > 0 && period === "yearly" && (
                <p className="mt-1 text-[11px] text-text-tertiary">
                  {cur}
                  {price} {t("billedYearly")}
                </p>
              )}

              <ul className="mt-6 space-y-2.5 text-sm">
                {FEATURE_KEYS.map((fk) => {
                  const v = plan.features[fk as keyof typeof plan.features];
                  let label: string | null = null;
                  if (typeof v === "boolean") {
                    if (!v) return null;
                    label = t(`feature.${fk}` as const);
                  } else if (typeof v === "number") {
                    if (v === Number.POSITIVE_INFINITY) {
                      const map: Record<string, string> = {
                        projects: "unlimitedProjects",
                        clients: "unlimitedClients",
                        invoicesPerMonth: "unlimitedInvoices",
                        transactionsPerMonth: "unlimitedTransactions",
                      };
                      label = t(`feature.${map[fk] ?? fk}` as never);
                    } else if (v > 0) {
                      label = t(`feature.${fk}` as const, { count: v });
                    }
                  } else if (Array.isArray(v)) {
                    label = t("feature.currencies", { count: v.length });
                  } else if (v === "all") {
                    label = t("feature.allCurrencies");
                  }
                  if (!label) return null;
                  return (
                    <li key={fk} className="flex items-start gap-2 text-text-secondary">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                      <span>{label}</span>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-auto pt-6">
                <Link href={plan.id === "free" ? "/register" : "/register"}>
                  <Button
                    className="w-full"
                    variant={featured ? "primary" : "secondary"}
                    size="lg"
                  >
                    {plan.id === "free" ? t("startFree") : t("subscribe")}
                  </Button>
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
