"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const TESTIMONIALS = [
  {
    name: "Emre Y.",
    role: "Full-Stack Developer",
    country: "🇹🇷",
    text: { tr: "Vergi takvimi özelliği sayesinde artık hiçbir son tarihi kaçırmıyorum. Dashboard gerçekten temiz.", en: "I never miss a tax deadline thanks to the calendar. The dashboard is genuinely clean and fast." },
    avatar: "EY",
  },
  {
    name: "Sara K.",
    role: "UX Designer",
    country: "🇩🇪",
    text: { tr: "Çoklu para birimi desteği benim için oyunun kurallarını değiştirdi. EUR ve USD'yi anında takip ediyorum.", en: "Multi-currency support changed everything for me. I track EUR and USD clients side by side." },
    avatar: "SK",
  },
  {
    name: "Alex R.",
    role: "Content Creator",
    country: "🇺🇸",
    text: { tr: "PDF fatura oluşturma mükemmel. Müşterilerimi etkilemek artık çok kolay.", en: "The PDF invoice generator is excellent. Impressing clients has never been easier." },
    avatar: "AR",
  },
];

export function Testimonials() {
  const t = useTranslations();
  const locale = t("app.name") === "Freelora" ? "en" : "tr";

  return (
    <section className="py-24 px-4 md:px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="font-display text-3xl font-bold tracking-tight text-text-primary">
            {t("landing.testimonials")}
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="rounded-xl border border-border-subtle bg-bg-secondary p-6"
            >
              <p className="text-sm leading-relaxed text-text-secondary">
                "{locale === "en" ? t.text.en : t.text.tr}"
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-muted text-xs font-bold text-accent">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {t.name} {t.country}
                  </p>
                  <p className="text-xs text-text-tertiary">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
