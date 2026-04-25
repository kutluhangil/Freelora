"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Wallet,
  FileText,
  TrendingUp,
  Calendar,
  Globe,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

const FEATURES: { icon: LucideIcon; titleKey: string; descKey: string }[] = [
  { icon: Wallet, titleKey: "feature1Title", descKey: "feature1Desc" },
  { icon: FileText, titleKey: "feature2Title", descKey: "feature2Desc" },
  { icon: TrendingUp, titleKey: "feature3Title", descKey: "feature3Desc" },
  { icon: Calendar, titleKey: "feature4Title", descKey: "feature4Desc" },
  { icon: Globe, titleKey: "feature5Title", descKey: "feature5Desc" },
  { icon: BarChart3, titleKey: "feature6Title", descKey: "feature6Desc" },
];

export function Features() {
  const t = useTranslations("landing");
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="mx-auto max-w-2xl text-center font-display text-3xl font-bold tracking-tight md:text-4xl">
        {t("featuresTitle")}
      </h2>
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, idx) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.titleKey}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
              className="rounded-xl border border-border-subtle bg-bg-secondary p-6 transition-all hover:border-border-default hover:shadow-sm"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent-muted text-accent">
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="font-display text-base font-semibold text-text-primary">
                {t(f.titleKey)}
              </h3>
              <p className="mt-2 text-sm text-text-secondary">{t(f.descKey)}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
