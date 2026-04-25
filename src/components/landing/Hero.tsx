"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";

export function Hero() {
  const t = useTranslations("landing");
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-30" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />

      <div className="mx-auto max-w-5xl px-6 pt-32 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-bg-secondary px-3 py-1 text-xs text-text-secondary">
            <Sparkles className="h-3 w-3 text-accent" />
            <span className="font-medium">For freelancers, by freelancers</span>
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-6 font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl"
        >
          {t("heroTitle")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-5 max-w-2xl text-base text-text-secondary md:text-lg"
        >
          {t("heroSubtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link href="/register">
            <Button size="lg">
              {t("ctaPrimary")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="secondary" size="lg">
              {t("ctaSecondary")}
            </Button>
          </Link>
        </motion.div>

        {/* Floating preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-20 rounded-xl border border-border-default bg-bg-secondary p-2 shadow-lg"
        >
          <div className="overflow-hidden rounded-lg border border-border-subtle bg-bg-primary">
            <div className="flex items-center gap-1.5 border-b border-border-subtle bg-bg-tertiary/50 px-4 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-danger/40" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/40" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/40" />
              <span className="ml-3 font-mono text-[10px] text-text-tertiary">freelora.app/dashboard</span>
            </div>
            <div className="grid gap-3 p-6 md:grid-cols-4">
              <PreviewStat label="Income" value="₺24,500" delta="+12%" tone="success" />
              <PreviewStat label="Expense" value="₺8,200" delta="-5%" tone="danger" />
              <PreviewStat label="Net Profit" value="₺16,300" delta="+18%" tone="accent" />
              <PreviewStat label="Pending" value="3" delta="invoices" tone="muted" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PreviewStat({
  label,
  value,
  delta,
  tone,
}: {
  label: string;
  value: string;
  delta: string;
  tone: "success" | "danger" | "accent" | "muted";
}) {
  const color =
    tone === "success"
      ? "text-success"
      : tone === "danger"
        ? "text-danger"
        : tone === "accent"
          ? "text-accent"
          : "text-text-secondary";
  return (
    <div className="rounded-md border border-border-subtle bg-bg-secondary p-4 text-left">
      <p className="text-[10px] uppercase tracking-wide text-text-tertiary">{label}</p>
      <p className={`mt-2 font-display text-xl font-bold ${color}`} data-tabular>
        {value}
      </p>
      <p className="mt-1 text-[10px] text-text-tertiary">{delta}</p>
    </div>
  );
}
